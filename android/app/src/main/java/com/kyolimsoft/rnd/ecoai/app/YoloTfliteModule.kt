package com.kyolimsoft.rnd.ecoai.app

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.ExifInterface
import android.net.Uri
import android.os.Build
import android.util.Log
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.uimanager.ViewManager
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.gpu.CompatibilityList
import org.tensorflow.lite.gpu.GpuDelegate
import org.tensorflow.lite.nnapi.NnApiDelegate
import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import java.nio.channels.FileChannel
import kotlin.math.max
import kotlin.math.min

class YoloTfliteModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private enum class RuntimeBackend(val displayName: String) {
    GPU("GPU"),
    NNAPI("NNAPI"),
    CPU("CPU"),
  }

  private data class RawDetection(
    val cx: Float,
    val cy: Float,
    val w: Float,
    val h: Float,
    val x1: Float,
    val y1: Float,
    val x2: Float,
    val y2: Float,
    val imageCx: Float,
    val imageCy: Float,
    val imageW: Float,
    val imageH: Float,
    val imageX1: Float,
    val imageY1: Float,
    val imageX2: Float,
    val imageY2: Float,
    val bestClassId: Int,
    val bestScore: Float,
  )

  private data class DecodeCandidate(
    val detectionIndex: Int,
    val cx: Float,
    val cy: Float,
    val w: Float,
    val h: Float,
    val objectness: Float,
    val bestClassId: Int,
    val bestClassScore: Float,
    val finalConfidence: Float,
  )

  private data class PreprocessResult(
    val bitmap: Bitmap,
    val sourceWidth: Int,
    val sourceHeight: Int,
    val scaleX: Float,
    val scaleY: Float,
  )

  private data class BackendCandidate(
    val backend: RuntimeBackend,
    val interpreter: Interpreter,
    val gpuDelegate: GpuDelegate?,
    val nnApiDelegate: NnApiDelegate?,
    val avgModelMs: Double,
  )

  companion object {
    private const val TAG = "YoloTfliteModule"
    private const val MODEL_ASSET_PATH = "detection/yolo/v8_tflite_best_126.tflite"
    private const val MODEL_NUM_CLASSES = 126
    private const val DEBUG_CLASS_ID = 23 // monitor

    private const val CPU_THREADS = 4
    private const val BACKEND_BENCHMARK_RUNS = 2
    // AUTO | GPU_ONLY | NNAPI_ONLY | CPU_ONLY
    private const val BACKEND_SELECTION_MODE = "GPU_ONLY"
    private const val ENABLE_GPU_BACKEND = true
    private const val ENABLE_NNAPI_BACKEND = true
    private const val ENABLE_CPU_BACKEND = true
    private const val FORCE_GPU_ATTEMPT_WHEN_UNSUPPORTED = true

    // 1차 confidence 임계치를 올려 NMS 대상으로 들어오는 박스 수를 줄입니다.
    // NCNN 기준과 맞추기 위해 confidence 임계치를 동일하게 사용합니다.
    private const val CONF_THRESHOLD = 0.25f
    private const val NMS_IOU_THRESHOLD = 0.45f
    private const val MAX_DETECTIONS = 100
  }

  private var interpreter: Interpreter? = null
  private var gpuDelegate: GpuDelegate? = null
  private var nnApiDelegate: NnApiDelegate? = null
  private var runtimeBackend: RuntimeBackend = RuntimeBackend.CPU
  private var cachedInputShape: IntArray? = null
  private var cachedOutputShape: IntArray? = null
  private var cachedInputBuffer: ByteBuffer? = null
  private var cachedOutputBuffer: ByteBuffer? = null
  private var cachedPixels: IntArray? = null
  private var isWarmedUp: Boolean = false

  override fun getName(): String = "YoloTfliteModule"

  override fun invalidate() {
    super.invalidate()
    try {
      interpreter?.close()
    } catch (_: Exception) {
    }
    interpreter = null

    try {
      gpuDelegate?.close()
    } catch (_: Exception) {
    }
    gpuDelegate = null
    try {
      nnApiDelegate?.close()
    } catch (_: Exception) {
    }
    nnApiDelegate = null

    cachedInputShape = null
    cachedOutputShape = null
    cachedInputBuffer = null
    cachedOutputBuffer = null
    cachedPixels = null
    isWarmedUp = false
  }

  @ReactMethod
  fun inferFromImage(cacheImageUri: String, promise: Promise) {
    try {
      // 앱 초기 warmup 호출이 누락된 경우에도 첫 추론 전에 백엔드 선택 + 워밍업을 보장합니다.
      ensureWarmedUp()
      // original 프로젝트와 측정 기준을 맞추기 위해 전체 파이프라인 시간을 함께 계측합니다.
      val totalStartNs = System.nanoTime()
      val localInterpreter = getOrCreateInterpreter()
      val inputShape = localInterpreter.getInputTensor(0).shape()
      val outputShape = localInterpreter.getOutputTensor(0).shape()

      val targetHeight = if (isNchwInput(inputShape)) inputShape[2] else inputShape[1]
      val targetWidth = if (isNchwInput(inputShape)) inputShape[3] else inputShape[2]

      // 이미지 로드/회전/리사이즈/입력 버퍼 변환 시간을 전처리 시간으로 계측합니다.
      val preprocessStartNs = System.nanoTime()
      val preprocessed = loadBitmapFromUri(cacheImageUri, targetWidth, targetHeight)
      val inputBuffer = getOrCreateInputBuffer(inputShape)
      convertBitmapToInputBuffer(preprocessed.bitmap, inputShape, inputBuffer)
      preprocessed.bitmap.recycle()
      val preprocessMs = (System.nanoTime() - preprocessStartNs) / 1_000_000.0

      val outputBuffer = getOrCreateOutputBuffer(outputShape)

      inputBuffer.rewind()
      outputBuffer.rewind()

      // 순수 모델 실행 시간입니다.
      val inferenceStartNs = System.nanoTime()
      localInterpreter.run(inputBuffer, outputBuffer)
      val modelMs = (System.nanoTime() - inferenceStartNs) / 1_000_000.0

      // 출력 버퍼 해석 + 후처리 시간을 별도 계측합니다.
      val postprocessStartNs = System.nanoTime()
      outputBuffer.rewind()
      val detections = postprocess(outputBuffer.asFloatBuffer(), outputShape, preprocessed)
      val postprocessMs = (System.nanoTime() - postprocessStartNs) / 1_000_000.0
      val totalMs = (System.nanoTime() - totalStartNs) / 1_000_000.0

      Log.i(
        TAG,
        "Timing: preprocess=${"%.1f".format(preprocessMs)}ms, model=${"%.1f".format(modelMs)}ms, postprocess=${"%.1f".format(postprocessMs)}ms, total=${"%.1f".format(totalMs)}ms, backend=${runtimeBackend.displayName}"
      )

      val payload = Arguments.createMap().apply {
        putArray("detections", toWritableArray(detections))
        // original과 맞춰 전체 파이프라인 시간을 inference_ms로 반환합니다.
        putDouble("inference_ms", totalMs)
        putDouble("preprocess_ms", preprocessMs)
        putDouble("model_ms", modelMs)
        putDouble("postprocess_ms", postprocessMs)
        putString("backend", runtimeBackend.displayName)
      }
      promise.resolve(payload)
    } catch (error: Throwable) {
      // 네이티브 계층의 Error까지 잡아 JS로 안전하게 전달합니다.
      Log.e(TAG, "inferFromImage failed", error)
      promise.reject("INFERENCE_ERROR", error)
    }
  }

  @ReactMethod
  fun warmup(promise: Promise) {
    try {
      val warmupMs = ensureWarmedUp()
      Log.i(TAG, "Warmup completed: ${"%.1f".format(warmupMs)}ms, backend=${runtimeBackend.displayName}")
      promise.resolve(true)
    } catch (error: Throwable) {
      Log.w(TAG, "Warmup failed: ${error.message}")
      promise.resolve(false)
    }
  }

  private fun getOrCreateInterpreter(): Interpreter {
    interpreter?.let { return it }

    val modelBuffer = loadModelBuffer()
    logBackendEnvironment()
    // 기기별 편차를 줄이기 위해 GPU/NNAPI/CPU 후보를 시도 후 짧은 벤치로 더 빠른 경로를 선택합니다.
    val backends = resolveBackendCandidates()
    if (backends.isEmpty()) {
      throw IllegalStateException("No runtime backend candidates configured")
    }
    val candidates = mutableListOf<BackendCandidate>()
    var lastError: Throwable? = null

    for (backend in backends) {
      try {
        val candidate = createBackendCandidate(modelBuffer, backend)
        candidates.add(candidate)
        Log.i(
          TAG,
          "Backend candidate ready: ${backend.displayName}, avg_model_ms=${"%.1f".format(candidate.avgModelMs)}"
        )
      } catch (error: Throwable) {
        // Delegate 초기화 단계에서 발생하는 LinkageError도 후보 실패로 처리합니다.
        lastError = error
        Log.w(
          TAG,
          "Backend candidate failed: ${backend.displayName}, reason=${describeThrowable(error)}",
          error
        )
      }
    }

    if (candidates.isEmpty()) {
      throw RuntimeException("Failed to initialize TFLite interpreter", lastError)
    }

    val selected = candidates.minByOrNull { it.avgModelMs } ?: candidates.first()

    for (candidate in candidates) {
      if (candidate !== selected) {
        try {
          candidate.interpreter.close()
        } catch (_: Exception) {
        }
        try {
          candidate.gpuDelegate?.close()
        } catch (_: Exception) {
        }
        try {
          candidate.nnApiDelegate?.close()
        } catch (_: Exception) {
        }
      }
    }

    interpreter = selected.interpreter
    gpuDelegate = selected.gpuDelegate
    nnApiDelegate = selected.nnApiDelegate
    runtimeBackend = selected.backend
    val selectedInputShape = selected.interpreter.getInputTensor(0).shape()
    val selectedLayout = if (isNchwInput(selectedInputShape)) "NCHW" else "NHWC"

    Log.i(
      TAG,
      "Interpreter initialized with backend=${selected.backend.displayName}, avg_model_ms=${"%.1f".format(selected.avgModelMs)}"
    )
    Log.i(
      TAG,
      "Model input layout=$selectedLayout, input_shape=${selectedInputShape.contentToString()}"
    )
    return selected.interpreter
  }

  private fun resolveBackendCandidates(): List<RuntimeBackend> {
    val mode = BACKEND_SELECTION_MODE.trim().uppercase()
    return when (mode) {
      "GPU_ONLY" -> listOf(RuntimeBackend.GPU)
      "NNAPI_ONLY" -> listOf(RuntimeBackend.NNAPI)
      "CPU_ONLY" -> listOf(RuntimeBackend.CPU)
      else -> buildList {
        if (ENABLE_GPU_BACKEND) add(RuntimeBackend.GPU)
        if (ENABLE_NNAPI_BACKEND) add(RuntimeBackend.NNAPI)
        if (ENABLE_CPU_BACKEND) add(RuntimeBackend.CPU)
      }
    }
  }

  private fun createBackendCandidate(modelBuffer: ByteBuffer, backend: RuntimeBackend): BackendCandidate {
    var localGpuDelegate: GpuDelegate? = null
    var localNnApiDelegate: NnApiDelegate? = null
    var localInterpreter: Interpreter? = null

    try {
      val options = Interpreter.Options()

      when (backend) {
        RuntimeBackend.GPU -> {
          val compatibilityList = CompatibilityList()
          val isSupported = compatibilityList.isDelegateSupportedOnThisDevice
          Log.i(
            TAG,
            "GPU compatibility: supported=$isSupported, force_attempt=$FORCE_GPU_ATTEMPT_WHEN_UNSUPPORTED"
          )
          val gpuOptions = when {
            isSupported -> compatibilityList.bestOptionsForThisDevice
            FORCE_GPU_ATTEMPT_WHEN_UNSUPPORTED -> {
              Log.w(TAG, "CompatibilityList rejected GPU, trying default GpuDelegate.Options() anyway")
              GpuDelegate.Options()
            }
            else -> {
              throw IllegalStateException("GPU delegate is not supported on this device")
            }
          }
          // 기기별 권장 옵션이 없더라도 기본 옵션으로 한 번 더 시도해 실제 실패 원인을 확인합니다.
          localGpuDelegate = GpuDelegate(gpuOptions)
          options.addDelegate(localGpuDelegate)
          Log.i(TAG, "GPU delegate instantiated successfully")
        }

        RuntimeBackend.NNAPI -> {
          // NNAPI는 기기 드라이버가 NPU/DSP/GPU 중 가능한 가속기를 선택합니다.
          localNnApiDelegate = NnApiDelegate()
          options.addDelegate(localNnApiDelegate)
        }

        RuntimeBackend.CPU -> {
          // CPU 경로에서 XNNPACK + 스레드 최적화를 적용합니다.
          options.setUseXNNPACK(true)
          options.setNumThreads(CPU_THREADS)
        }
      }

      modelBuffer.rewind()
      localInterpreter = Interpreter(modelBuffer, options)

      val inputShape = localInterpreter.getInputTensor(0).shape()
      val outputShape = localInterpreter.getOutputTensor(0).shape()
      val benchInput = ByteBuffer
        .allocateDirect(elementCount(inputShape) * 4)
        .order(ByteOrder.nativeOrder())
      val benchOutput = ByteBuffer
        .allocateDirect(elementCount(outputShape) * 4)
        .order(ByteOrder.nativeOrder())
      zeroFillFloatBuffer(benchInput)
      val avgMs = benchmarkModelMs(localInterpreter, benchInput, benchOutput)

      return BackendCandidate(
        backend = backend,
        interpreter = localInterpreter,
        gpuDelegate = localGpuDelegate,
        nnApiDelegate = localNnApiDelegate,
        avgModelMs = avgMs,
      )
    } catch (error: Throwable) {
      try {
        localInterpreter?.close()
      } catch (_: Exception) {
      }
      try {
        localGpuDelegate?.close()
      } catch (_: Exception) {
      }
      try {
        localNnApiDelegate?.close()
      } catch (_: Exception) {
      }
      throw error
    }
  }

  private fun logBackendEnvironment() {
    Log.i(
      TAG,
      "Backend env: mode=$BACKEND_SELECTION_MODE, sdk=${Build.VERSION.SDK_INT}, manufacturer=${Build.MANUFACTURER}, model=${Build.MODEL}, device=${Build.DEVICE}, hardware=${Build.HARDWARE}, product=${Build.PRODUCT}"
    )
  }

  private fun describeThrowable(error: Throwable): String {
    val chain = mutableListOf<String>()
    var current: Throwable? = error
    while (current != null && chain.size < 5) {
      val message = current.message?.takeIf { it.isNotBlank() } ?: "no message"
      chain.add("${current.javaClass.simpleName}: $message")
      current = current.cause
    }
    return chain.joinToString(" <- ")
  }

  private fun zeroFillFloatBuffer(buffer: ByteBuffer) {
    buffer.rewind()
    while (buffer.remaining() >= 4) {
      buffer.putFloat(0f)
    }
    buffer.rewind()
  }

  private fun benchmarkModelMs(
    localInterpreter: Interpreter,
    inputBuffer: ByteBuffer,
    outputBuffer: ByteBuffer,
  ): Double {
    // 짧은 워밍업 1회로 초기 캐시 비용을 제외하고 평균 추론 시간을 계산합니다.
    inputBuffer.rewind()
    outputBuffer.rewind()
    localInterpreter.run(inputBuffer, outputBuffer)

    var totalMs = 0.0
    repeat(BACKEND_BENCHMARK_RUNS) {
      inputBuffer.rewind()
      outputBuffer.rewind()
      val startNs = System.nanoTime()
      localInterpreter.run(inputBuffer, outputBuffer)
      totalMs += (System.nanoTime() - startNs) / 1_000_000.0
    }

    return totalMs / BACKEND_BENCHMARK_RUNS
  }

  private fun ensureWarmedUp(): Double {
    if (isWarmedUp) {
      return 0.0
    }

    val localInterpreter = getOrCreateInterpreter()
    val inputShape = localInterpreter.getInputTensor(0).shape()
    val outputShape = localInterpreter.getOutputTensor(0).shape()
    val inputBuffer = getOrCreateInputBuffer(inputShape)
    val outputBuffer = getOrCreateOutputBuffer(outputShape)

    // 모델 초기 캐시 생성을 위해 0 입력으로 1회 워밍업을 수행합니다.
    zeroFillFloatBuffer(inputBuffer)
    outputBuffer.rewind()

    val warmupStartNs = System.nanoTime()
    localInterpreter.run(inputBuffer, outputBuffer)
    val warmupMs = (System.nanoTime() - warmupStartNs) / 1_000_000.0
    isWarmedUp = true
    return warmupMs
  }

  private fun loadModelBuffer(): ByteBuffer {
    // 우선 메모리 매핑으로 로드하고 실패 시 스트림 로드로 fallback 합니다.
    try {
      reactContext.assets.openFd(MODEL_ASSET_PATH).use { descriptor ->
        FileInputStream(descriptor.fileDescriptor).use { inputStream ->
          val channel = inputStream.channel
          return channel.map(
            FileChannel.MapMode.READ_ONLY,
            descriptor.startOffset,
            descriptor.declaredLength
          )
        }
      }
    } catch (mappingError: Exception) {
      Log.w(TAG, "openFd mapping failed, fallback to stream loading: ${mappingError.message}")
      reactContext.assets.open(MODEL_ASSET_PATH).use { stream ->
        val bytes = stream.readBytes()
        val buffer = ByteBuffer.allocateDirect(bytes.size).order(ByteOrder.nativeOrder())
        buffer.put(bytes)
        buffer.rewind()
        return buffer
      }
    }
  }

  private fun isNchwInput(shape: IntArray): Boolean {
    return shape.size == 4 && shape[1] == 3
  }

  private fun elementCount(shape: IntArray): Int {
    var count = 1
    for (dim in shape) {
      count *= dim
    }
    return count
  }

  private fun isSameShape(a: IntArray?, b: IntArray): Boolean {
    if (a == null || a.size != b.size) {
      return false
    }
    for (index in b.indices) {
      if (a[index] != b[index]) {
        return false
      }
    }
    return true
  }

  private fun getOrCreateInputBuffer(inputShape: IntArray): ByteBuffer {
    val expectedBytes = elementCount(inputShape) * 4
    val reusable = cachedInputBuffer
    if (reusable != null && isSameShape(cachedInputShape, inputShape) && reusable.capacity() == expectedBytes) {
      reusable.rewind()
      return reusable
    }

    val created = ByteBuffer.allocateDirect(expectedBytes).order(ByteOrder.nativeOrder())
    cachedInputShape = inputShape.copyOf()
    cachedInputBuffer = created
    return created
  }

  private fun getOrCreateOutputBuffer(outputShape: IntArray): ByteBuffer {
    val expectedBytes = elementCount(outputShape) * 4
    val reusable = cachedOutputBuffer
    if (reusable != null && isSameShape(cachedOutputShape, outputShape) && reusable.capacity() == expectedBytes) {
      reusable.rewind()
      return reusable
    }

    val created = ByteBuffer.allocateDirect(expectedBytes).order(ByteOrder.nativeOrder())
    cachedOutputShape = outputShape.copyOf()
    cachedOutputBuffer = created
    return created
  }

  private fun openImageStream(uri: Uri): InputStream? {
    try {
      reactContext.contentResolver.openInputStream(uri)?.let { return it }
    } catch (_: Exception) {
      // contentResolver 경로 실패 시 file 경로를 다시 시도합니다.
    }

    val filePath = when {
      uri.scheme == null -> uri.toString()
      uri.scheme.equals("file", ignoreCase = true) -> uri.path
      else -> null
    }

    if (!filePath.isNullOrEmpty()) {
      try {
        return FileInputStream(File(filePath))
      } catch (_: Exception) {
      }
    }

    return null
  }

  private fun readExifRotation(uri: Uri): Int {
    return try {
      openImageStream(uri)?.use { stream ->
        val exif = ExifInterface(stream)
        when (exif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)) {
          ExifInterface.ORIENTATION_ROTATE_90 -> 90
          ExifInterface.ORIENTATION_ROTATE_180 -> 180
          ExifInterface.ORIENTATION_ROTATE_270 -> 270
          else -> 0
        }
      } ?: 0
    } catch (_: Exception) {
      0
    }
  }

  private fun rotateBitmapIfNeeded(bitmap: Bitmap, rotation: Int): Bitmap {
    if (rotation == 0) {
      return bitmap
    }

    return try {
      val matrix = Matrix()
      matrix.postRotate(rotation.toFloat())
      val rotated = Bitmap.createBitmap(
        bitmap,
        0,
        0,
        bitmap.width,
        bitmap.height,
        matrix,
        true
      )
      if (rotated != bitmap) {
        bitmap.recycle()
      }
      rotated
    } catch (_: Exception) {
      bitmap
    }
  }

  private fun calculateInSampleSize(
    options: BitmapFactory.Options,
    reqWidth: Int,
    reqHeight: Int,
  ): Int {
    val rawHeight = options.outHeight
    val rawWidth = options.outWidth
    var sample = 1

    if (rawHeight > reqHeight || rawWidth > reqWidth) {
      val halfHeight = rawHeight / 2
      val halfWidth = rawWidth / 2
      while (halfHeight / sample >= reqHeight && halfWidth / sample >= reqWidth) {
        sample *= 2
      }
    }

    return max(1, sample)
  }

  private fun loadBitmapFromUri(
    uriString: String,
    targetWidth: Int,
    targetHeight: Int,
  ): PreprocessResult {
    val uri = Uri.parse(uriString)
    val rotation = readExifRotation(uri)

    val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    val boundsStream = openImageStream(uri)
      ?: throw RuntimeException("Failed to open image uri: $uriString")
    boundsStream.use { stream ->
      BitmapFactory.decodeStream(stream, null, bounds)
    }

    // inJustDecodeBounds 모드에서는 decodeStream 반환값이 null일 수 있어 outWidth/outHeight로 검증합니다.
    if (bounds.outWidth <= 0 || bounds.outHeight <= 0) {
      throw RuntimeException("Failed to read image bounds: $uriString")
    }

    val sourceWidth = if (rotation == 90 || rotation == 270) bounds.outHeight else bounds.outWidth
    val sourceHeight = if (rotation == 90 || rotation == 270) bounds.outWidth else bounds.outHeight

    val sample = calculateInSampleSize(bounds, targetWidth, targetHeight)
    val decodeOptions = BitmapFactory.Options().apply {
      inJustDecodeBounds = false
      inSampleSize = sample
    }

    val decoded = openImageStream(uri)?.use { stream ->
      BitmapFactory.decodeStream(stream, null, decodeOptions)
    } ?: throw RuntimeException("Failed to decode image uri: $uriString")

    val rotated = rotateBitmapIfNeeded(decoded, rotation)
    if (sourceWidth <= 0 || sourceHeight <= 0) {
      rotated.recycle()
      throw RuntimeException("Invalid decoded bitmap size: $uriString")
    }

    val resized = Bitmap.createScaledBitmap(rotated, targetWidth, targetHeight, true)
    if (resized != rotated) {
      rotated.recycle()
    }

    return PreprocessResult(
      bitmap = resized,
      sourceWidth = sourceWidth,
      sourceHeight = sourceHeight,
      scaleX = targetWidth.toFloat() / sourceWidth.toFloat(),
      scaleY = targetHeight.toFloat() / sourceHeight.toFloat(),
    )
  }

  private fun convertBitmapToInputBuffer(
    bitmap: Bitmap,
    inputShape: IntArray,
    inputBuffer: ByteBuffer,
  ) {
    val width = bitmap.width
    val height = bitmap.height
    val pixelCount = width * height
    val pixels = if (cachedPixels != null && cachedPixels!!.size == pixelCount) {
      cachedPixels!!
    } else {
      IntArray(pixelCount).also { cachedPixels = it }
    }
    bitmap.getPixels(pixels, 0, width, 0, 0, width, height)

    inputBuffer.rewind()

    if (isNchwInput(inputShape)) {
      for (index in pixels.indices) {
        inputBuffer.putFloat(((pixels[index] shr 16) and 0xFF) / 255f)
      }
      for (index in pixels.indices) {
        inputBuffer.putFloat(((pixels[index] shr 8) and 0xFF) / 255f)
      }
      for (index in pixels.indices) {
        inputBuffer.putFloat((pixels[index] and 0xFF) / 255f)
      }
    } else {
      for (pixel in pixels) {
        inputBuffer.putFloat(((pixel shr 16) and 0xFF) / 255f)
        inputBuffer.putFloat(((pixel shr 8) and 0xFF) / 255f)
        inputBuffer.putFloat((pixel and 0xFF) / 255f)
      }
    }

    inputBuffer.rewind()
  }

  private fun getOutputValue(
    output: FloatBuffer,
    featureIndex: Int,
    detectionIndex: Int,
    featureFirst: Boolean,
    features: Int,
    detections: Int,
  ): Float {
    val index = if (featureFirst) {
      featureIndex * detections + detectionIndex
    } else {
      detectionIndex * features + featureIndex
    }
    return output.get(index)
  }

  private fun postprocess(
    outputBuffer: FloatBuffer,
    outputShape: IntArray,
    preprocessResult: PreprocessResult,
  ): List<RawDetection> {
    if (outputShape.size != 3) {
      throw IllegalStateException("Unsupported output shape: ${outputShape.contentToString()}")
    }

    val dim1 = outputShape[1]
    val dim2 = outputShape[2]
    val featureFirst = dim1 < dim2
    val features = if (featureFirst) dim1 else dim2
    val detections = if (featureFirst) dim2 else dim1

    val hasObjectness = when {
      (features - 4) == MODEL_NUM_CLASSES -> false
      (features - 5) == MODEL_NUM_CLASSES -> true
      else -> false
    }
    val classOffset = if (hasObjectness) 5 else 4
    val numClasses = features - classOffset
    if (numClasses <= 0) {
      return emptyList()
    }

    val rawDetections = mutableListOf<RawDetection>()
    val decodeCandidates = mutableListOf<DecodeCandidate>()
    val maxX = preprocessResult.sourceWidth.toFloat()
    val maxY = preprocessResult.sourceHeight.toFloat()

    Log.i(
      TAG,
      "DecodeSummary: outputShape=${outputShape.contentToString()}, featureFirst=$featureFirst, features=$features, detections=$detections, hasObjectness=$hasObjectness, classOffset=$classOffset, numClasses=$numClasses, confThreshold=$CONF_THRESHOLD"
    )

    for (detectionIndex in 0 until detections) {
      val cx = getOutputValue(outputBuffer, 0, detectionIndex, featureFirst, features, detections)
      val cy = getOutputValue(outputBuffer, 1, detectionIndex, featureFirst, features, detections)
      val w = getOutputValue(outputBuffer, 2, detectionIndex, featureFirst, features, detections)
      val h = getOutputValue(outputBuffer, 3, detectionIndex, featureFirst, features, detections)

      val objectness = if (hasObjectness) {
        getOutputValue(outputBuffer, 4, detectionIndex, featureFirst, features, detections)
      } else {
        1f
      }

      var bestClassId = -1
      var bestClassScore = 0f

      for (classIndex in 0 until numClasses) {
        val classScore = getOutputValue(
          outputBuffer,
          classOffset + classIndex,
          detectionIndex,
          featureFirst,
          features,
          detections
        )
        if (classScore > bestClassScore) {
          bestClassScore = classScore
          bestClassId = classIndex
        }
      }

      if (bestClassId < 0) {
        continue
      }

      val confidence = if (hasObjectness) objectness * bestClassScore else bestClassScore
      if (confidence.isFinite()) {
        decodeCandidates.add(
          DecodeCandidate(
            detectionIndex = detectionIndex,
            cx = cx,
            cy = cy,
            w = w,
            h = h,
            objectness = objectness,
            bestClassId = bestClassId,
            bestClassScore = bestClassScore,
            finalConfidence = confidence,
          )
        )
      }
      if (confidence < CONF_THRESHOLD) {
        continue
      }

      val x1 = cx - w / 2f
      val y1 = cy - h / 2f
      val x2 = cx + w / 2f
      val y2 = cy + h / 2f
      val rawW = x2 - x1
      val rawH = y2 - y1
      if (rawW <= 1f || rawH <= 1f) {
        continue
      }

      val imageX1 = (x1 / preprocessResult.scaleX).coerceIn(0f, maxX)
      val imageY1 = (y1 / preprocessResult.scaleY).coerceIn(0f, maxY)
      val imageX2 = (x2 / preprocessResult.scaleX).coerceIn(0f, maxX)
      val imageY2 = (y2 / preprocessResult.scaleY).coerceIn(0f, maxY)
      val imageW = imageX2 - imageX1
      val imageH = imageY2 - imageY1

      rawDetections.add(
        RawDetection(
          cx = cx,
          cy = cy,
          w = w,
          h = h,
          x1 = x1,
          y1 = y1,
          x2 = x2,
          y2 = y2,
          imageCx = (imageX1 + imageX2) / 2f,
          imageCy = (imageY1 + imageY2) / 2f,
          imageW = imageW,
          imageH = imageH,
          imageX1 = imageX1,
          imageY1 = imageY1,
          imageX2 = imageX2,
          imageY2 = imageY2,
          bestClassId = bestClassId,
          bestScore = confidence,
        )
      )
    }

    logDecodeCandidates(decodeCandidates)
    logDetectionSummary("raw", rawDetections)
    val kept = applyNms(rawDetections)
      .filter { it.imageW > 1f && it.imageH > 1f }
    logDetectionSummary("nms", kept)
    return kept
  }

  private fun applyNms(detections: List<RawDetection>): List<RawDetection> {
    if (detections.isEmpty()) {
      return emptyList()
    }

    // groupBy/sorted/removeAt를 줄여 Kotlin 후처리 오버헤드를 낮춥니다.
    val classBuckets = Array(MODEL_NUM_CLASSES) { mutableListOf<RawDetection>() }
    for (detection in detections) {
      if (detection.bestClassId in 0 until MODEL_NUM_CLASSES) {
        classBuckets[detection.bestClassId].add(detection)
      }
    }

    val kept = mutableListOf<RawDetection>()

    for (classDetections in classBuckets) {
      if (classDetections.isEmpty()) {
        continue
      }

      classDetections.sortByDescending { it.bestScore }
      // NCNN과 동일 조건 비교를 위해 클래스별 후보 제한을 두지 않습니다.
      val candidateCount = classDetections.size
      val suppressed = BooleanArray(candidateCount)

      for (index in 0 until candidateCount) {
        if (suppressed[index]) {
          continue
        }

        val best = classDetections[index]
        kept.add(best)

        for (nextIndex in index + 1 until candidateCount) {
          if (suppressed[nextIndex]) {
            continue
          }
          val candidate = classDetections[nextIndex]
          if (computeIou(best, candidate) >= NMS_IOU_THRESHOLD) {
            suppressed[nextIndex] = true
          }
        }
      }
    }

    return kept
      .sortedByDescending { it.bestScore }
      .take(MAX_DETECTIONS)
  }

  private fun computeIou(a: RawDetection, b: RawDetection): Float {
    // NMS는 복원/클리핑 전 모델 입력 좌표계에서 수행해 박스 형상 왜곡 영향을 줄입니다.
    val interX1 = max(a.x1, b.x1)
    val interY1 = max(a.y1, b.y1)
    val interX2 = min(a.x2, b.x2)
    val interY2 = min(a.y2, b.y2)

    val interW = max(0f, interX2 - interX1)
    val interH = max(0f, interY2 - interY1)
    val interArea = interW * interH

    val areaA = max(0f, a.x2 - a.x1) * max(0f, a.y2 - a.y1)
    val areaB = max(0f, b.x2 - b.x1) * max(0f, b.y2 - b.y1)
    val union = areaA + areaB - interArea

    return if (union <= 0f) 0f else interArea / union
  }

  private fun logDecodeCandidates(candidates: List<DecodeCandidate>) {
    if (candidates.isEmpty()) {
      Log.i(TAG, "DecodeSummary[candidates]: total=0")
      return
    }

    val topCandidates = candidates
      .sortedByDescending { it.finalConfidence }
      .take(10)

    val summary = topCandidates.joinToString(" | ") { candidate ->
      "idx=${candidate.detectionIndex}, cls=${candidate.bestClassId}, conf=${"%.3f".format(candidate.finalConfidence)}, obj=${"%.3f".format(candidate.objectness)}, clsScore=${"%.3f".format(candidate.bestClassScore)}, box=(${ "%.1f".format(candidate.cx)},${"%.1f".format(candidate.cy)},${"%.1f".format(candidate.w)},${"%.1f".format(candidate.h)})"
    }
    Log.i(TAG, "DecodeSummary[candidates]: total=${candidates.size}, top10=$summary")
  }

  private fun logDetectionSummary(stage: String, detections: List<RawDetection>) {
    if (detections.isEmpty()) {
      Log.i(TAG, "DetectionSummary[$stage]: total=0")
      return
    }

    val classCounts = IntArray(MODEL_NUM_CLASSES)
    for (detection in detections) {
      if (detection.bestClassId in 0 until MODEL_NUM_CLASSES) {
        classCounts[detection.bestClassId]++
      }
    }

    val topClassPairs = mutableListOf<Pair<Int, Int>>()
    for (classId in classCounts.indices) {
      val count = classCounts[classId]
      if (count > 0) {
        topClassPairs.add(classId to count)
      }
    }
    topClassPairs.sortByDescending { it.second }
    val topClasses = topClassPairs
      .take(5)
      .joinToString(", ") { "${it.first}:${it.second}" }

    Log.i(
      TAG,
      "DetectionSummary[$stage]: total=${detections.size}, top_classes=$topClasses"
    )

    val debugDetections = detections
      .filter { it.bestClassId == DEBUG_CLASS_ID }
      .sortedByDescending { it.bestScore }
      .take(5)

    if (debugDetections.isNotEmpty()) {
      val summary = debugDetections.joinToString(" | ") { detection ->
        "score=${"%.3f".format(detection.bestScore)}, box=[${"%.1f".format(detection.imageX1)}, ${"%.1f".format(detection.imageY1)}, ${"%.1f".format(detection.imageX2)}, ${"%.1f".format(detection.imageY2)}], size=${"%.1f".format(detection.imageW)}x${"%.1f".format(detection.imageH)}"
      }
      Log.i(TAG, "DetectionSummary[$stage][class=$DEBUG_CLASS_ID]: $summary")
    }
  }

  private fun toWritableArray(detections: List<RawDetection>): WritableArray {
    val resultsArray = Arguments.createArray()

    for (detection in detections) {
      val detectionMap = Arguments.createMap()

      val bboxRawArray = Arguments.createArray().apply {
        // JS는 bbox_raw를 원본 이미지 좌표계(cx, cy, w, h)로 사용합니다.
        pushDouble(detection.imageCx.toDouble())
        pushDouble(detection.imageCy.toDouble())
        pushDouble(detection.imageW.toDouble())
        pushDouble(detection.imageH.toDouble())
      }
      detectionMap.putArray("bbox_raw", bboxRawArray)

      val bestMap = Arguments.createMap().apply {
        putInt("class_id", detection.bestClassId)
        putDouble("score", detection.bestScore.toDouble())
      }
      detectionMap.putMap("best", bestMap)

      resultsArray.pushMap(detectionMap)
    }

    return resultsArray
  }
}

class YoloTflitePackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(YoloTfliteModule(reactContext))
  }

  @Suppress("DEPRECATION")
  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}

object YoloTfliteStartupDiagnostic {
  private const val TAG = "YoloTfliteStartupDiag"
  private const val MODEL_ASSET_PATH = "detection/yolo/v8_tflite_best_126.tflite"
  @Volatile private var started = false

  fun run(context: Context) {
    if (started) {
      return
    }
    started = true

    Thread {
      runCatching { execute(context.applicationContext) }
        .onFailure { error ->
          Log.e(TAG, "Startup GPU diagnostic failed: ${describeThrowable(error)}", error)
        }
    }.start()
  }

  private fun execute(context: Context) {
    val compatibilityList = CompatibilityList()
    val isSupported = compatibilityList.isDelegateSupportedOnThisDevice
    Log.i(
      TAG,
      "Device: sdk=${Build.VERSION.SDK_INT}, manufacturer=${Build.MANUFACTURER}, model=${Build.MODEL}, device=${Build.DEVICE}, hardware=${Build.HARDWARE}, product=${Build.PRODUCT}"
    )
    Log.i(TAG, "CompatibilityList.isDelegateSupportedOnThisDevice=$isSupported")

    val modelBuffer = loadModelBuffer(context)
    var gpuDelegate: GpuDelegate? = null
    var interpreter: Interpreter? = null

    try {
      val options = if (isSupported) {
        compatibilityList.bestOptionsForThisDevice
      } else {
        Log.w(TAG, "CompatibilityList rejected GPU; trying default GpuDelegate.Options()")
        GpuDelegate.Options()
      }

      gpuDelegate = GpuDelegate(options)
      Log.i(TAG, "GpuDelegate created")

      val interpreterOptions = Interpreter.Options().apply {
        addDelegate(gpuDelegate)
      }
      interpreter = Interpreter(modelBuffer, interpreterOptions)

      val inputShape = interpreter.getInputTensor(0).shape()
      val outputShape = interpreter.getOutputTensor(0).shape()
      val inputBuffer = ByteBuffer
        .allocateDirect(elementCount(inputShape) * 4)
        .order(ByteOrder.nativeOrder())
      val outputBuffer = ByteBuffer
        .allocateDirect(elementCount(outputShape) * 4)
        .order(ByteOrder.nativeOrder())

      zeroFillFloatBuffer(inputBuffer)
      outputBuffer.rewind()

      val startNs = System.nanoTime()
      interpreter.run(inputBuffer, outputBuffer)
      val runMs = (System.nanoTime() - startNs) / 1_000_000.0

      Log.i(
        TAG,
        "GPU diagnostic success: input_shape=${inputShape.contentToString()}, output_shape=${outputShape.contentToString()}, run_ms=${"%.1f".format(runMs)}"
      )
    } catch (error: Throwable) {
      Log.e(TAG, "GPU diagnostic error: ${describeThrowable(error)}", error)
    } finally {
      try {
        interpreter?.close()
      } catch (_: Exception) {
      }
      try {
        gpuDelegate?.close()
      } catch (_: Exception) {
      }
    }
  }

  private fun loadModelBuffer(context: Context): ByteBuffer {
    try {
      context.assets.openFd(MODEL_ASSET_PATH).use { descriptor ->
        FileInputStream(descriptor.fileDescriptor).use { inputStream ->
          val channel = inputStream.channel
          return channel.map(
            FileChannel.MapMode.READ_ONLY,
            descriptor.startOffset,
            descriptor.declaredLength
          )
        }
      }
    } catch (mappingError: Exception) {
      Log.w(TAG, "openFd mapping failed, fallback to stream loading: ${mappingError.message}")
      context.assets.open(MODEL_ASSET_PATH).use { stream ->
        val bytes = stream.readBytes()
        val buffer = ByteBuffer.allocateDirect(bytes.size).order(ByteOrder.nativeOrder())
        buffer.put(bytes)
        buffer.rewind()
        return buffer
      }
    }
  }

  private fun zeroFillFloatBuffer(buffer: ByteBuffer) {
    buffer.rewind()
    while (buffer.remaining() >= 4) {
      buffer.putFloat(0f)
    }
    buffer.rewind()
  }

  private fun elementCount(shape: IntArray): Int {
    var count = 1
    for (dim in shape) {
      count *= dim
    }
    return count
  }

  private fun describeThrowable(error: Throwable): String {
    val chain = mutableListOf<String>()
    var current: Throwable? = error
    while (current != null && chain.size < 5) {
      val message = current.message?.takeIf { it.isNotBlank() } ?: "no message"
      chain.add("${current.javaClass.simpleName}: $message")
      current = current.cause
    }
    return chain.joinToString(" <- ")
  }
}

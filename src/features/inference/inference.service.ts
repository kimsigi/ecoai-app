import { NativeModules } from 'react-native';
import {
    InferenceBest,
    InferenceDetection,
    InferenceRunResult,
    LabelCatalogItem,
    NativeInferenceBest,
    NativeInferenceDetection,
    NativeInferencePayload,
    NativeInferencePayloadObject,
    YoloTfliteModuleShape,
} from './inference.type';
import { WASTE_CLASSIFICATION } from './inference.model';
import { whenPlatform } from '@/shared/core/platform';

// AOS MODULE
const androidModule = NativeModules.YoloTfliteModule as
    | YoloTfliteModuleShape
    | undefined;

// IOS MODULE
const iosModule = undefined;

const nativeDetectionModule = whenPlatform({
    android: androidModule,
    ios: iosModule,
});

const labelCatalog = WASTE_CLASSIFICATION as LabelCatalogItem[];
const labelById = new Map<number, LabelCatalogItem>(
    labelCatalog.map(item => [item.id, item]),
);

let warmupRequested = false;
function buildBest(classId: number, score: number): InferenceBest {
    // class_id만 들어와도 라벨/카테고리를 JS에서 복원합니다.
    const item = labelById.get(classId);
    const safeLabel = item?.label ?? `class_${classId}`;
    return {
        class_id: classId,
        score,
        label: safeLabel,
        category1: item?.category1 ?? '',
        category2: item?.category2 ?? '',
        category3: item?.category3 ?? safeLabel,
    };
}

function buildFallbackDetections(): InferenceDetection[] {
    const seed = labelCatalog[0] ?? {
        id: 0,
        label: 'unknown',
        category1: '',
        category2: '',
        category3: 'unknown',
    };

    return [
        {
            bbox_raw: [320, 340, 560, 440],
            best: {
                class_id: seed.id,
                score: 0.92,
                label: seed.label,
                category1: seed.category1,
                category2: seed.category2,
                category3: seed.category3 || seed.label,
            },
        },
    ];
}

function extractTotalMs(payload: NativeInferencePayloadObject): number | null {
    if (Number.isFinite(payload.inference_ms)) {
        return Number(payload.inference_ms);
    }
    if (Number.isFinite(payload.inferenceMs)) {
        return Number(payload.inferenceMs);
    }
    return null;
}

function extractModelMs(payload: NativeInferencePayloadObject): number | null {
    if (Number.isFinite(payload.model_ms)) {
        return Number(payload.model_ms);
    }
    if (Number.isFinite(payload.modelMs)) {
        return Number(payload.modelMs);
    }
    return null;
}

function parseNativePayload(payload: NativeInferencePayload): {
    detections: NativeInferenceDetection[];
    totalMs: number | null;
    modelMs: number | null;
} {
    if (Array.isArray(payload)) {
        return {
            detections: payload,
            totalMs: null,
            modelMs: null,
        };
    }

    if (payload && typeof payload === 'object') {
        return {
            detections: Array.isArray(payload.detections)
                ? payload.detections
                : [],
            totalMs: extractTotalMs(payload),
            modelMs: extractModelMs(payload),
        };
    }

    try {
        const parsed = JSON.parse(payload) as NativeInferencePayload;

        if (Array.isArray(parsed)) {
            return {
                detections: parsed,
                totalMs: null,
                modelMs: null,
            };
        }

        if (parsed && typeof parsed === 'object') {
            return {
                detections: Array.isArray(parsed.detections)
                    ? parsed.detections
                    : [],
                totalMs: extractTotalMs(parsed),
                modelMs: extractModelMs(parsed),
            };
        }

        return {
            detections: [],
            totalMs: null,
            modelMs: null,
        };
    } catch (error) {
        console.warn('[Inference] native payload parse failed:', error);
        return {
            detections: [],
            totalMs: null,
            modelMs: null,
        };
    }
}

function normalizeBest(best: NativeInferenceBest | undefined): InferenceBest {
    if (best && Number.isFinite(best.class_id) && Number.isFinite(best.score)) {
        return buildBest(Number(best.class_id), Number(best.score));
    }
    return buildBest(0, 0);
}

function sanitizeDetections(
    detections: NativeInferenceDetection[],
): InferenceDetection[] {
    return detections
        .filter(
            item => Array.isArray(item.bbox_raw) && item.bbox_raw.length === 4,
        )
        .map(item => {
            const [cx, cy, w, h] = item.bbox_raw as number[];
            const safeCx = Number.isFinite(cx) ? cx : 0;
            const safeCy = Number.isFinite(cy) ? cy : 0;
            const safeW = Number.isFinite(w) ? Math.max(1, w) : 1;
            const safeH = Number.isFinite(h) ? Math.max(1, h) : 1;

            return {
                bbox_raw: [safeCx, safeCy, safeW, safeH],
                best: normalizeBest(item.best),
            };
        });
}

export async function runImageInference(
    cacheImageUri: string,
): Promise<InferenceRunResult> {
    if (nativeDetectionModule?.inferFromImage) {
        const payload = await nativeDetectionModule.inferFromImage(
            cacheImageUri,
        );
        const parsedPayload = parseNativePayload(payload);
        const detections = sanitizeDetections(parsedPayload.detections);

        // 네이티브 모듈 결과를 그대로 사용해 미탐지(0개)도 정상 케이스로 처리합니다.
        return {
            detections,
            totalMs: parsedPayload.totalMs,
            modelMs: parsedPayload.modelMs,
        };
    }

    // 네이티브 모듈이 없는 환경에서만 개발용 fallback을 사용합니다.
    console.log('[Inference] fallback result used for:', cacheImageUri);
    return {
        detections: buildFallbackDetections(),
        totalMs: null,
        modelMs: null,
    };
}

export async function warmupImageInference(): Promise<boolean> {
    console.log('#### warmupImageInference-1: ');
    if (warmupRequested) {
        return false;
    }
    warmupRequested = true;
    console.log('#### warmupImageInference-2: ', warmupRequested);
    try {
        if (nativeDetectionModule?.warmup) {
            console.log('#### warmupImageInference-3: WARMUP!!');
            return await nativeDetectionModule.warmup();
        }
        console.log('#### warmupImageInference-3: WARMUP >>>  false');
        return false;
    } catch (error) {
        // 워밍업 실패는 기능상 치명적이지 않으므로 로그만 남기고 진행합니다.
        console.warn('[Inference] warmup failed:', error);
        return false;
    }
}

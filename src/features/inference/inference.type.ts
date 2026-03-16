export type InferenceBest = {
    label: string;
    // 레벨 기반 분류(대분류/중분류/품목명)를 함께 반환합니다.
    category1: string;
    category2: string;
    category3: string;
    score: number;
    class_id: number;
};

export type InferenceDetection = {
    // bbox_raw는 원본 이미지 좌표계 기준(x_center, y_center, width, height)입니다.
    bbox_raw: [number, number, number, number];
    best: InferenceBest;
};

export type InferenceRunResult = {
    detections: InferenceDetection[];
    // 전체시간은 전처리+모델+후처리 합산 시간입니다.
    totalMs: number | null;
    // 추론시간은 순수 모델 실행 시간입니다.
    modelMs: number | null;
};

export type LabelCatalogItem = {
    id: number;
    label: string;
    // 카테고리 체계는 레벨1/레벨2/레벨3(품목명)으로 관리합니다.
    category1: string;
    category2: string;
    category3: string;
};

export type NativeInferenceBest = {
    class_id?: number;
    score?: number;
};

export type NativeInferenceDetection = {
    bbox_raw?: number[];
    best?: NativeInferenceBest;
};

export type NativeInferencePayloadObject = {
    detections?: NativeInferenceDetection[];
    // 전체 파이프라인 시간(전처리+모델+후처리)
    inference_ms?: number;
    inferenceMs?: number;
    // 세부 단계 시간
    preprocess_ms?: number;
    model_ms?: number;
    postprocess_ms?: number;
    preprocessMs?: number;
    modelMs?: number;
    postprocessMs?: number;
};

export type NativeInferencePayload =
    | NativeInferenceDetection[]
    | NativeInferencePayloadObject
    | string;

export type YoloTfliteModuleShape = {
    // 네이티브 모듈이 연결되면 inferFromImage를 통해 추론 결과를 받습니다.
    inferFromImage?: (cacheImageUri: string) => Promise<NativeInferencePayload>;
    // 첫 추론 지연을 줄이기 위해 앱 시작 시 1회 워밍업을 수행합니다.
    warmup?: () => Promise<boolean>;
};

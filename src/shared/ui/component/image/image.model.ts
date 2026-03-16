import backgoundMap from '@/shared/ui/assets/image/backgoundMap.png';

export const IMAGE_MAP = {
    backgoundMap,
} as const;

export type ImageName = keyof typeof IMAGE_MAP;

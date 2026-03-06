import aiAssistant from '@/shared/ui/assets/image/aiAssistant.png';
import backgoundMap from '@/shared/ui/assets/image/backgoundMap.png';

export const IMAGE_MAP = {
    aiAssistant,
    backgoundMap,
} as const;

export type ImageName = keyof typeof IMAGE_MAP;

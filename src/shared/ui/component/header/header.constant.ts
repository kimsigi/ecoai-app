import { DEFAULT_HEADER_HEIGHT } from '../layout';

export const MODE = {
    TRIGGER: 'trigger',
    INPUT: 'input',
} as const;

export const INPUT_LINE_HEIGHT = 22;
export const INPUT_MIN_HEIGHT = DEFAULT_HEADER_HEIGHT;
export const INPUT_MAX_HEIGHT = INPUT_LINE_HEIGHT * 4;

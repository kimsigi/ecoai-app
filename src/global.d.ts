type RNImageSource = import('react-native').ImageSourcePropType;

declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

declare module '*.png' {
    const value: RNImageSource;
    export default value;
}

declare module '*.jpg' {
    const value: RNImageSource;
    export default value;
}

declare module '*.jpeg' {
    const value: RNImageSource;
    export default value;
}

declare module '*.webp' {
    const value: RNImageSource;
    export default value;
}

declare module '*.gif' {
    const value: RNImageSource;
    export default value;
}

declare module '*.json' {
    const value: unknown;
    export default value;
}

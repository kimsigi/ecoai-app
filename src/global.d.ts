type RNImageSource = import('react-native').ImageSourcePropType;

declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

declare module '*.{png,jpg,jpeg,webp,gif}' {
    const value: RNImageSource;
    export default value;
}

declare module '*.json' {
    const value: unknown;
    export default value;
}

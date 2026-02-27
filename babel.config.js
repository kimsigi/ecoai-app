module.exports = {
    // RN 기본 바벨 설정 (가져다 써야 빌드 안 터짐)
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module-resolver', // 경로 별칭(Alias) 쓰려고 넣는 플러그인
            {
                root: ['./src'], // 기준점은 항상 src 폴더
                alias: {
                    '@': './src', // tsconfig의 paths 설정이랑 똑같이 매칭
                },
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg'],
            },
        ],
        // 반드시 마지막!
        'react-native-reanimated/plugin',
    ],
};

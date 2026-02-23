module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:prettier/recommended', // 프리티어와 충돌하는 린트 규칙을 싹 다 꺼줍니다.
  ],
  rules: {
    // 여기에 추가적인 문법 검사 규칙을 넣을 수 있습니다.
    'no-unused-vars': 'warn', // 안 쓰는 변수는 경고만
  },
};

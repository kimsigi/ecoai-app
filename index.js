import { AppRegistry, Text, TextInput } from 'react-native';
import App from './src/App';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.style = [
    Text.defaultProps.style,
    { fontFamily: 'Pretendard-Regular' },
];

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [
    TextInput.defaultProps.style,
    { fontFamily: 'Pretendard-Regular' },
];

AppRegistry.registerComponent('ecoaiApp', () => App);

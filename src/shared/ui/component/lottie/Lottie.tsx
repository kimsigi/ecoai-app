import React from "react";
import { LOTTIE_MAP, LottieName } from "./lottie.model";
import LottieView from "lottie-react-native";
import { styles } from "./lottie.style";
import { StyleProp, ViewStyle } from "react-native";

interface LottieProps {
  name: LottieName;
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  style?: StyleProp<ViewStyle>;
  scale?: number; 
}

function AppLottie({ 
    name,
    size,
    autoPlay = true,
    loop = true,
    speed = 1,
    style,
    scale = 1,
}: LottieProps) 
{
    const source = LOTTIE_MAP[name];

    return (
        <LottieView
            source={source}
            autoPlay={autoPlay}
            loop={loop}
            speed={speed}
            style={[
                styles.lottie,
                size != null ? { width: size, height: size } : undefined,
                { transform: [{ scale }] },
                style
            ]}
        />
    );
}

export default React.memo(AppLottie);
import React from "react";
import { ICON_MAP, IconName } from "./icon.model";
import { SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
}

function AppIcon({ 
    name, 
    size = 24, 
    width,
    height,
    ...props }: IconProps) 
{
    const Icon = ICON_MAP[name];

    return (
        <Icon
            width={width ?? size}
            height={height ?? size}
            {...props}
        />
    );
}

AppIcon.displayName = "SvgIcon";

export default React.memo(AppIcon);
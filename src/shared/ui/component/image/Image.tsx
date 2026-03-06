import React from "react";
import { Image, ImageProps } from "react-native";
import { IMAGE_MAP, ImageName } from "./image.model";

interface Props extends ImageProps {
  name: ImageName;
}

function AppImage({ name, ...props }: Props) {
  const source = IMAGE_MAP[name];

  return <Image source={source} {...props} />;
}

export default React.memo(AppImage);
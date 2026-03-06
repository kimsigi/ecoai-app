import React from "react";
import { Image, ImageProps } from "react-native";

interface Props extends ImageProps {
  url: string;
}

export default function RemoteImage({ url, ...props }: Props) {
  return (
    <Image
      source={{ uri: url }}
      {...props}
    />
  );
}
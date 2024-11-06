import React from "react";
import { Image, ImageSourcePropType } from "react-native";

const TabBarImage = ({
  icon,
  props,
}: {
  icon: ImageSourcePropType;
  props: any;
}) => {
  return (
    <Image
      source={icon}
      tintColor={props.isFocused ? "black": "#838383"}
      resizeMode="contain"
      className={`w-6 h-6 transition-transform duration-300 ${props.isFocused ? "scale-110" : ""}`}
    />
  );
};

export default TabBarImage;

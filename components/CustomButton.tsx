import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native";

const CustomButton = ({
  children,
  onPress,
  buttonBgColor,
  buttonTextStyles,
}: {
  children: React.ReactNode;
  onPress: any;
  buttonBgColor: string;
  buttonTextStyles: TextStyle;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: buttonBgColor }]}
      activeOpacity={0.6}
    >
      <Text style={[styles.buttonText, buttonTextStyles]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 5,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
});

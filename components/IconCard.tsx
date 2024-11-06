import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

const IconCard = ({
  icon,
  label,
}: {
  icon: ImageSourcePropType;
  label: string;
}) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.imageContainer}>
        <Image source={icon} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export default IconCard;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    gap: 5,
  },
  imageContainer: {
    overflow: "hidden",
    backgroundColor: "#e0f4ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  image: {
    width: 22,
    height: 22,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 400,
  },
});

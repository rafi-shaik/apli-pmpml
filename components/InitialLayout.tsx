import { StyleSheet, Text, View } from "react-native";
import React from "react";

const InitialLayout = ({
  headerText,
  children,
}: {
  headerText: string;
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.bottomContainer}>
        <Text style={styles.mainTitle}>{headerText}</Text>
        <View style={styles.permissionsContainer}>{children}</View>
      </View>
    </View>
  );
};

export default InitialLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#3fa1ae",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 10,
  },
  permissionsContainer: {
    gap: 6,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  mainTitle: {
    color: "white",
    fontSize: 45,
    fontWeight: 300,
    letterSpacing: 3,
    paddingLeft: 15,
  },
});

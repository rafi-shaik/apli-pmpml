import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, TextInput, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const MetroPage = () => {
  return (
    <View style={styles.root}>
      <MapView style={styles.map} />
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Enter Route"
          placeholderTextColor="#666"
        />
      </View>
    </View>
  );
};

export default MetroPage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
  },
});

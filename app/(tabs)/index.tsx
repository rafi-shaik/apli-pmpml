import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants";
import IconCard from "@/components/IconCard";
import MapView from "react-native-maps";

const HomePage = () => {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.cardContainer}>
          <IconCard icon={icons.home} label="Home" />
          <IconCard icon={icons.home} label="Home" />
        </View>
        <View style={styles.cardContainer}>
          <IconCard icon={icons.home} label="Home" />
          <IconCard icon={icons.home} label="Home" />
          <IconCard icon={icons.home} label="Home" />
          <IconCard icon={icons.home} label="Home" />
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.mapHeading}>Nearby</Text>
          <MapView style={styles.map} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 15,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 25,
  },
  mapContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
  },
  map: {
    width: "100%",
    height: 300,
  },
  mapHeading: {
    fontSize: 18,
    fontWeight: 500,
  },
});

import React from "react";
import MapView from "react-native-maps";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, images } from "@/constants";
import IconCard from "@/components/IconCard";

const HomePage = () => {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.cardContainer}>
          <IconCard icon={icons.blackTicket} label="Bus Ticket" />
          <IconCard icon={icons.idCard} label="Daily Pass" />
        </View>
        <View style={styles.cardContainer}>
          <IconCard icon={icons.colorTicket} label="View Ticket" />
          <IconCard icon={icons.colorTicket} label="View Pass" />
          <IconCard icon={icons.routes} label="Route Time Table" />
          <IconCard icon={images.puneMetro} label="Metro Ticket" />
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
    alignItems: "flex-start",
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

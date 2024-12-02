import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { BusData } from "@/types";
import { icons, images } from "@/constants";
import { trimRouteName } from "@/lib/utils";
import { fetchNearByBuses } from "@/lib/api";
import { useLocationStore } from "@/store";
import useDeviceInfo from "@/lib/hooks/useDeviceInfo";

import IconCard from "@/components/IconCard";
import LoadingModal from "@/components/LoadingModal";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";

const HomePage = () => {
  const { setLocation, location } = useLocationStore();

  const deviceId = useDeviceInfo();

  const [showModal, setShowModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getCurrentLocation = async () => {
    let { coords } = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = coords;
    setLocation(latitude, longitude);
  };

  const shouldFetch =
    Boolean(location?.latitude && location?.longitude && deviceId) && isFocused;

  const { data: buses, isLoading } = useQuery({
    queryKey: ["nearby-buses-data", location?.latitude, location?.longitude],
    queryFn: () =>
      fetchNearByBuses(location?.latitude!, location?.longitude!, deviceId),
    enabled: shouldFetch,
    refetchInterval: 5000,
    retry: false,
  });

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);

      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    setShowModal(isLoading);
  }, [isLoading]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const renderBusMarkers = () => {
    return buses?.map((bus: BusData) => {
      const { route } = bus;
      const modifiedRoute = trimRouteName(route);
      return (
        <Marker
          key={bus.id}
          coordinate={{
            latitude: parseFloat(bus.lat),
            longitude: parseFloat(bus.lon),
          }}
          rotation={bus.orientation}
          tracksViewChanges={false}
        >
          {bus.ac === "nac" ? (
            <GreenBusIcon title={modifiedRoute!} />
          ) : (
            <WhiteBusIcon title={modifiedRoute!} />
          )}
        </Marker>
      );
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Image source={images.pmpml} style={{ width: 62, height: 60 }} />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 15,
          paddingTop: 15,
        }}
      >
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
          {location && (
            <MapView
              style={styles.map}
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              showsUserLocation={true}
              showsMyLocationButton={false}
              loadingEnabled={true}
              initialRegion={{
                latitude: location?.latitude!,
                longitude: location?.longitude!,
                latitudeDelta: 0.0734,
                longitudeDelta: 0.0855,
              }}
            >
              {renderBusMarkers()}
            </MapView>
          )}
        </View>
        <LoadingModal
          isVisible={showModal}
          text="Loading buses.Please wait..."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
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
    fontWeight: "500",
  },
});

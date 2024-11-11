import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import DeviceInfo from "react-native-device-info";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { useLocationStore } from "@/store";
import { fetchNearByBuses } from "@/lib/api";

const BusesPage = () => {
  const { location } = useLocationStore();
  // const [deviceId, setDeviceId] = useState("");
  const [region, setRegion] = useState({
    latitude: location?.latitude!,
    longitude: location?.longitude!,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isFocused, setIsFocused] = useState(false);

  // useFocusEffect(() => {
  //   const getDeviceId = async () => {
  //     try {
  //       const id = await DeviceInfo.getUniqueId();
  //       setDeviceId(id);
  //     } catch (error) {
  //       console.error("Error getting device ID:", error);
  //     }
  //   };

  //   getDeviceId();
  // });

  const shouldFetch =
    Boolean(region?.latitude && region?.longitude) && isFocused

  const { data } = useQuery({
    queryKey: ["nearby-buses-data", region?.latitude, region?.longitude],
    queryFn: () => fetchNearByBuses(region?.latitude!, region?.longitude!),
    enabled: shouldFetch,
    retry: false,
    refetchInterval: 8000,
  });

  console.log('hello')


  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);

      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  return (
    <View style={styles.root}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        // initialRegion={{
        //   latitude: location?.latitude!,
        //   longitude: location?.longitude!,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={region}
        // onRegionChangeComplete={setRegion}
      >
        {data &&
          data.map((each, index) => (
            <Marker
              key={`${each.timestamp}_${index}`}
              coordinate={{
                latitude: +each.lat,
                longitude: +each.lon,
              }}
            />
          ))}
      </MapView>
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

export default BusesPage;

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

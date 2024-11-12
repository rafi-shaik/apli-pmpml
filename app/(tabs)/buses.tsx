import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DeviceInfo from "react-native-device-info";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { useLocationStore } from "@/store";
import { fetchNearByBuses } from "@/lib/api";
import { icons } from "@/constants";

interface BusData {
  id: string;
  lat: string;
  lon: string;
  timestamp: number;
}

const BusesPage = () => {
  const { location } = useLocationStore();
  // const [deviceId, setDeviceId] = useState("");

  const initialRegion = {
    latitude: location?.latitude!,
    longitude: location?.longitude!,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialRegion);
  const [isFocused, setIsFocused] = useState(false);

  const mapRef = useRef<MapView>(null);
  const animatedMarkers = useRef<{
    [key: string]: { latitude: Animated.Value; longitude: Animated.Value };
  }>({});

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
    Boolean(region?.latitude && region?.longitude) && isFocused;

  const { data: buses } = useQuery({
    queryKey: ["nearby-buses-data", region?.latitude, region?.longitude],
    queryFn: () => fetchNearByBuses(region?.latitude!, region?.longitude!),
    enabled: shouldFetch,
    retry: false,
    refetchInterval: 5000,
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
    if (buses) {
      buses.forEach((bus: BusData) => {
        if (!animatedMarkers.current[bus.id]) {
          animatedMarkers.current[bus.id] = {
            latitude: new Animated.Value(+bus.lat),
            longitude: new Animated.Value(+bus.lon),
          };
        } else {
          Animated.parallel([
            Animated.timing(animatedMarkers.current[bus.id].latitude, {
              toValue: +bus.lat,
              duration: 5000,
              useNativeDriver: false,
            }),
            Animated.timing(animatedMarkers.current[bus.id].longitude, {
              toValue: +bus.lon,
              duration: 5000,
              useNativeDriver: false,
            }),
          ]).start();
        }
      });
    }
  }, [buses]);

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
      >
        {buses?.map((bus: BusData) => (
          <Marker.Animated
            key={bus.id}
            coordinate={{
              latitude: animatedMarkers.current[bus.id]?.latitude || +bus.lat,
              longitude: animatedMarkers.current[bus.id]?.longitude || +bus.lon,
            }}
          >
            {/* <FontAwesome name="bus" size={24} color="blue" /> */}
          </Marker.Animated>
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
      <TouchableOpacity style={styles.mapCenter} onPress={handleCenterMap}>
        <Image
          source={icons.mapCenter}
          resizeMode="contain"
          style={styles.centerIcon}
        />
      </TouchableOpacity>
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
    shadowRadius: 4,
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
  mapCenter: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  centerIcon: {
    width: 21,
    height: 21,
  },
});

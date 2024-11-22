import Toast from "react-native-root-toast";
import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import DeviceInfo from "react-native-device-info";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import useDebounce from "@/lib/hooks/useDebounce";
import { calculateDistance, trimRouteName } from "@/lib/utils";
import { fetchBusesOnRoute, fetchNearByBuses } from "@/lib/api";

import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";

export interface BusData {
  ac: string;
  id: string;
  lat: string;
  lon: string;
  route: string;
  route_id: string;
  timestamp: number;
  orientation: number;
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

  const [routeInput, setRouteInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [region, setRegion] = useState(initialRegion);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const mapRef = useRef<MapView>(null);
  const animatedMarkers = useRef<{
    [key: string]: { latitude: Animated.Value; longitude: Animated.Value };
  }>({});

  const debouncedSearch = useDebounce(routeInput);

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

  const { data: buses, error } = useQuery({
    queryKey: ["nearby-buses-data", region?.latitude, region?.longitude],
    queryFn: () => fetchNearByBuses(region?.latitude!, region?.longitude!),
    enabled: shouldFetch,
    retry: false,
    refetchInterval: 5000,
  });

  const { data: routeBuses } = useQuery({
    queryKey: ["route-buses", debouncedSearch],
    queryFn: () => fetchBusesOnRoute(debouncedSearch!),
    enabled: !!debouncedSearch,
    retry: false,
  });

  // console.log(routeBuses);

  const textsArray = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    text: "Mock string",
  }));

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      mapRef?.current!.animateToRegion(initialRegion, 1000);
      setRegion(initialRegion);

      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    if (error) {
      Toast.show("No buses available at this time. Please try again.", {
        duration: Toast.durations.SHORT,
        position: -70,
        backgroundColor: "#000000B3",
        textColor: "#fff",
      });
    }
  }, [error]);

  useEffect(() => {
    if (buses) {
      buses.forEach((bus: BusData) => {
        if (!animatedMarkers.current[bus.id]) {
          animatedMarkers.current[bus.id] = {
            latitude: new Animated.Value(parseFloat(bus.lat)),
            longitude: new Animated.Value(parseFloat(bus.lon)),
          };
        } else {
          Animated.parallel([
            Animated.timing(animatedMarkers.current[bus.id].latitude, {
              toValue: parseFloat(bus.lat),
              duration: 5000,
              useNativeDriver: false,
            }),
            Animated.timing(animatedMarkers.current[bus.id].longitude, {
              toValue: parseFloat(bus.lon),
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
      setRegion(initialRegion);
    }
  };

  const renderBusMarkers = () => {
    return buses?.map((bus: BusData) => {
      const { route } = bus;
      const modifiedRoute = trimRouteName(route);
      return (
        <Marker.Animated
          key={bus.id}
          coordinate={{
            latitude:
              animatedMarkers.current[bus.id]?.latitude || parseFloat(bus.lat),
            longitude:
              animatedMarkers.current[bus.id]?.longitude || parseFloat(bus.lon),
          }}
          rotation={bus.orientation}
          tracksViewChanges={false}
        >
          {bus.ac === "nac" ? (
            <GreenBusIcon title={modifiedRoute!} />
          ) : (
            <WhiteBusIcon title={modifiedRoute!} />
          )}
        </Marker.Animated>
      );
    });
  };

  const handleBlur = () => {
    inputRef.current?.blur();
    setIsInputFocused(false);
  };

  const handleRegionChange = (newRegion: Region) => {
    const distance = calculateDistance(
      initialRegion.latitude,
      initialRegion.longitude,
      newRegion.latitude,
      newRegion.longitude
    );

    if (distance > 2) {
      setRegion(newRegion);
    }
  };

  return (
    <View style={styles.root}>
      {!isInputFocused && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            loadingEnabled={true}
            onRegionChangeComplete={handleRegionChange}
          >
            {renderBusMarkers()}
          </MapView>
          <TouchableOpacity style={styles.mapCenter} onPress={handleCenterMap}>
            <Image
              source={icons.mapCenter}
              resizeMode="contain"
              style={styles.centerIcon}
            />
          </TouchableOpacity>
        </>
      )}

      <View style={styles.searchContainer}>
        {isInputFocused ? (
          <Pressable onPress={handleBlur} style={styles.searchIcon}>
            <AntDesign name="arrowleft" size={20} color="black" />
          </Pressable>
        ) : (
          <View style={styles.searchIcon}>
            <FontAwesome name="search" size={20} color="black" />
          </View>
        )}
        <TextInput
          ref={inputRef}
          value={routeInput}
          style={styles.input}
          placeholder="Enter Route"
          placeholderTextColor="#666"
          onChangeText={setRouteInput}
          onFocus={() => setIsInputFocused(true)}
        />
        {routeInput && (
          <Pressable onPress={() => setRouteInput("")}>
            <AntDesign name="close" size={20} color="black" />
          </Pressable>
        )}
      </View>

      {isInputFocused && (
        <View style={styles.list}>
          <FlatList
            data={textsArray}
            keyExtractor={(item) => item.id.toString()}
            renderItem={(itemData) => <Text>{itemData.item.text}</Text>}
          />
        </View>
      )}
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
    paddingHorizontal: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  searchIcon: {
    width: "12%",
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
  list: {
    position: "relative",
    top: 120,
    paddingHorizontal: 20,
  },
});

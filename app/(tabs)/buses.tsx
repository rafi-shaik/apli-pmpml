import Toast from "react-native-root-toast";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import DeviceInfo from "react-native-device-info";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { fetchNearByBuses, fetchNearbyBusStops } from "@/lib/api";

import BusIcon from "@/components/svgs/BusIcon";
import BusStop from "@/components/svgs/BusStop";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";
import BottomSheetLayout from "@/components/BottomSheetLayout";

export interface BusData {
  ac: string;
  id: string;
  agency: string;
  lat: string;
  lon: string;
  route: string;
  route_desc: string;
  timestamp: number;
  orientation: number;
}

export interface BusStop {
  id: string;
  lat: number;
  lng: number;
  name: string;
  next_stop: string;
}

const stops = [
  {
    stop: "Simla Office",
    time: "11:16",
  },
  {
    stop: "Mhasoba Gate",
    time: "11:18",
  },
  {
    stop: "Pumping Station",
    time: "11:19",
  },
  {
    stop: "Mafatlal Bungalow",
    time: "11:20",
  },
  {
    stop: "Rangehills Corner",
    time: "11:21",
  },
  {
    stop: "Pune Vidhyapeeth Gate Aundh Road",
    time: "11:24",
  },
  {
    stop: "Bal Kalyan Sanstha",
    time: "11:26",
  },
  {
    stop: "Gol Market Aundh Road",
    time: "11:27",
  },
  {
    stop: "Kasturba Gandhi Vasahat",
    time: "11:29",
  },
  {
    stop: "Sindh Colony Aundh Road",
    time: "11:31",
  },
  {
    stop: "Bremen Chowk",
    time: "11:32",
  },
  {
    stop: "Bodygate",
    time: "11:34",
  },
  {
    stop: "Aundhgaon",
    time: "11:35",
  },
  {
    stop: "Br Gholap Vidyalay",
    time: "11:38",
  },
  {
    stop: "Navi Sangvi",
    time: "11:39",
  },
  {
    stop: "Panyachi Taki Navi Sangvi",
    time: "11:40",
  },
  {
    stop: "Sai Chowk Navi Sangvi",
    time: "11:41",
  },
  {
    stop: "Simla Office",
    time: "11:16",
  },
  {
    stop: "Mhasoba Gate",
    time: "11:18",
  },
  {
    stop: "Pumping Station",
    time: "11:19",
  },
  {
    stop: "Mafatlal Bungalow",
    time: "11:20",
  },
  {
    stop: "Rangehills Corner",
    time: "11:21",
  },
  {
    stop: "Pune Vidhyapeeth Gate Aundh Road",
    time: "11:24",
  },
  {
    stop: "Bal Kalyan Sanstha",
    time: "11:26",
  },
  {
    stop: "Gol Market Aundh Road",
    time: "11:27",
  },
  {
    stop: "Kasturba Gandhi Vasahat",
    time: "11:29",
  },
  {
    stop: "Simla Office",
    time: "11:16",
  },
  {
    stop: "Mhasoba Gate",
    time: "11:18",
  },
  {
    stop: "Pumping Station",
    time: "11:19",
  },
  {
    stop: "Mafatlal Bungalow",
    time: "11:20",
  },
  {
    stop: "Rangehills Corner",
    time: "11:21",
  },
  {
    stop: "Pune Vidhyapeeth Gate Aundh Road",
    time: "11:24",
  },
  {
    stop: "Bal Kalyan Sanstha",
    time: "11:26",
  },
  {
    stop: "Gol Market Aundh Road",
    time: "11:27",
  },
  {
    stop: "Kasturba Gandhi Vasahat",
    time: "11:29",
  },
  {
    stop: "Simla Office",
    time: "11:16",
  },
  {
    stop: "Mhasoba Gate",
    time: "11:18",
  },
  {
    stop: "Pumping Station",
    time: "11:19",
  },
  {
    stop: "Mafatlal Bungalow",
    time: "11:20",
  },
  {
    stop: "Rangehills Corner",
    time: "11:21",
  },
  {
    stop: "Pune Vidhyapeeth Gate Aundh Road",
    time: "11:24",
  },
  {
    stop: "Bal Kalyan Sanstha",
    time: "11:26",
  },
  {
    stop: "Gol Market Aundh Road",
    time: "11:27",
  },
  {
    stop: "Kasturba Gandhi Vasahat",
    time: "11:29",
  },
];

const BusesPage = () => {
  const { location } = useLocationStore();
  // const [deviceId, setDeviceId] = useState("");

  const router = useRouter();

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
  const [selectedBus, setSelectedBus] = useState<BusData | undefined>();
  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | undefined>();

  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedMarkers = useRef<{
    [key: string]: { latitude: Animated.Value; longitude: Animated.Value };
  }>({});

  const snapPoints = useMemo(() => ["50%", "97%"], []);

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

  const { data: busStops } = useQuery({
    queryKey: ["nearby-bus-stops", region?.latitude, region?.longitude],
    queryFn: () => fetchNearbyBusStops(region?.latitude!, region?.longitude!),
    enabled: shouldFetch,
    retry: false,
  });

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
        bottomSheetRef.current?.close();
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
          onPress={() => {
            setSelectedBus(bus);
            bottomSheetRef.current?.snapToIndex(0);
          }}
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

  const renderBusStopMarkers = () => {
    return busStops?.map((stop: BusStop) => {
      return (
        <Marker
          key={stop.id}
          coordinate={{
            latitude: stop.lat,
            longitude: stop.lng,
          }}
          tracksViewChanges={false}
          onPress={() => {
            setSelectedBusStop(stop);
            bottomSheetRef.current?.snapToIndex(0);
          }}
        >
          <BusStop />
        </Marker>
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
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
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
                {renderBusStopMarkers()}
              </MapView>
              <TouchableOpacity
                style={styles.mapCenter}
                onPress={handleCenterMap}
              >
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

          <BottomSheetLayout
            snapPoints={snapPoints}
            bottomSheetRef={bottomSheetRef}
          >
            <View style={styles.container}>
              <View style={styles.busHeader}>
                <BusIcon color="#219653" />
                <Text style={styles.busTitle}>
                  {trimRouteName(selectedBus?.route!)} -{" "}
                </Text>
              </View>
              <Text style={styles.busId}>{selectedBus?.id!}</Text>

              <Link
                href={{
                  pathname: "/bus-route",
                  params: { route: selectedBus?.route },
                }}
                style={styles.link}
              >
                Route
              </Link>

              <View style={styles.stopsHeader}>
                <Text style={styles.text}>Stop name</Text>
                <Text style={styles.text}>Expected Time</Text>
              </View>

              {stops.map((each, index) => (
                <View key={`${each.stop}_${index}`} style={styles.stopRow}>
                  <Text>{each.stop}</Text>
                  <Text>{each.time}</Text>
                </View>
              ))}
            </View>
          </BottomSheetLayout>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
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
    top: 30,
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
  indicatorStyle: {
    backgroundColor: "#cccccc",
    height: 7,
    width: 50,
  },
  link: {
    fontSize: 14,
    borderWidth: 2,
    borderColor: "#3fa1ae",
    borderRadius: 500,
    paddingHorizontal: 20,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
  container: {
    gap: 10,
    paddingTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  busHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  busTitle: {
    fontWeight: "700",
    fontSize: 20,
  },
  busId: {
    fontWeight: "400",
    fontSize: 18,
  },
  stopsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
});

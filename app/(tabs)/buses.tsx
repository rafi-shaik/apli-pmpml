import Toast from "react-native-root-toast";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useFocusEffect } from "expo-router";
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
  ActivityIndicator,
  Animated,
  Dimensions,
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
import useDebounce from "@/lib/hooks/useDebounce";
import { calculateDistance, trimRouteName } from "@/lib/utils";
import { BusData, BusStop, Option, RouteOption, RouteStop } from "@/types";
import {
  useLocationStore,
  useRouteOptionsStore,
  useRouteSearchedOptionsStore,
} from "@/store";
import {
  fetchNearByBuses,
  fetchNearbyBusStops,
  fetchRouteOptions,
  fetchTransitRouteDetails,
} from "@/lib/api";
import useDeviceInfo from "@/lib/hooks/useDeviceInfo";

import BusIcon from "@/components/svgs/BusIcon";
import LoadingModal from "@/components/LoadingModal";
import CurrentOption from "@/components/CurrentOption";
import BusStopIcon from "@/components/svgs/BusStopIcon";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";
import BottomSheetLayout from "@/components/BottomSheetLayout";

const BusesPage = () => {
  const { location } = useLocationStore();

  const initialRegion = {
    latitude: location?.latitude!,
    longitude: location?.longitude!,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const { previousOptions } = useRouteSearchedOptionsStore();
  const { routeOptions, setRouteOptions } = useRouteOptionsStore();

  const [routeInput, setRouteInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [region, setRegion] = useState(initialRegion);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusData | undefined>();
  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | undefined>();
  const [selectedMarkerType, setSelectedMarkerType] = useState<
    "bus" | "bus-stop" | undefined
  >();
  const [filteredOptions, setFilteredOptions] = useState<RouteOption[]>([]);

  const mapRef = useRef<MapView>(null);
  const inputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedMarkers = useRef<{
    [key: string]: { latitude: Animated.Value; longitude: Animated.Value };
  }>({});

  const snapPoints = useMemo(() => ["50%", "97%"], []);

  const deviceId = useDeviceInfo();
  const debouncedSearch = useDebounce(routeInput);

  const shouldFetch =
    Boolean(region?.latitude && region?.longitude && deviceId) && isFocused;

  const {
    data: buses,
    error,
    isLoading: busesLoading,
  } = useQuery({
    queryKey: ["nearby-buses-data", region?.latitude, region?.longitude],
    queryFn: () =>
      fetchNearByBuses(region?.latitude!, region?.longitude!, deviceId),
    enabled: shouldFetch,
    retry: false,
    refetchInterval: 5000,
  });

  const { data: busStops, isLoading: stopsLoading } = useQuery({
    queryKey: ["nearby-bus-stops", region?.latitude, region?.longitude],
    queryFn: () => fetchNearbyBusStops(region?.latitude!, region?.longitude!),
    enabled: shouldFetch,
    retry: false,
  });

  const { data: routeDetails, isLoading: isRouteDetailsLoading } = useQuery({
    queryKey: ["route-details", selectedBus],
    queryFn: () => fetchTransitRouteDetails(selectedBus?.route!),
    enabled: !!selectedBus?.route,
    retry: false,
  });

  const shouldFetchRouteOptions = routeOptions.length === 0;
  const { data: routes } = useQuery({
    queryKey: ["route-options"],
    queryFn: () => fetchRouteOptions(),
    enabled: shouldFetchRouteOptions,
    retry: false,
  });

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      mapRef?.current?.animateToRegion(initialRegion, 1000);
      setRegion(initialRegion);

      return () => {
        setIsFocused(false);
        setIsInputFocused(false);
        bottomSheetRef.current?.close();
      };
    }, [])
  );

  useEffect(() => {
    if (debouncedSearch === "") {
      setFilteredOptions([]);
    } else if (routeOptions) {
      const filteredOptions = routeOptions
        .filter((route: RouteOption) =>
          route.long_name.startsWith(debouncedSearch)
        )
        .sort((a: RouteOption, b: RouteOption) => {
          const aMatch = a.long_name.match(/^(\d+)/);
          const bMatch = b.long_name.match(/^(\d+)/);

          if (aMatch && bMatch) {
            const aNum = parseInt(aMatch[1], 10);
            const bNum = parseInt(bMatch[1], 10);
            return aNum - bNum;
          }

          return a.long_name.localeCompare(b.long_name);
        });
      setFilteredOptions(filteredOptions);
    }
  }, [debouncedSearch, routeOptions]);

  useEffect(() => {
    if (routes) {
      setRouteOptions(routes);
    }
  }, [routes]);

  useEffect(() => {
    setShowModal(busesLoading || stopsLoading);
  }, [busesLoading, stopsLoading]);

  useEffect(() => {
    if (error) {
      Toast.show("No buses available at this time. Please try again.", {
        duration: Toast.durations.SHORT,
        position: -80,
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
            setSelectedMarkerType("bus");
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
    return busStops?.map((stop: BusStop) => (
      <Marker
        key={stop.id}
        coordinate={{
          latitude: stop.lat,
          longitude: stop.lng,
        }}
        tracksViewChanges={false}
        onPress={() => {
          setSelectedMarkerType("bus-stop");
          setSelectedBusStop(stop);
          bottomSheetRef.current?.snapToIndex(0);
        }}
      >
        <BusStopIcon />
      </Marker>
    ));
  };

  const handleFocus = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsInputFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    inputRef.current?.blur();
    setIsInputFocused(false);
  }, []);

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
      <GestureHandlerRootView style={{ flex: 1 }}>
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
              onFocus={handleFocus}
            />
            {routeInput && (
              <Pressable onPress={() => setRouteInput("")}>
                <AntDesign name="close" size={20} color="black" />
              </Pressable>
            )}
          </View>

          {isInputFocused && (
            <View style={styles.listContainer}>
              {routeInput === "" ? (
                <FlatList
                  data={previousOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={(itemData) => (
                    <PreviousOption option={itemData.item} />
                  )}
                  contentContainerStyle={styles.list}
                />
              ) : (
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={(itemData) => (
                    <CurrentOption option={itemData.item} />
                  )}
                  contentContainerStyle={styles.list}
                />
              )}
            </View>
          )}

          <BottomSheetLayout
            snapPoints={snapPoints}
            bottomSheetRef={bottomSheetRef}
          >
            <View style={styles.container}>
              {isRouteDetailsLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" />
                </View>
              )}
              {selectedMarkerType === "bus" && selectedBus && routeDetails && (
                <>
                  <View style={styles.busHeader}>
                    <BusIcon
                      color={selectedBus.ac === "ac" ? "#838383" : "#219653"}
                    />
                    <Text style={styles.busTitle}>
                      {trimRouteName(selectedBus?.route)} -{" "}
                      {routeDetails?.[0]?.stops?.at(-1)?.name.slice(0, 25)}
                    </Text>
                  </View>
                  <Text style={styles.busId}>{selectedBus?.id}</Text>

                  <View style={styles.linkWrapper}>
                    <Link
                      href={{
                        pathname: "/bus-route",
                        params: { route: selectedBus.route },
                      }}
                      style={styles.link}
                    >
                      Route
                    </Link>
                  </View>

                  <View style={styles.stopsHeader}>
                    <Text style={styles.text}>Stop name</Text>
                    <Text style={styles.text}>Expected Time</Text>
                  </View>

                  {routeDetails[0].stops.map(
                    (each: RouteStop, index: number) => (
                      <View
                        key={`${each.name}_${index}`}
                        style={styles.stopRow}
                      >
                        <Text>{each.name}</Text>
                        <Text>{each.stop_id}</Text>
                      </View>
                    )
                  )}
                </>
              )}

              {selectedMarkerType === "bus-stop" && selectedBusStop && (
                <>
                  <View style={styles.busHeader}>
                    <BusStopIcon />
                    <Text style={styles.busTitle}>
                      {selectedBusStop.name?.length > 40
                        ? `${selectedBusStop.name.slice(0, 30)}...`
                        : selectedBusStop.name}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: "#808080",
                    }}
                  >
                    Towards: {selectedBusStop.next_stop}
                  </Text>
                </>
              )}
            </View>
          </BottomSheetLayout>
          <LoadingModal
            isVisible={showModal}
            text="Loading buses. Please wait..."
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default BusesPage;

const { height } = Dimensions.get("window");

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
    top: 20,
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
    shadowOpacity: 0.2,
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
    bottom: 60,
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
  listContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  indicatorStyle: {
    backgroundColor: "#cccccc",
    height: 7,
    width: 50,
  },
  linkWrapper: {
    borderWidth: 2,
    borderColor: "#3fa1ae",
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  link: {
    fontSize: 14,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 3,
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
    minHeight: 0.5 * height,
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  previousOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 13,
  },
  previousRouteName: {
    fontSize: 17,
  },
  previousEndText: {
    fontSize: 16,
    color: "#838383",
  },
});

const PreviousOption = ({ option }: { option: Option }) => {
  const { end, long_name, id } = option;

  const { setOption } = useRouteSearchedOptionsStore();

  const handlePress = () => {
    const selectedOption = { id, long_name, end };
    setOption(selectedOption);
    router.push({
      pathname: "/bus-route",
      params: { route: long_name },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.previousOptionContainer}>
        <FontAwesome6 name="clock-rotate-left" size={22} color="#838383" />
        <View style={{ gap: 3 }}>
          <Text style={styles.previousRouteName}>
            {trimRouteName(option.long_name)}
          </Text>
          <Text style={styles.previousEndText}>
            Towards {end.length > 30 ? `${end.slice(0, 30)}...` : end}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

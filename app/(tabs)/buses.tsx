import Toast from "react-native-root-toast";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import DeviceInfo from "react-native-device-info";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useFocusEffect } from "expo-router";
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
import {
  useLocationStore,
  useRouteOptionsStore,
  useRouteSearchedOptionsStore,
  useTransitRouteDetailsStore,
} from "@/store";
import {
  fetchNearByBuses,
  fetchNearbyBusStops,
  fetchTransitRouteDetails,
} from "@/lib/api";

import BusIcon from "@/components/svgs/BusIcon";
import BusStopIcon from "@/components/svgs/BusStopIcon";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";
import BottomSheetLayout from "@/components/BottomSheetLayout";

import { BusData, BusStop, RouteOption, RouteStop } from "@/types";

const mockOptions = [
  {
    agency: "PMPML",
    city: "pun",
    description: "168AUP",
    direction: 1,
    end: "Ghorpadi Post",
    id: "10001",
    long_name: "168AUP",
    polyline:
      "_q`pBw}waMsA_Bq@m@yBaBs@s@s@y@k@y@g@}@i@s@Y_@_@e@??aAwA]o@cAyBmA{BW[y@aAkA_A_@]w@cAU]cAkBe@aA_@aACMASRIJGl@u@Ve@To@v@cB??tDyIpByEz@kB??Zu@Vy@zBoFCgAY_CEICSAQTgDAc@??Cu@KyAaAuPCs@BsBICGGCCCI?EBK@EFGJAH?HDFFT?TBPBlB`@dB`@EL_@zC??cAfHrCX~@?bAIEmABm@p@iHE?CI?IBIBAHAHBDH?FlGhAdF`A|DoR??h@iCfB_ICKIK_HsBvAeDzAuD@GBA??DAB?BB@B?FEBE@wArD??uMuGIGGIGQi@sBWw@Sc@_A{AwAs@cC_AFmC??HaDGK@s@Bi@FkBBi@o@cBgBgF??cAwC_DkMEc@Ai@?kACw@I}AOw@OYWY",
    route: "168A",
    short_name: "nan",
    start: "Shaniwarwada Stand",
    trips_count: 85,
    trips_schedule: [
      "19:40",
      "10:00",
      "18:00",
      "14:40",
      "08:40",
      "10:50",
      "17:40",
      "18:10",
      "15:00",
      "06:00",
      "12:00",
      "12:50",
      "08:10",
      "06:50",
      "09:50",
      "19:10",
      "15:30",
      "07:10",
      "11:00",
      "06:10",
      "16:50",
      "16:10",
      "14:00",
      "07:30",
      "12:10",
      "16:00",
      "14:50",
      "06:30",
      "10:40",
      "08:50",
      "12:20",
      "11:20",
      "17:00",
      "15:50",
      "17:20",
      "11:10",
      "06:20",
      "10:20",
      "07:50",
      "12:40",
      "19:00",
      "14:20",
      "09:10",
      "16:40",
      "19:30",
      "07:40",
      "15:40",
      "14:10",
      "14:30",
      "17:10",
      "20:00",
      "10:30",
      "11:40",
      "07:20",
      "13:10",
      "08:00",
      "15:20",
      "08:30",
      "09:20",
      "12:30",
      "11:50",
      "18:40",
      "06:40",
      "19:50",
      "09:00",
      "19:20",
      "17:50",
      "18:20",
      "13:30",
      "16:30",
      "11:30",
      "18:50",
      "10:10",
      "15:10",
      "13:20",
      "07:00",
      "13:50",
      "16:20",
      "09:30",
      "18:30",
      "13:00",
      "17:30",
      "08:20",
      "13:40",
      "09:40",
    ],
  },
  {
    agency: "PMPML",
    city: "pun",
    description: "Metro Shuttle 20DOWN",
    direction: 0,
    end: "Ramwadi Metro Station",
    id: "10000",
    long_name: "Metro Shuttle 20DOWN",
    polyline:
      "akhpBohkbMh@U|Aq@hDAzAC??|HC~CGnCO`AKl@E??rDYtEa@rCi@cCyECMWsD?WHgFCe@Ca@@m@bAqH??DS`AVlElApCx@z@X~@h@BCBCDAD?DBBD@D?FCDCBE@G?eB~BCHAJ@^b@`BdAvDHh@AdBQ`BCh@Ar@Cf@Gd@CR}ASs@Ki@EoB?aADaAJmATkAR@b@??RvO??XdNVh@F@b@VZFnEn@ZJt@N??pMnCAh@??IhBDLAl@?RDZHFBL?JCHGFC@KBIAIEsBMoE[]A??kKGEBG@KAGAEECEgDl@??kLrB??qF`Ay@F}@Ra@L{GbC??[L}E|A{PdF[FWPa@b@??PNnBjBp@x@j@v@f@~@`D~HbApC^tARtABn@@`@Eh@M|@U~@??i@tBuAxE_@nAQbAGn@AfBPfH??NlFTrDr@rQTA??@NW@DfCVtJLtBLhA^bCLt@??`@xBPrAh@fDTnA~AtH@L@F??j@~C`@fClB|IVnAjCtJhDtNi@As@Ky@C??eDM??yDS]Eg@AwAGMzB??wArX??G`A~AJrKf@hBNh@@hA@tFKlBApDBLMJQ@KCSCMg@q@EMCQgA{A_AyAm@kA",
    route: "METRO SHUTTLE 20",
    short_name: "nan",
    start: "International Tech Park Kharadi",
    trips_count: 72,
    trips_schedule: [
      "15:10",
      "16:50",
      "11:10",
      "11:30",
      "09:30",
      "17:40",
      "12:40",
      "12:20",
      "14:30",
      "06:30",
      "10:40",
      "17:30",
      "07:20",
      "07:00",
      "11:50",
      "09:40",
      "17:20",
      "07:40",
      "09:00",
      "07:30",
      "13:20",
      "11:20",
      "14:50",
      "15:30",
      "07:50",
      "08:30",
      "10:30",
      "12:10",
      "06:40",
      "14:40",
      "15:00",
      "13:00",
      "07:10",
      "08:20",
      "08:10",
      "15:20",
      "06:10",
      "16:40",
      "16:20",
      "12:00",
      "10:00",
      "13:50",
      "16:00",
      "09:10",
      "08:50",
      "14:00",
      "15:50",
      "06:50",
      "16:10",
      "09:50",
      "13:30",
      "10:50",
      "06:00",
      "14:10",
      "15:40",
      "09:20",
      "11:40",
      "11:00",
      "13:40",
      "17:00",
      "16:30",
      "14:20",
      "17:10",
      "10:10",
      "12:30",
      "08:00",
      "17:50",
      "08:40",
      "13:10",
      "10:20",
      "06:20",
      "12:50",
    ],
  },
];

const BusesPage = () => {
  const { location } = useLocationStore();
  // const [deviceId, setDeviceId] = useState("");

  const initialRegion = {
    latitude: location?.latitude!,
    longitude: location?.longitude!,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const { routeOptions } = useRouteOptionsStore();
  const { setRouteDetails } = useTransitRouteDetailsStore();
  const { previousOptions } = useRouteSearchedOptionsStore();

  const [routeInput, setRouteInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [region, setRegion] = useState(initialRegion);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedBusRoute, setSelectedBusRoute] = useState<
    string | undefined
  >();
  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | undefined>();
  const [selectedMarkerType, setSelectedMarkerType] = useState<
    "bus" | "bus-stop" | undefined
  >();

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

  const { data: routeDetails, isLoading: isRouteDetailsLoading } = useQuery({
    queryKey: ["route-details", selectedBusRoute],
    queryFn: () => fetchTransitRouteDetails(selectedBusRoute!),
    enabled: !!selectedBusRoute,
    retry: false,
  });

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      mapRef?.current?.animateToRegion(initialRegion, 1000);
      setRegion(initialRegion);

      return () => {
        setIsFocused(false);
        bottomSheetRef.current?.close();
      };
    }, [])
  );

  useEffect(() => {
    if (routeDetails) {
      setRouteDetails(routeDetails[0]);
    }
  }, [routeDetails]);

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
              {routeInput === "" ? (
                <FlatList
                  data={mockOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={(itemData) => (
                    <PreviousOption option={itemData.item} />
                  )}
                />
              ) : (
                <FlatList
                  data={mockOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={(itemData) => (
                    <PreviousOption option={itemData.item} />
                  )}
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
              {selectedMarkerType === "bus" &&
                selectedBusRoute &&
                routeDetails && (
                  <>
                    <View style={styles.busHeader}>
                      <BusIcon color="#219653" />
                      <Text style={styles.busTitle}>
                        {trimRouteName(selectedBusRoute)} -{" "}
                        {routeDetails?.[0]?.stops?.at(-1)?.name}
                      </Text>
                    </View>
                    <Text style={styles.busId}>{selectedBusRoute}</Text>

                    <Link
                      href={{
                        pathname: "/bus-route",
                        params: { route: selectedBusRoute },
                      }}
                      style={styles.link}
                    >
                      Route
                    </Link>

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
                      Towards:{" "}
                      {selectedBusStop.name?.length > 20
                        ? `${selectedBusStop.name.slice(0, 20)}...`
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
    top: 100,
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
    marginBottom: 20,
  },
  previousRouteName: {
    fontSize: 17,
  },
  previousEndText: {
    fontSize: 16,
    color: "#838383",
  },
});

const PreviousOption = ({ option }: { option: RouteOption }) => {
  const { end, long_name } = option;

  return (
    <Link
      href={{
        pathname: "/bus-route",
        params: { route: long_name },
      }}
    >
      <View style={styles.previousOptionContainer}>
        <FontAwesome6 name="clock-rotate-left" size={22} color="#838383" />
        <View style={{ gap: 3 }}>
          <Text style={styles.previousRouteName}>
            {trimRouteName(option.long_name)}
          </Text>
          <Text style={styles.previousEndText}>Towards {end}</Text>
        </View>
      </View>
    </Link>
  );
};

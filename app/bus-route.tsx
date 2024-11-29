import { Link, router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import MapView, {
  Callout,
  MapMarker,
  Marker,
  Polyline,
} from "react-native-maps";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import { BusData, RouteStop } from "@/types";
import { trimRouteName } from "@/lib/utils";
import { fetchBusesOnRoute } from "@/lib/api";
import { useTransitRouteDetailsStore } from "@/store";

import BottomSheet from "@gorhom/bottom-sheet";
import BusStopIcon from "@/components/svgs/BusStopIcon";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";
import BottomSheetLayout from "@/components/BottomSheetLayout";

import polyline from "@mapbox/polyline";

type PolyLinePoint = {
  latitude: number;
  longitude: number;
};

const BusRoute = () => {
  const { route } = useLocalSearchParams<{ route?: string }>();
  const { details } = useTransitRouteDetailsStore();

  const [polylinePath, setPolylinePath] = useState<PolyLinePoint[]>([]);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const markerRefs = useRef<Record<string, React.RefObject<MapMarker>>>({});

  const snapPoints = useMemo(() => ["10%", "90%"], []);

  const { data: routeBuses } = useQuery({
    queryKey: ["route-buses", route],
    queryFn: () => fetchBusesOnRoute(route!),
    enabled: !!route,
    retry: false,
  });

  const coordinates = polyline
    .decode(details?.polyline)
    .map(([latitude, longitude]: [number, number]) => ({
      latitude,
      longitude,
    }));

  const handleFitToPolyline = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (!coordinates) return;

    let currentIndex = 0;

    const interval = setInterval(() => {
      setPolylinePath((prevPath) => {
        if (prevPath.length >= coordinates.length) {
          currentIndex = 0;
          return [];
        }

        const newPath = [...prevPath, coordinates[currentIndex]];
        currentIndex++;
        return newPath;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [coordinates]);

  const renderBusStopMarkers = () => {
    return details?.stops.map((stop: RouteStop, index: number) => {
      if (!markerRefs.current[stop.stop_id]) {
        markerRefs.current[stop.stop_id] = React.createRef<MapMarker>();
      }

      return (
        <Marker
          key={`${stop.stop_id}_${index}`}
          coordinate={{
            latitude: stop.lat,
            longitude: stop.lon,
          }}
          tracksViewChanges={false}
          ref={markerRefs?.current[stop.stop_id]}
          anchor={{ x: 0.5, y: 0.5 }}
          calloutAnchor={{ x: 0.5, y: 0 }}
        >
          <BusStopIcon />
          <Callout style={{ width: "100%", height: "100%" }}>
            <View>
              <Text style={{ fontSize: 14 }}>{stop.name}</Text>
            </View>
          </Callout>
        </Marker>
      );
    });
  };

  const renderBusMarkers = () => {
    return routeBuses?.map((bus: BusData) => {
      const modifiedRoute = trimRouteName(bus.route);
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

  const handleStopClick = (stop: RouteStop) => {
    setSelectedStop(stop);
    mapRef?.current?.animateToRegion(
      {
        latitude: stop.lat,
        longitude: stop.lon,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
    const markerRef = markerRefs.current[stop.stop_id];
    if (markerRef) {
      markerRef?.current?.showCallout();
    }
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <SafeAreaView style={styles.root}>
      <GestureHandlerRootView>
        <View style={styles.root}>
          <View style={styles.topBar}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                paddingHorizontal: 20,
              }}
            >
              <Pressable
                onPress={() => router.back()}
                style={{
                  width: "12%",
                }}
              >
                <AntDesign name="arrowleft" size={20} color="black" />
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 18 }}>
                  Route - {trimRouteName(route!)}
                </Text>
              </View>
              <Text style={{ fontSize: 15 }}>
                {routeBuses?.length} {routeBuses?.length > 1 ? "buses" : "bus"}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              {details && (
                <>
                  <Text>{details?.stops[0].name}</Text>
                  <FontAwesome6
                    name="arrow-right-arrow-left"
                    size={12}
                    color="black"
                  />
                  <Text>{details?.stops.at(-1)?.name}</Text>
                </>
              )}
            </View>
          </View>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={false}
            loadingEnabled={true}
            initialRegion={{
              latitude: 18.5199,
              longitude: 73.8566,
              latitudeDelta: 0.0734,
              longitudeDelta: 0.0855,
            }}
            onLayout={handleFitToPolyline}
          >
            {renderBusMarkers()}
            {renderBusStopMarkers()}

            <Polyline
              coordinates={coordinates}
              strokeColor="black"
              strokeWidth={3}
            />

            {polylinePath.length > 0 && (
              <Polyline
                coordinates={polylinePath}
                strokeColor="#000000"
                strokeWidth={7}
              />
            )}
          </MapView>
        </View>

        <BottomSheetLayout
          index={0}
          snapPoints={snapPoints}
          bottomSheetRef={bottomSheetRef}
          sheetClose={false}
        >
          <View style={styles.container}>
            <View style={styles.linkContainer}>
              <Text style={styles.stopsText}>
                {details?.stops.length} Stops
              </Text>
              <Link
                href={{
                  pathname: "/route-schedule",
                  params: { route },
                }}
                style={styles.link}
              >
                Schedule
              </Link>
            </View>
            <View style={styles.stopsContainer}>
              {details?.stops.map((each: RouteStop, index: number) => {
                const isFirst = index === 0;
                const isLast = index === details.stops.length - 1;
                return (
                  <Pressable
                    key={`${each.stop_id}_${index}`}
                    style={styles.stopRow}
                    onPress={() => handleStopClick(each)}
                  >
                    <View style={styles.markerContainer}>
                      <View
                        style={[
                          styles.circleMarker,
                          isFirst || isLast
                            ? styles.solidCircle
                            : styles.outlinedCircle,
                        ]}
                      />
                      {!isLast && <View style={styles.verticalLine} />}
                    </View>
                    <Text style={styles.stopName}>{each.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </BottomSheetLayout>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default BusRoute;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomWidth: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "white",
    gap: 8,
    paddingVertical: 12,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  container: {
    gap: 10,
    paddingTop: 5,
    paddingHorizontal: 25,
    paddingBottom: 40,
    minHeight: 0.1 * height,
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  stopsText: {
    fontWeight: "700",
    fontSize: 18,
  },
  stopsContainer: {
    marginTop: 10,
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  markerContainer: {
    alignItems: "center",
  },
  circleMarker: {
    width: 13,
    height: 13,
    borderRadius: 8,
  },
  solidCircle: {
    backgroundColor: "#3fa1ae",
  },
  outlinedCircle: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3fa1ae",
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: "#3fa1ae",
  },
  stopName: {
    fontSize: 17,
    color: "#000",
    position: "absolute",
    top: -4,
    left: 30,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});

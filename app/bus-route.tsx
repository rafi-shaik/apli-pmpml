import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import { BusData, BusStop, RouteStop } from "@/types";
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

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "95%"], []);

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
      if (currentIndex < coordinates.length) {
        setPolylinePath((prevPath) => [...prevPath, coordinates[currentIndex]]);
        currentIndex++;
      } else {
        setPolylinePath([]);
        currentIndex = 0;
      }
    }, 70);

    return () => clearInterval(interval);
  }, [coordinates]);

  const renderBusStopMarkers = () => {
    return details?.stops.map((stop: RouteStop) => (
      <Marker
        key={stop.stop_id}
        coordinate={{
          latitude: stop.lat,
          longitude: stop.lon,
        }}
        tracksViewChanges={false}
      >
        <BusStopIcon />
      </Marker>
    ));
  };

  // console.log((polylinePath));
  

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
            {routeBuses?.map((bus: BusData) => {
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
            })}
            {renderBusStopMarkers()}
            

            {/* <Polyline
              coordinates={coordinates}
              strokeColor="#FF0000"
              strokeWidth={3}
            /> */}

            {/* {polylinePath.length > 0 && ( */}
              <Polyline
                coordinates={polylinePath}
                strokeColor="#000" 
                strokeWidth={7}
              />
            
          </MapView>
        </View>
        <BottomSheetLayout
          index={0}
          snapPoints={snapPoints}
          bottomSheetRef={bottomSheetRef}
          sheetClose={false}
        >
          <View style={styles.container}>
            <Text>Bottom Sheet</Text>
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
    backgroundColor: "white",
    gap: 8,
    paddingVertical: 12,
    zIndex: 1000,
  },
  container: {
    gap: 10,
    paddingTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 100,
    minHeight: 0.1 * height,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

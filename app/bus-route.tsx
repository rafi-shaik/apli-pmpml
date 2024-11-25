import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import { BusData } from "./(tabs)/buses";
import { fetchBusesOnRoute, fetchTransitRouteDetails } from "@/lib/api";
import { trimRouteName } from "@/lib/utils";

import BottomSheet from "@gorhom/bottom-sheet";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";
import BottomSheetLayout from "@/components/BottomSheetLayout";

const BusRoute = () => {
  const { route } = useLocalSearchParams<{ route?: string }>();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["10%", "95%"], []);

  const { data: routeBuses } = useQuery({
    queryKey: ["route-buses", route],
    queryFn: () => fetchBusesOnRoute(route!),
    enabled: !!route,
    retry: false,
  });

  const { data: routeDetails, isLoading } = useQuery({
    queryKey: ["route-details", route],
    queryFn: () => fetchTransitRouteDetails(route!),
    enabled: !!route,
    retry: false,
  });

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
              {routeDetails && (
                <>
                  <Text>{routeDetails[0]?.stops?.[0]?.name}</Text>
                  <FontAwesome6
                    name="arrow-right-arrow-left"
                    size={12}
                    color="black"
                  />
                  <Text>{routeDetails[0]?.stops?.at(-1)?.name}</Text>
                </>
              )}
            </View>
          </View>
          <MapView
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

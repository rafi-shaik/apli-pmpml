import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchBusesOnRoute } from "@/lib/api";
import { trimRouteName } from "@/lib/utils";
import { BusData } from "./(tabs)/buses";
import GreenBusIcon from "@/components/svgs/GreenBusIcon";
import WhiteBusIcon from "@/components/svgs/WhiteBusIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheetLayout from "@/components/BottomSheetLayout";
import BottomSheet from "@gorhom/bottom-sheet";

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
            <Text style={{ textAlign: "center" }}> Source to Destination</Text>
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
          <Text>Bottom Sheet</Text>
        </BottomSheetLayout>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default BusRoute;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomWidth: 1
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
});

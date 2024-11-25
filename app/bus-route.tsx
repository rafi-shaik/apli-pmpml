import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MapView from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { fetchBusesOnRoute } from "@/lib/api";
import { trimRouteName } from "@/lib/utils";

const BusRoute = () => {
  const { route } = useLocalSearchParams<{ route?: string }>();

  const { data: routeBuses } = useQuery({
    queryKey: ["route-buses", route],
    queryFn: () => fetchBusesOnRoute(route!),
    enabled: !!route,
    retry: false,
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.root}>
        <View style={styles.topBar}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 15,
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
              <Text style={{ fontSize: 15 }}>
                {routeBuses?.length} {routeBuses?.length > 1 ? "buses" : "bus"}
              </Text>
            </View>
          </View>
        </View>
        <MapView
          style={styles.map}
          zoomEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={false}
          loadingEnabled={true}
          initialRegion={{
            latitude: 18.5199,
            longitude: 73.8566,
            latitudeDelta: 0.0734,
            longitudeDelta: 0.0855,
          }}
        ></MapView>
      </View>
    </SafeAreaView>
  );
};

export default BusRoute;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    backgroundColor: "white",
    gap: 10,
  },
});

import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTransitRouteDetailsStore } from "@/store";
import { trimRouteName } from "@/lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const RouteSchedule = () => {
  const { route } = useLocalSearchParams<{ route?: string }>();
  const { details } = useTransitRouteDetailsStore();

  const sortedSchedule = details?.trips_schedule.sort();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentTime = getCurrentTime();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.root}>
        <View style={styles.topBar}>
          <View style={styles.titleContainer}>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: "12%",
              }}
            >
              <AntDesign name="arrowleft" size={20} color="black" />
            </Pressable>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>
              Schedule - {trimRouteName(route!)}
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
        <ScrollView
          style={{
            paddingTop: 30,
            paddingBottom: 100,
            paddingHorizontal: 20,
            backgroundColor: "white",
            flex: 1,
          }}
        >
          <View style={{ gap: 10, marginBottom: 20 }}>
            <Text style={{ fontWeight: "600" }}>Route Info</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <DetailsContainer
                title="Total Stops"
                detail={`${details?.stops.length}`}
              />
              <DetailsContainer title="Total Time" detail={`NA`} />
            </View>
          </View>

          <View style={{ gap: 10, marginBottom: 20 }}>
            <Text style={{ fontWeight: "600" }}>
              First & Last Bus from {details?.stops[0].name}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <DetailsContainer title="First Bus" detail={sortedSchedule[0]!} />
              <DetailsContainer
                title="Last Bus"
                detail={sortedSchedule?.at(-1)}
              />
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={{ fontWeight: "600" }}>All trips</Text>
            <View style={styles.tripsContainer}>
              {sortedSchedule?.map((trip: string, index: number) => {
                const isLast = index === sortedSchedule.length - 1;
                const isFuture = trip > currentTime;
                return (
                  <Text
                    key={`${trip}_${index}`}
                    style={{ fontSize: 17, color: isFuture ? "red" : "black" }}
                  >
                    {trip}
                    {!isLast && ","}
                  </Text>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default RouteSchedule;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderBottomWidth: 1,
  },
  topBar: {
    width: "100%",
    backgroundColor: "white",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContainer: {
    backgroundColor: "#edf6f7",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    gap: 4,
    flex: 1,
  },
  tripsContainer: {
    backgroundColor: "#edf6f7",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
});

const DetailsContainer = ({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) => {
  return (
    <View style={styles.detailContainer}>
      <Text style={{ fontSize: 15, fontWeight: "300" }}>{title}</Text>
      <Text style={{ fontSize: 18 }}>{detail}</Text>
    </View>
  );
};

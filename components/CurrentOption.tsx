import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import BusIcon from "./svgs/BusIcon";
import { RouteOption } from "@/types";
import { trimRouteName } from "@/lib/utils";
import { router } from "expo-router";
import { useRouteSearchedOptionsStore } from "@/store";

const CurrentOption = ({ option }: { option: RouteOption }) => {
  const { long_name, start, end, id } = option;
  const trimmedRouteName = trimRouteName(long_name);

  const { setOption } = useRouteSearchedOptionsStore();

  const handlePressRouteOption = () => {
    const selectedOption = { id, long_name, end };
    setOption(selectedOption);
    router.push({
      pathname: "/bus-route",
      params: { route: long_name },
    });
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={handlePressRouteOption}
    >
      <View style={styles.nameContainer}>
        <View style={{ alignItems: "center", gap: 5 }}>
          <View style={styles.iconContainer}>
            <BusIcon color="white" width={20} />
          </View>
          <View style={styles.outlinedCircle} />
          <View style={styles.verticalLine} />
          <View style={styles.outlinedCircle} />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={styles.routeName}>{trimmedRouteName}</Text>
          <Text style={styles.locationText}>{start}</Text>
          <Text style={styles.locationText}>{end}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CurrentOption;

const styles = StyleSheet.create({
  itemContainer: {
    gap: 10,
    marginVertical: 13,
  },
  iconContainer: {
    backgroundColor: "#838383",
    padding: 8,
    borderRadius: 10,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "700",
  },
  verticalLine: {
    width: 2,
    height: 10,
    backgroundColor: "#838383",
  },
  outlinedCircle: {
    width: 13,
    height: 13,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#838383",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
});

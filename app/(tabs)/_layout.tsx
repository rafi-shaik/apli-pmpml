import React from "react";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import { icons } from "@/constants";
import TabBar from "@/components/TabBar";

const TabBarIcon = ({
  focused,
  source,
  name,
}: {
  focused: boolean;
  source: ImageSourcePropType;
  name: string;
}) => {
  return (
    <View
      className={`flex flex-col justify-between items-center w-15 h-12 ${
        focused ? "scale-110" : ""
      }`}
    >
      <Image
        source={source}
        tintColor={focused ? "black" : "#838383"}
        resizeMode="contain"
        className="w-6 h-6"
      />

      <Text className={`text-sm ${focused ? "font-semibold" : ""}`}>
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon focused={focused} source={icons.home} name="Home" />
          // ),
        }}
      />

      <Tabs.Screen
        name="near-by"
        options={{
          title: "Near By",
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon
          //     focused={focused}
          //     source={icons.marker}
          //     name="Near By"
          //   />
          // ),
        }}
      />

      <Tabs.Screen
        name="metro"
        options={{
          title: "Metro",
          // href: null,
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon focused={focused} source={icons.train} name="Metro" />
          // ),
        }}
      />
      <Tabs.Screen
        name="complaint"
        options={{
          title: "Complaint",
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon
          //     focused={focused}
          //     source={icons.complaint}
          //     name="Complaint"
          //   />
          // ),
        }}
      />
    </Tabs>
  );
}

import React from "react";
import { Tabs } from "expo-router";
import { Header } from "@react-navigation/elements";

import TabBar from "@/components/TabBar";
import { Image } from "react-native";
import { images } from "@/constants";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "",
          headerLeft: () => (
            <Image source={images.pmpml} style={{ width: 62, height: 62 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="buses"
        options={{
          title: "Buses",
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "FAQs",
          headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: "#03fc0b",
          },
        }}
      />
    </Tabs>
  );
}

import React from "react";
import { Tabs } from "expo-router";

import TabBar from "@/components/TabBar";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="buses"
        options={{
          title: "Buses",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "FAQs",
          headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: "#8BC34A",
          },
        }}
      />
    </Tabs>
  );
}

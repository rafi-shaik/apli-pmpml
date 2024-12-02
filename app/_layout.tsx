import * as React from "react";
import "react-native-reanimated";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { RootSiblingParent } from "react-native-root-siblings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      setStatusBarBackgroundColor("#3fa1ae", false);
    }
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="bus-route" />
          <Stack.Screen name="route-schedule" />
        </Stack>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}

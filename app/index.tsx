import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useLocationStore, useRouteSearchedOptionsStore } from "@/store";
import { ActivityIndicator, View } from "react-native";

const Home = () => {
  const router = useRouter();

  const { loadPreviousOptions } = useRouteSearchedOptionsStore();
  const { isLocationGranted, checkLocationAccess } = useLocationStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await checkLocationAccess();
      await loadPreviousOptions();
      setIsLoading(false);
    };
    loadData();
  }, [checkLocationAccess]);

  useEffect(() => {
    if (!isLoading) {
      if (isLocationGranted) {
        router.replace("/(tabs)");
      } else if (!isLocationGranted) {
        router.replace("/permissions");
      }
    }
  }, [isLoading, isLocationGranted, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Home;

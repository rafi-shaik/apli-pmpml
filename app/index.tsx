import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";

import { useLocationStore } from "@/store";

const Home = () => {
  const router = useRouter();
  const { isLocationGranted, location } = useLocationStore();
  const [isAppReady, setIsAppReady] = useState<boolean | undefined>();

  useEffect(() => {
    if (isLocationGranted && location) {
      setIsAppReady(true);
    } else if (!isLocationGranted) {
      setIsAppReady(false);
    }
  }, [isLocationGranted, location, router]);

  if (isAppReady) {
    return <Redirect href="/(tabs)" />;
  }

  if (!isAppReady) {
    return <Redirect href="/permissions" />;
  }

  return null;
};

export default Home;

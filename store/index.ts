import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LocationStore {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  isLocationGranted: string | null;
  setLocation: (latitude: number, longitude: number) => void;
  setIsLocationGranted: (isGranted: string) => void;
  checkLocationAccess: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  isLocationGranted: "",

  checkLocationAccess: async () => {
    const isGranted = await AsyncStorage.getItem("isLocationGranted");
    set({
      isLocationGranted: isGranted,
    });
  },

  setLocation: async (latitude: number, longitude: number) => {
    const location = { latitude, longitude };
    set({ location });
  },

  setIsLocationGranted: async (isGranted: string) => {
    await AsyncStorage.setItem("isLocationGranted", JSON.stringify(isGranted));
    set({ isLocationGranted: isGranted });
  },
}));

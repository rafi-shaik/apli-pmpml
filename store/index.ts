import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationStore, RouteDetails, TransitRouteStore } from "@/types";

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

export const useTransitRouteDetailsStore = create<TransitRouteStore>((set) => ({
  details: null,
  setRouteDetails: (route_details: RouteDetails) =>
    set({ details: route_details }),
}));

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LocationStore,
  RouteDetails,
  RouteOption,
  RouteOptionsStore,
  RouteSearchedOptionsStore,
  TransitRouteStore,
} from "@/types";

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

export const useRouteSearchedOptionsStore = create<RouteSearchedOptionsStore>(
  (set) => ({
    previousOptions: [],
    setOption: async (option: RouteOption) => {
      const storedOptions = await AsyncStorage.getItem("previous_routes");
      const parsedOptions = storedOptions ? JSON.parse(storedOptions) : [];
      const updatedOptions = [option, ...parsedOptions];
      await AsyncStorage.setItem(
        "previous_routes",
        JSON.stringify(updatedOptions)
      );
      set({ previousOptions: updatedOptions });
    },
    loadPreviousOptions: async () => {
      const storedOptions = await AsyncStorage.getItem("previous_routes");
      const parsedOptions = storedOptions ? JSON.parse(storedOptions) : [];
      set({ previousOptions: parsedOptions });
    },
  })
);

export const useRouteOptionsStore = create<RouteOptionsStore>((set) => ({
  routeOptions: [],
  setRouteOptions: (options: RouteOption[]) => set({ routeOptions: options }),
}));

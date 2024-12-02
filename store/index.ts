import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LocationStore,
  Option,
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
  setRouteDetails: (route_details: RouteDetails | null) =>
    set({ details: route_details }),
}));

export const useRouteSearchedOptionsStore = create<RouteSearchedOptionsStore>(
  (set) => ({
    previousOptions: [],
    setOption: async ({
      id,
      long_name,
      end,
    }: {
      id: string;
      long_name: string;
      end: string;
    }) => {
      const storedOptions = await AsyncStorage.getItem("previous_routes");
      const parsedOptions = storedOptions ? JSON.parse(storedOptions) : [];
      const existingOptionIndex = parsedOptions.findIndex(
        (existingOption: Option) => existingOption.id === id
      );

      let updatedOptions;

      if (existingOptionIndex !== -1) {
        parsedOptions[existingOptionIndex].count += 1;
        updatedOptions = [...parsedOptions];
      } else {
        updatedOptions = [{ id, long_name, end, count: 1 }, ...parsedOptions];
      }

      updatedOptions.sort((a, b) => b.count - a.count);

      await AsyncStorage.setItem(
        "previous_routes",
        JSON.stringify(updatedOptions)
      );
      set({ previousOptions: updatedOptions });
    },
    loadPreviousOptions: async () => {
      const storedOptions = await AsyncStorage.getItem("previous_routes");
      const parsedOptions = storedOptions ? JSON.parse(storedOptions) : [];

      const sortedOptions = parsedOptions.sort(
        (a: Option, b: Option) => b.count - a.count
      );
      set({ previousOptions: sortedOptions });
    },
  })
);

export const useRouteOptionsStore = create<RouteOptionsStore>((set) => ({
  routeOptions: [],
  setRouteOptions: (options: RouteOption[]) => set({ routeOptions: options }),
}));

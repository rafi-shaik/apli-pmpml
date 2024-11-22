import { fetchFunction } from "./utils";

export const fetchNearByBuses = async (
  lat: number,
  lon: number,
  device_id?: any
) => {
  const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/nearby-buses`;

  const options = {
    method: "POST",
    body: JSON.stringify({
      device_id: "unique_id",
      lat,
      lon,
    }),
  };

  try {
    const response = await fetchFunction(url, options);
    const buses = response.data;
    return buses;
  } catch (error: any) {
    throw error;
  }
};

export const fetchBusesOnRoute = async (route: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/buses-on-route`;

  const options = {
    method: "POST",
    body: JSON.stringify({ route_long_name: route }),
  };

  try {
    const response = await fetchFunction(url, options);
    const buses = response.data;
    return buses;
  } catch (error: any) {
    throw error;
  }
};

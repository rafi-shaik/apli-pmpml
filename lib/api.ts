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

export const fetchNearbyBusStops = async (lat: number, lon: number) => {
  const url = `${process.env.EXPO_PUBLIC_ROUTES_API_BASE_URL}/nearby_stops?user_lat=${lat}&user_lon=${lon}`;

  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "test",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    const res = await response.json();
    return res.stops;
    return response;
  } catch (error: any) {
    throw error;
  }
};

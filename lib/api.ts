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
    console.error("Failed to fetch buses:", error.message);
    throw error;
  }
};

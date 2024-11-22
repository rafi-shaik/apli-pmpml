import { routeNameReplacements } from "@/constants";

export const fetchFunction = async (url: string, options: any = {}) => {
  try {
    const defaultOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        x_api_key: process.env.EXPO_PUBLIC_API_KEY,
      },
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

export const trimRouteName = (route: string) => {
  if (route != null) {
    let onlyRoute = route.toUpperCase();

    routeNameReplacements.forEach((str) => {
      if (onlyRoute.includes(str)) {
        onlyRoute = onlyRoute.replace(str, "");
      }
    });

    onlyRoute = onlyRoute.replace("_", "");
    return onlyRoute;
  }
};

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

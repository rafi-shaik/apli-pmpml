import { useEffect, useState } from "react";
import DeviceInfo from "react-native-device-info";

const useDeviceInfo = () => {
  const [deviceId, setDeviceId] = useState();

  useEffect(() => {
    const getDeviceId = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        setDeviceId(id);
      } catch (error) {
        console.error("Error getting device ID:", error);
      }
    };

    getDeviceId();
  }, []);

  return deviceId;
};

export default useDeviceInfo;

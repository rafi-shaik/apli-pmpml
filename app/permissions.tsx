import * as Location from "expo-location";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "@/components/CustomButton";
import InitialLayout from "@/components/InitialLayout";

import { useLocationStore } from "@/store";

const PermissionsPage = () => {
  const router = useRouter();

  const { setIsLocationGranted, isLocationGranted, checkLocationAccess } =
    useLocationStore();

  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);

  const checkLocationPermission = async () => {
    await checkLocationAccess();

    if (isLocationGranted === "granted") {
      router.replace("/(tabs)");
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status === Location.PermissionStatus.GRANTED) {
      setIsLocationGranted("granted");
      router.replace("/(tabs)");
    }
  };

  const askUserPermissions = async () => {
    await checkLocationPermission();
  };

  if (permissionStatus === Location.PermissionStatus.GRANTED) {
    return null;
  }

  // const openSettings = async () => {
  //   try {
  //     await Linking.openSettings();
  //   } catch (error) {
  //     console.error("Failed to open settings:", error);
  //   }
  // };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <InitialLayout headerText="Permissions">
        <>
          {/* Location Permission */}
          <View style={styles.permissionItem}>
            <Entypo name="camera" size={24} color="black" />
            <View style={styles.permissionText}>
              <Text style={styles.title}>Location</Text>
              <Text style={styles.description}>
                This is required to detect nearest stops.
              </Text>
            </View>
          </View>

          {/* Camera Permission */}
          <View style={styles.permissionItem}>
            <Ionicons name="location-sharp" size={24} color="black" />
            <View style={styles.permissionText}>
              <Text style={styles.title}>Camera</Text>
              <Text style={styles.description}>
                This is required for scanning QR code during booking ticket.
              </Text>
            </View>
          </View>

          <View style={styles.bottomButton}>
            <CustomButton
              onPress={askUserPermissions}
              buttonBgColor="#3fa1ae"
              buttonTextStyles={{
                color: "white",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              GRANT PERMISSION
            </CustomButton>
            <Text style={styles.privacyText}>We don't store user location</Text>
          </View>
        </>
      </InitialLayout>
    </>
  );
};

export default PermissionsPage;

const styles = StyleSheet.create({
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
  },
  description: {
    color: "",
    fontSize: 15,
  },
  bottomButton: {
    gap: 7,
  },
  privacyText: {
    textAlign: "center",
    fontSize: 15,
  },
  permissionText: {
    paddingRight: 35,
  },
});

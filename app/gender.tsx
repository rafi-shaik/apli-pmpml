import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import InitialLayout from "@/components/InitialLayout";
import CustomButton from "@/components/CustomButton";

const GenderPage = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <InitialLayout headerText="Select your Gender">
        <>
        <View>
          
        </View>
          <CustomButton
            onPress={() => {}}
            buttonBgColor="#3fa1ae"
            buttonTextStyles={{
              color: "white",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            SET GENDER
          </CustomButton>
        </>
      </InitialLayout>
    </>
  );
};

export default GenderPage;

const styles = StyleSheet.create({});

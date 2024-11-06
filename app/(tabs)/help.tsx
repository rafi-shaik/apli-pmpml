import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

const ComplaintsPage = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <CustomButton onPress={() => {}}>Raise New Complaint</CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComplaintsPage;

const styles = StyleSheet.create({
  heading: {
    color: "#c2e191",
    fontWeight: 500,
    fontSize: 15,
  },
});

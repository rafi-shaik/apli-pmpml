import React from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const BottomSheetLayout = ({
  snapPoints,
  children,
  bottomSheetRef,
}: {
  snapPoints: string[];
  children: React.ReactNode;
  bottomSheetRef: React.Ref<BottomSheet>;
}) => {
  return (
    <BottomSheet
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleStyle={{ paddingTop: 18 }}
      handleIndicatorStyle={styles.indicatorStyle}
    >
      <BottomSheetScrollView>{children}</BottomSheetScrollView>
    </BottomSheet>
  );
};

export default BottomSheetLayout;

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: "#cccccc",
    height: 8,
    width: 50,
  },
});

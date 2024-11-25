import React from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const BottomSheetLayout = ({
  snapPoints,
  index = -1,
  children,
  bottomSheetRef,
  sheetClose = true,
}: {
  index?: number;
  snapPoints: string[];
  children: React.ReactNode;
  sheetClose?: boolean;
  bottomSheetRef: React.Ref<BottomSheet>;
}) => {
  return (
    <BottomSheet
      index={index}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={sheetClose}
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

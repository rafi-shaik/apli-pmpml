import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";

const LoadingModal = ({
  isVisible,
  text,
}: {
  isVisible: boolean;
  text: string;
}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large"  />
          <Text style={styles.modalText}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    gap: 10
  },
  modalText: {
    textAlign: "center",
  },
});

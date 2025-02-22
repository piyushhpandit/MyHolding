import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface BottomSheetProps {
  totalInvestment: number;
  totalCurrentValue: number;
  totalPNL: number;
  onClose: () => void;
}

export default function BottomSheetComponent({
  totalInvestment,
  totalCurrentValue,
  totalPNL,
  onClose,
}: BottomSheetProps) {
  return (
    <View style={styles.sheet}>
      <Text>Total Investment: {totalInvestment.toFixed(2)}</Text>
      <Text>Current Value: {totalCurrentValue.toFixed(2)}</Text>
      <Text>Total P&L: {totalPNL.toFixed(2)}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.close}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  close: { color: "red", marginTop: 10 },
});

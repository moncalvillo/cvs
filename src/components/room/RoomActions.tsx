import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "../ui";
import { Button } from "react-native";

type Props = {
  onReset: () => void;
  onFinish: () => void;
};

export function RoomActions({ onReset, onFinish }: Props) {
  return (
    <Card>
      <Button title="Resetear puntuaciones" color="#cc3333" onPress={onReset} />
      <View style={styles.spacer} />
      <Button title="Cerrar sala" onPress={onFinish} />
    </Card>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: 8,
  },
});

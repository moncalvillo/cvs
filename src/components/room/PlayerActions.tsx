import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../ui";

type Props = {
  onLeave: () => void;
  onChangeTeam?: () => void;
};

export function PlayerActions({ onLeave, onChangeTeam }: Props) {
  return (
    <View style={styles.container}>
      <Button title="Salir de la sala" onPress={onLeave} variant="secondary" />
      {onChangeTeam && (
        <Button
          title="Cambiar equipo"
          onPress={onChangeTeam}
          variant="secondary"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 8,
  },
});

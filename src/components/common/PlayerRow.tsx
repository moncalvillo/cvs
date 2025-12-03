import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../ui";
import type { Player } from "../../state/models";

type Props = {
  player: Player;
  score: number;
  onIncrement: (deviceId: string) => void;
  showIncrementButton?: boolean;
};

export function PlayerRow({
  player,
  score,
  onIncrement,
  showIncrementButton = true,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.playerName}>{player.username}</Text>
      <Text style={styles.points}>{score} pts</Text>
      {showIncrementButton && (
        <Button
          title="+"
          variant="plus"
          onPress={() => onIncrement(player.deviceId)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  points: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginRight: 8,
  },
});

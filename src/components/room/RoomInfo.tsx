import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, Typography } from "../ui";
import * as Clipboard from "expo-clipboard";
import type { Room } from "../../state/models";

type Props = {
  room: Room;
};

export function RoomInfo({ room }: Props) {
  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(room.code);
  };

  return (
    <Card>
      <Typography variant="title">{room.name}</Typography>
      <View style={styles.codeRow}>
        <View>
          <Text style={styles.metaLabel}>Código de sala</Text>
          <Text style={styles.codeValue}>{room.code}</Text>
        </View>
        <Button title="Copiar" variant="copy" onPress={handleCopyCode} />
      </View>

      <Typography variant="meta">
        Modo: {room.mode === "solo" ? "Individual" : "Por equipos"} · Jugadores:{" "}
        {room.players.length}/{room.capacity}
      </Typography>
    </Card>
  );
}

const styles = StyleSheet.create({
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  metaLabel: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    fontFamily: "monospace",
  },
});

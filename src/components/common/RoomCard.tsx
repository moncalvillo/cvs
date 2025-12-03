import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import type { Room } from "../../state/models";

type Props = {
  room: Room;
  onPress: (code: string) => void;
};

export function RoomCard({ room, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress(room.code)}
      style={styles.roomItem}
    >
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>{room.name}</Text>
      </View>
      <Text style={styles.roomMeta}>
        {room.mode === "teams" ? "Equipos" : "Individual"} · Jugadores:{" "}
        {room.players.length}/{room.capacity}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roomItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  roomHeader: {
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  roomMeta: {
    fontSize: 12,
    color: "#888",
  },
});

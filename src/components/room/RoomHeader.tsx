import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import type { Room } from "../../state/models";
import { roomStyles } from "../../styles/roomStyle";

type Props = {
  room: Room;
};

export function RoomHeader({ room }: Props) {
  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(room.code);
  };

  return (
    <View style={roomStyles.card}>
      <Text style={roomStyles.title}>{room.name}</Text>
      <View style={roomStyles.codeRow}>
        <View>
          <Text style={roomStyles.metaLabel}>Código de sala</Text>
          <Text style={roomStyles.codeValue}>{room.code}</Text>
        </View>
        <TouchableOpacity
          style={roomStyles.copyButton}
          onPress={handleCopyCode}
        >
          <Text style={roomStyles.copyButtonText}>Copiar</Text>
        </TouchableOpacity>
      </View>

      <Text style={roomStyles.meta}>
        Modo: {room.mode === "solo" ? "Individual" : "Por equipos"} · Jugadores:{" "}
        {room.players.length}/{room.capacity}
      </Text>
    </View>
  );
}

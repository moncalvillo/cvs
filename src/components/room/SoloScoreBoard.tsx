import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Room, Player } from "../../state/models";
import { roomStyles } from "../../styles/roomStyle";

type Props = {
  room: Room;
  onIncrementPlayer: (deviceId: string) => void;
};

export function SoloScoreBoard({ room, onIncrementPlayer }: Props) {
  const renderRow = (p: Player) => (
    <View key={p.deviceId} style={roomStyles.row}>
      <Text style={roomStyles.playerName}>{p.username}</Text>
      <Text style={roomStyles.points}>{room.scores[p.deviceId] ?? 0} pts</Text>
      <TouchableOpacity
        style={roomStyles.plusButton}
        onPress={() => onIncrementPlayer(p.deviceId)}
      >
        <Text style={roomStyles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={roomStyles.card}>
      <Text style={roomStyles.subtitle}>Jugadores</Text>
      {room.players.length === 0 ? (
        <Text style={roomStyles.emptyText}>No hay jugadores todavía.</Text>
      ) : (
        room.players.map(renderRow)
      )}
    </View>
  );
}

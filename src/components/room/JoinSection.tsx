import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Card, Typography } from "../ui";
import type { Room } from "../../state/models";

type Props = {
  room: Room;
  onJoinSolo?: () => void;
  onJoinTeam?: (teamId: string) => void;
};

export function JoinSection({ room, onJoinSolo, onJoinTeam }: Props) {
  if (room.mode === "solo" && onJoinSolo) {
    return (
      <Card>
        <TouchableOpacity style={styles.joinButton} onPress={onJoinSolo}>
          <Text style={styles.joinButtonText}>Unirme a la sala</Text>
        </TouchableOpacity>
      </Card>
    );
  }

  if (room.mode === "teams" && onJoinTeam) {
    return (
      <Card>
        <Typography variant="subtitle">Unirte a un equipo</Typography>
        {room.teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.joinTeamButton}
            onPress={() => onJoinTeam(team.id)}
          >
            <Text style={styles.joinTeamText}>Unirme a {team.name}</Text>
          </TouchableOpacity>
        ))}
      </Card>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  joinButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  joinTeamButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  joinTeamText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
});

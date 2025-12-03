import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../ui";
import type { Team, Player } from "../../state/models";

type Props = {
  team: Team;
  players: Player[];
  score?: number;
  onIncrement?: (teamId: string) => void;
  showIncrementButton?: boolean;
};

export function TeamBlock({
  team,
  players,
  score,
  onIncrement,
  showIncrementButton = false,
}: Props) {
  return (
    <View style={styles.teamBlock}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{team.name}</Text>
        {showIncrementButton && score !== undefined && (
          <View style={styles.teamHeaderRight}>
            <Text style={styles.teamPoints}>{score} pts</Text>
            {onIncrement && (
              <Button
                title="+"
                variant="plus"
                onPress={() => onIncrement(team.id)}
              />
            )}
          </View>
        )}
      </View>

      {players.length === 0 ? (
        <Text style={styles.emptyText}>Sin jugadores aún.</Text>
      ) : (
        players.map((p) => (
          <Text key={p.deviceId} style={styles.playerNameInTeam}>
            • {p.username}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  teamBlock: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  teamName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  teamHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamPoints: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
  },
  emptyText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },
  playerNameInTeam: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
    marginBottom: 2,
  },
});

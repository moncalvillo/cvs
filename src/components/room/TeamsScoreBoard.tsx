import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Room, Team, Player } from "../../state/models";
import { roomStyles } from "../../styles/roomStyle";

type Props = {
  room: Room;
  onIncrementTeam: (teamId: string) => void;
};

export function TeamsScoreBoard({ room, onIncrementTeam }: Props) {
  const playersWithoutTeam = room.players.filter((p) => !p.teamId);

  const getTeamPlayers = (team: Team): Player[] =>
    room.players.filter((p) => p.teamId === team.id);

  return (
    <View style={roomStyles.card}>
      <Text style={roomStyles.subtitle}>Equipos</Text>

      {room.teams.map((team) => {
        const players = getTeamPlayers(team);
        const teamScore = room.scores[team.id] ?? 0;

        return (
          <View key={team.id} style={roomStyles.teamBlock}>
            <View style={roomStyles.teamHeader}>
              <Text style={roomStyles.teamName}>{team.name}</Text>
              <View style={roomStyles.teamHeaderRight}>
                <Text style={roomStyles.teamPoints}>{teamScore} pts</Text>
                <TouchableOpacity
                  style={roomStyles.plusButton}
                  onPress={() => onIncrementTeam(team.id)}
                >
                  <Text style={roomStyles.plusButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {players.length === 0 ? (
              <Text style={roomStyles.emptyText}>Sin jugadores aún.</Text>
            ) : (
              players.map((p) => (
                <Text key={p.deviceId} style={roomStyles.playerNameInTeam}>
                  • {p.username}
                </Text>
              ))
            )}
          </View>
        );
      })}

      {playersWithoutTeam.length > 0 && (
        <View style={roomStyles.teamBlock}>
          <View style={roomStyles.teamHeader}>
            <Text style={roomStyles.teamName}>Sin equipo</Text>
          </View>
          {playersWithoutTeam.map((p) => (
            <Text key={p.deviceId} style={roomStyles.playerNameInTeam}>
              • {p.username}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

import React from "react";
import { Card, Typography } from "../ui";
import { TeamBlock } from "../common";
import type { Room, Player } from "../../state/models";

type Props = {
  room: Room;
  onIncrementTeam: (teamId: string) => void;
};

export function TeamList({ room, onIncrementTeam }: Props) {
  const playersWithoutTeam = room.players.filter((p) => !p.teamId);

  const getTeamPlayers = (teamId: string): Player[] =>
    room.players.filter((p) => p.teamId === teamId);

  return (
    <Card>
      <Typography variant="subtitle">Equipos</Typography>

      {room.teams.map((team) => {
        const players = getTeamPlayers(team.id);
        const teamScore = room.scores[team.id] ?? 0;

        return (
          <TeamBlock
            key={team.id}
            team={team}
            players={players}
            score={teamScore}
            onIncrement={onIncrementTeam}
            showIncrementButton
          />
        );
      })}

      {playersWithoutTeam.length > 0 && (
        <TeamBlock
          team={{ id: "no-team", name: "Sin equipo" }}
          players={playersWithoutTeam}
          showIncrementButton={false}
        />
      )}
    </Card>
  );
}

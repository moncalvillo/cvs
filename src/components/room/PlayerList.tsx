import React from "react";
import { Card, Typography } from "../ui";
import { EmptyState, PlayerRow } from "../common";
import type { Room } from "../../state/models";

type Props = {
  room: Room;
  onIncrementPlayer: (deviceId: string) => void;
};

export function PlayerList({ room, onIncrementPlayer }: Props) {
  return (
    <Card>
      <Typography variant="subtitle">Jugadores</Typography>
      {room.players.length === 0 ? (
        <EmptyState message="No hay jugadores todavía." />
      ) : (
        room.players.map((player) => (
          <PlayerRow
            key={player.deviceId}
            player={player}
            score={room.scores[player.deviceId] ?? 0}
            onIncrement={onIncrementPlayer}
          />
        ))
      )}
    </Card>
  );
}

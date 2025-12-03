// src/features/rooms/useRooms.ts
import { useEffect, useState } from "react";
import { Room } from "../state/models";
import { listenMyRooms, listenRoomByCode } from "../services/rooms.service";

export function useMyRooms(deviceId: string) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;

    const unsub = listenMyRooms(deviceId, (list) => {
      setRooms(list.filter((r) => !r.isFinished));
      setLoading(false);
    });

    return unsub;
  }, [deviceId]);

  return { rooms, loading };
}

export function useRoomByCode(code?: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;

    const unsub = listenRoomByCode(code, (value) => {
      setRoom(value);
      setLoading(false);
    });

    return unsub;
  }, [code]);

  return { room, loading };
}

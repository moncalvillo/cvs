// src/services/roomsService.ts
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
  FirestoreDataConverter,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Room, Player, GameMode, Team } from "../state/models";

const ROOMS_COLLECTION = "rooms";

/**
 * Convierte entre Room (app) y Firestore data.
 */
const roomConverter: FirestoreDataConverter<Room> = {
  toFirestore(room: Room) {
    return {
      ...room,
      createdAt: room.createdAt
        ? Timestamp.fromMillis(room.createdAt)
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as any;
    const createdAt: Timestamp | null = data.createdAt ?? null;
    const updatedAt: Timestamp | null = data.updatedAt ?? null;

    return {
      code: snapshot.id,
      name: data.name,
      mode: data.mode as GameMode,
      teams: data.teams ?? [],
      players: data.players ?? [],
      scores: data.scores ?? {},
      capacity: data.capacity ?? 0,
      creatorDeviceId: data.creatorDeviceId ?? "",
      isFinished: data.isFinished ?? false,
      createdAt: createdAt ? createdAt.toMillis() : Date.now(),
      updatedAt: updatedAt ? updatedAt.toMillis() : Date.now(),
    } as Room;
  },
};

function roomsCol() {
  return collection(db, ROOMS_COLLECTION).withConverter(roomConverter);
}

function roomDoc(code: string) {
  return doc(db, ROOMS_COLLECTION, code).withConverter(roomConverter);
}

function generateRoomCode(): string {
  // Código corto tipo ABC123
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/**
 * Crea una sala en Firestore. Devuelve el código de la sala.
 */
export async function createRoomInFirestore(params: {
  name: string;
  capacity: number;
  mode: GameMode;
  teamNames?: string[];
  creatorDeviceId: string;
}): Promise<string> {
  const code = generateRoomCode();

  const teams: Team[] =
    params.mode === "teams"
      ? (params.teamNames && params.teamNames.length
          ? params.teamNames
          : ["Equipo 1", "Equipo 2"]
        ).map((rawName, index) => ({
          id: `team-${index + 1}`,
          name: rawName.trim() || `Equipo ${index + 1}`,
        }))
      : [];

  const room: Room = {
    code,
    name: params.name,
    mode: params.mode,
    teams,
    players: [],
    scores: {},
    capacity: params.capacity,
    creatorDeviceId: params.creatorDeviceId,
    isFinished: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(roomDoc(code), room);

  return code;
}

/**
 * Escucha en tiempo real las salas creadas por un deviceId.
 */
export function listenMyRooms(
  deviceId: string,
  callback: (rooms: Room[]) => void
) {
  const q = query(
    roomsCol(),
    where("creatorDeviceId", "==", deviceId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map((doc) => doc.data());
    callback(rooms);
  });
}

/**
 * Escucha una sala concreta por código.
 */
export function listenRoomByCode(
  code: string,
  callback: (room: Room | null) => void
) {
  return onSnapshot(roomDoc(code), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(snapshot.data());
  });
}

/**
 * Unirse a una sala.
 */
export async function joinRoom(code: string, player: Player) {
  await updateDoc(roomDoc(code), {
    players: arrayUnion(player),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Incrementar puntuación de una clave (jugador o equipo).
 */
export async function incrementScore(
  code: string,
  key: string,
  delta: number = 1
) {
  await updateDoc(roomDoc(code), {
    [`scores.${key}`]: increment(delta),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Resetear todas las puntuaciones a 0.
 */
export async function resetScores(code: string) {
  await updateDoc(roomDoc(code), {
    scores: {},
    updatedAt: serverTimestamp(),
  });
}

/**
 * Marcar la sala como terminada/cerrada.
 */
export async function finishRoom(code: string) {
  await updateDoc(roomDoc(code), {
    isFinished: true,
    updatedAt: serverTimestamp(),
  });
}

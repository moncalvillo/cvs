// src/services/roomsService.ts
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
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
 * Escucha en tiempo real las salas donde el usuario es creador o jugador.
 * Nota: Obtiene todas las salas y filtra en el cliente para evitar necesitar índices compuestos.
 */
export function listenMyRooms(
  deviceId: string,
  callback: (rooms: Room[]) => void
) {
  // Query simple sin orderBy para evitar necesitar índice compuesto
  const q = query(
    roomsCol(),
    where("isFinished", "==", false)
  );

  return onSnapshot(q, (snapshot) => {
    const allRooms = snapshot.docs.map((doc) => doc.data());
    
    // Filtrar salas donde soy creador o jugador
    const myRooms = allRooms.filter(
      (room) =>
        room.creatorDeviceId === deviceId ||
        room.players.some((p) => p.deviceId === deviceId)
    );
    
    // Ordenar por fecha en el cliente
    myRooms.sort((a, b) => b.createdAt - a.createdAt);
    
    callback(myRooms);
  });
}/**
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
  try {
    const roomRef = roomDoc(code);
    const snapshot = await getDoc(roomRef);

    if (!snapshot.exists()) {
      throw new Error("La sala no existe");
    }

    const room = snapshot.data() as Room;

    // Verificar si el jugador ya está en la sala
    const alreadyJoined = room.players.some(
      (p) => p.deviceId === player.deviceId
    );

    if (alreadyJoined) {
      throw new Error("Ya estás en esta sala");
    }

    // Verificar capacidad
    if (room.players.length >= room.capacity) {
      throw new Error("La sala está llena");
    }

    await updateDoc(roomRef, {
      players: arrayUnion(player),
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    // Convertir errores técnicos de Firebase en mensajes amigables
    if (error.message?.includes("No document to update")) {
      throw new Error("La sala no existe o fue cerrada");
    }
    // Re-lanzar el error si ya es un mensaje amigable
    throw error;
  }
}

/**
 * Salir de una sala.
 */
export async function leaveRoom(code: string, deviceId: string) {
  const roomRef = roomDoc(code);
  const snapshot = await getDoc(roomRef);

  if (!snapshot.exists()) {
    throw new Error("La sala no existe");
  }

  const room = snapshot.data() as Room;

  // Filtrar el jugador que quiere salir
  const updatedPlayers = room.players.filter((p) => p.deviceId !== deviceId);

  await updateDoc(roomRef, {
    players: updatedPlayers,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Cambiar de equipo (solo para modo teams).
 */
export async function changeTeam(
  code: string,
  deviceId: string,
  newTeam: Team
) {
  const roomRef = roomDoc(code);
  const snapshot = await getDoc(roomRef);

  if (!snapshot.exists()) {
    throw new Error("La sala no existe");
  }

  const room = snapshot.data() as Room;

  if (room.mode !== "teams") {
    throw new Error("Solo puedes cambiar de equipo en modo equipos");
  }

  // Actualizar el equipo del jugador
  const updatedPlayers = room.players.map((p) =>
    p.deviceId === deviceId ? { ...p, team: newTeam } : p
  );

  await updateDoc(roomRef, {
    players: updatedPlayers,
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
 * Solo el creador puede hacerlo.
 */
export async function resetScores(code: string, deviceId: string) {
  const roomRef = roomDoc(code);
  const snapshot = await getDoc(roomRef);

  if (!snapshot.exists()) {
    throw new Error("La sala no existe");
  }

  const room = snapshot.data() as Room;

  if (room.creatorDeviceId !== deviceId) {
    throw new Error("Solo el creador puede resetear las puntuaciones");
  }

  await updateDoc(roomRef, {
    scores: {},
    updatedAt: serverTimestamp(),
  });
}

/**
 * Marcar la sala como terminada/cerrada.
 * Solo el creador puede hacerlo.
 */
export async function finishRoom(code: string, deviceId: string) {
  const roomRef = roomDoc(code);
  const snapshot = await getDoc(roomRef);

  if (!snapshot.exists()) {
    throw new Error("La sala no existe");
  }

  const room = snapshot.data() as Room;

  if (room.creatorDeviceId !== deviceId) {
    throw new Error("Solo el creador puede cerrar la sala");
  }

  await updateDoc(roomRef, {
    isFinished: true,
    updatedAt: serverTimestamp(),
  });
}

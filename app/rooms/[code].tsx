import React, { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStore } from "../../src/state/store";
import {
  RoomInfo,
  PlayerList,
  TeamList,
  JoinSection,
  RoomActions,
  PlayerActions,
  ResetConfirmModal,
  CloseRoomModal,
  ChangeTeamModal,
} from "../../src/components/room";
import { LoadingState } from "../../src/components/common";
import { Button } from "../../src/components/ui";
import {
  joinRoom,
  incrementScore,
  resetScores,
  finishRoom,
  leaveRoom,
  changeTeam,
} from "../../src/services/rooms.service";
import type { Player } from "../../src/state/models";
import { roomStyles } from "../../src/styles/roomStyle";
import { useRoomByCode } from "../../src/hooks/useRooms";

export default function RoomDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { session } = useStore();
  const router = useRouter();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showChangeTeamModal, setShowChangeTeamModal] = useState(false);

  const { room, loading } = useRoomByCode(code);

  if (loading) {
    return (
      <SafeAreaView style={roomStyles.safeArea} edges={["top", "bottom"]}>
        <LoadingState message="Cargando sala..." />
      </SafeAreaView>
    );
  }

  if (!room) {
    return (
      <SafeAreaView style={roomStyles.safeArea} edges={["top", "bottom"]}>
        <View style={[roomStyles.container, roomStyles.center]}>
          <Text>No se encontró la sala.</Text>
          <View style={{ height: 16 }} />
          <Button title="Volver" onPress={() => router.replace("/")} />
        </View>
      </SafeAreaView>
    );
  }

  const isFull = room.players.length >= room.capacity;
  const myPlayer: Player | undefined = room.players.find(
    (p) => p.deviceId === session.deviceId
  );
  const isCreator = room.creatorDeviceId === session.deviceId;

  const handleJoinSolo = async () => {
    if (myPlayer || isFull) return;
    await joinRoom(room.code, {
      deviceId: session.deviceId,
      username: session.username,
    });
  };

  const handleJoinTeam = async (teamId: string) => {
    if (myPlayer || isFull) return;
    await joinRoom(room.code, {
      deviceId: session.deviceId,
      username: session.username,
      teamId,
    });
  };

  const handleIncrementPlayer = async (deviceId: string) => {
    await incrementScore(room.code, deviceId, 1);
  };

  const handleIncrementTeam = async (teamId: string) => {
    await incrementScore(room.code, teamId, 1);
  };

  const confirmReset = async () => {
    try {
      await resetScores(room.code, session.deviceId);
      setShowResetModal(false);
    } catch (error: any) {
      alert(error.message || "Error al resetear puntuaciones");
    }
  };

  const confirmClose = async () => {
    try {
      await finishRoom(room.code, session.deviceId);
      setShowCloseModal(false);
      router.replace("/");
    } catch (error: any) {
      alert(error.message || "Error al cerrar la sala");
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(room.code, session.deviceId);
      router.replace("/");
    } catch (error: any) {
      alert(error.message || "Error al salir de la sala");
    }
  };

  const handleChangeTeam = async (teamId: string) => {
    try {
      await changeTeam(
        room.code,
        session.deviceId,
        room.teams.find((t) => t.id === teamId)!
      );
    } catch (error: any) {
      alert(error.message || "Error al cambiar de equipo");
    }
  };

  return (
    <SafeAreaView style={roomStyles.safeArea} edges={["top", "bottom"]}>
      <View style={roomStyles.container}>
        <RoomInfo room={room} />

        {room.mode === "solo" ? (
          <PlayerList room={room} onIncrementPlayer={handleIncrementPlayer} />
        ) : (
          <TeamList room={room} onIncrementTeam={handleIncrementTeam} />
        )}

        {!myPlayer && !isFull && (
          <JoinSection
            room={room}
            onJoinSolo={room.mode === "solo" ? handleJoinSolo : undefined}
            onJoinTeam={room.mode === "teams" ? handleJoinTeam : undefined}
          />
        )}

        {myPlayer && !isCreator && (
          <PlayerActions
            onLeave={handleLeaveRoom}
            onChangeTeam={
              room.mode === "teams"
                ? () => setShowChangeTeamModal(true)
                : undefined
            }
          />
        )}

        {isCreator && (
          <RoomActions
            onReset={() => setShowResetModal(true)}
            onFinish={() => setShowCloseModal(true)}
          />
        )}

        <ResetConfirmModal
          visible={showResetModal}
          onConfirm={confirmReset}
          onCancel={() => setShowResetModal(false)}
        />

        <CloseRoomModal
          visible={showCloseModal}
          onConfirm={confirmClose}
          onCancel={() => setShowCloseModal(false)}
        />

        <ChangeTeamModal
          visible={showChangeTeamModal}
          teams={room.teams}
          currentTeamId={myPlayer?.teamId}
          onSelectTeam={handleChangeTeam}
          onCancel={() => setShowChangeTeamModal(false)}
        />
      </View>
    </SafeAreaView>
  );
}

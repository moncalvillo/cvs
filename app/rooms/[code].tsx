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
  ResetConfirmModal,
  CloseRoomModal,
} from "../../src/components/room";
import { LoadingState } from "../../src/components/common";
import { Button } from "../../src/components/ui";
import {
  joinRoom,
  incrementScore,
  resetScores,
  finishRoom,
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
    await resetScores(room.code);
    setShowResetModal(false);
  };

  const confirmClose = async () => {
    await finishRoom(room.code);
    setShowCloseModal(false);
    router.replace("/");
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

        <RoomActions
          onReset={() => setShowResetModal(true)}
          onFinish={() => setShowCloseModal(true)}
        />

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
      </View>
    </SafeAreaView>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore } from "../src/state/store";
import type { Room } from "../src/state/models";
import { useMyRooms } from "../src/hooks/useRooms";
import { RoomCard, LoadingState, EmptyState } from "../src/components/common";
import { Button } from "../src/components/ui";
import { colors } from "../src/styles/colors";

export default function Index() {
  const { session, hasCompletedOnboarding } = useStore();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { rooms, loading: roomsLoading } = useMyRooms(session.deviceId);

  useEffect(() => {
    if (!session.deviceId) return;
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [session.deviceId, hasCompletedOnboarding, router]);

  if (!session.deviceId) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  if (!hasCompletedOnboarding) {
    return null;
  }

  const handleOpenProfileMenu = () => setProfileMenuOpen(true);
  const handleCloseProfileMenu = () => setProfileMenuOpen(false);

  const handleChangeUsername = () => {
    setProfileMenuOpen(false);
    router.push("/onboarding");
  };

  const handleCreateRoom = () => {
    router.push("/rooms/new");
  };

  const handleJoinRoom = () => {
    router.push("/rooms/join");
  };

  const handleOpenRoom = (roomCode: string) => {
    router.push(`/rooms/${roomCode}`);
  };

  const roomsSorted: Room[] = [...rooms].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.username}>{session.username}</Text>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={handleOpenProfileMenu}
          >
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de salas */}
        <View style={styles.roomsContainer}>
          <Text style={styles.sectionTitle}>Salas</Text>

          {roomsLoading ? (
            <LoadingState />
          ) : roomsSorted.length === 0 ? (
            <EmptyState message="Todavía no hay salas. Crea una nueva para empezar." />
          ) : (
            <FlatList
              data={roomsSorted}
              keyExtractor={(item) => item.code}
              contentContainerStyle={{ paddingBottom: 80 }}
              renderItem={({ item }) => (
                <RoomCard room={item} onPress={handleOpenRoom} />
              )}
            />
          )}
        </View>

        {/* Botones inferiores */}
        <View style={styles.bottomButtons}>
          <Button
            title="Crear sala"
            variant="primary"
            onPress={handleCreateRoom}
            style={styles.bottomButton}
          />
          <Button
            title="Unirse a sala"
            variant="secondary"
            onPress={handleJoinRoom}
            style={styles.bottomButton}
          />
        </View>

        {/* Menú de perfil */}
        {profileMenuOpen && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseProfileMenu}
            style={styles.menuOverlay}
          >
            <View style={styles.menuCard}>
              <Text style={styles.menuTitle}>Perfil</Text>

              <Text style={styles.menuLabel}>Nombre</Text>
              <Text style={styles.menuValue}>{session.username}</Text>

              <Text style={styles.menuLabel}>Device ID</Text>
              <Text style={styles.menuValueSmall}>{session.deviceId}</Text>

              <View style={{ height: 12 }} />

              <Button
                title="Cambiar nombre"
                variant="primary"
                onPress={handleChangeUsername}
                style={styles.menuButton}
              />

              <Button
                title="Cerrar"
                variant="secondary"
                onPress={handleCloseProfileMenu}
                style={styles.menuButton}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  username: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: colors.textPrimary,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    backgroundColor: colors.white,
  },
  profileIconText: {
    fontSize: 18,
  },
  roomsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.textPrimary,
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  bottomButton: {
    flex: 1,
    borderRadius: 999,
  },
  // Menú de perfil
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  menuCard: {
    width: "85%",
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  menuLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menuValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  menuValueSmall: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  menuButton: {
    marginTop: 8,
  },
});

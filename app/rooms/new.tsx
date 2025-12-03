// app/rooms/new.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore } from "../../src/state/store";
import type { GameMode } from "../../src/state/models";
import { createRoomInFirestore } from "../../src/services/rooms.service";
import { Card, Input, Typography } from "../../src/components/ui";
import { Button } from "react-native";

export default function NewRoomScreen() {
  const { session } = useStore();
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [capacityInput, setCapacityInput] = useState("4");
  const [mode, setMode] = useState<GameMode>("solo");

  const [teamCountInput, setTeamCountInput] = useState("2");
  const [teamNames, setTeamNames] = useState<string[]>([
    "Equipo 1",
    "Equipo 2",
  ]);

  useEffect(() => {
    const count = Math.min(
      Math.max(Number(teamCountInput) || 2, 2),
      8 // máximo 8 equipos
    );

    const current = [...teamNames];

    if (current.length < count) {
      for (let i = current.length; i < count; i++) {
        current.push(`Equipo ${i + 1}`);
      }
    } else if (current.length > count) {
      current.length = count;
    }

    setTeamNames(current);
  }, [teamCountInput]);

  const handleChangeTeamName = (index: number, name: string) => {
    const copy = [...teamNames];
    copy[index] = name;
    setTeamNames(copy);
  };

  const handleCreate = async () => {
    const name = roomName.trim();
    if (!name) {
      Alert.alert("Nombre requerido", "Escribe un nombre para la sala.");
      return;
    }

    const capacityNumber = Number(capacityInput);
    if (!Number.isFinite(capacityNumber)) {
      Alert.alert("Capacidad inválida", "Introduce un número de jugadores.");
      return;
    }
    const capacity = Math.min(Math.max(Math.round(capacityNumber), 2), 50);

    let finalTeamNames: string[] | undefined = undefined;
    if (mode === "teams") {
      const count = Math.min(Math.max(Number(teamCountInput) || 2, 2), 8);
      finalTeamNames = teamNames
        .slice(0, count)
        .map((t, i) => t.trim() || `Equipo ${i + 1}`);
    }

    try {
      const code = await createRoomInFirestore({
        name,
        capacity,
        mode,
        teamNames: finalTeamNames,
        creatorDeviceId: session.deviceId,
      });

      router.replace(`/rooms/${code}`);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "No se pudo crear la sala. Revisa la conexión o la configuración de Firebase."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <Typography variant="title">Crear sala</Typography>

            <Input
              label="Nombre de la sala"
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Ej. Batalla del viernes"
            />

            <Text style={styles.label}>Modo de juego</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === "solo" && styles.modeButtonActive,
                ]}
                onPress={() => setMode("solo")}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    mode === "solo" && styles.modeButtonTextActive,
                  ]}
                >
                  Individual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  mode === "teams" && styles.modeButtonActive,
                ]}
                onPress={() => setMode("teams")}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    mode === "teams" && styles.modeButtonTextActive,
                  ]}
                >
                  Por equipos
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Número máximo de jugadores"
              value={capacityInput}
              onChangeText={setCapacityInput}
              keyboardType="number-pad"
              placeholder="Ej. 8"
            />

            {mode === "teams" && (
              <>
                <Input
                  label="Número de equipos"
                  value={teamCountInput}
                  onChangeText={setTeamCountInput}
                  keyboardType="number-pad"
                  placeholder="Ej. 2"
                />

                <Text style={styles.label}>Nombre de los equipos</Text>
                {teamNames.map((name, index) => (
                  <Input
                    key={index}
                    value={name}
                    onChangeText={(value) => handleChangeTeamName(index, value)}
                    placeholder={`Equipo ${index + 1}`}
                    style={styles.teamInput}
                  />
                ))}
              </>
            )}

            <View style={{ height: 12 }} />
            <Button title="Crear sala" onPress={handleCreate} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#777",
    marginTop: 12,
    marginBottom: 8,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "transparent",
  },
  modeButtonActive: {
    backgroundColor: "#e8f4ff",
    borderColor: "#007AFF",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  modeButtonTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  teamInput: {
    marginTop: 8,
  },
});

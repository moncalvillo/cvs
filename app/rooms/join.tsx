import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { Typography } from "../../src/components/ui/Typography";
import { joinRoom } from "../../src/services/rooms.service";
import { useStore } from "../../src/state/store";

export default function JoinRoomScreen() {
  const router = useRouter();
  const { session } = useStore();
  const playerId = session.deviceId;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Por favor ingresa un código de sala");
      return;
    }

    if (!playerId) {
      Alert.alert("Error", "No se encontró el ID del jugador");
      return;
    }

    setLoading(true);
    try {
      await joinRoom(code.trim().toUpperCase(), {
        deviceId: playerId,
        username: session.username,
      });
      router.push(`/rooms/${code.trim().toUpperCase()}`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo unir a la sala");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Typography variant="title" style={styles.title}>
            Unirse a Sala
          </Typography>

          <Input
            placeholder="Código de la sala"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={6}
          />

          <Button
            title={loading ? "Uniéndose..." : "Unirse"}
            onPress={handleJoin}
            variant="primary"
            disabled={loading || !code.trim()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    gap: 20,
  },
  title: {
    color: "#fff",
  },
});

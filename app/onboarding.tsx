import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore, useActions } from "../src/state/store";

export default function OnboardingScreen() {
  const { session, hasCompletedOnboarding } = useStore();
  const actions = useActions();
  const router = useRouter();

  const [usernameInput, setUsernameInput] = useState(session.username || "");

  const isFirstTime = !hasCompletedOnboarding || !session.username;

  const handleContinue = () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) return;

    if (isFirstTime) {
      actions.finishOnboarding(trimmed);
      router.replace("/"); // Primera vez → vuelve a home
    } else {
      actions.setUsername(trimmed);
      router.back(); // Edición → vuelve donde estaba
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
          <View style={styles.card}>
            <Text style={styles.title}>
              {isFirstTime ? "Bienvenido" : "Cambiar nombre"}
            </Text>
            <Text style={{ marginBottom: 8 }}>
              {isFirstTime
                ? "Elige un nombre de jugador para este dispositivo. Podrás cambiarlo más adelante."
                : "Escribe tu nuevo nombre de jugador."}
            </Text>
            <TextInput
              style={styles.input}
              value={usernameInput}
              onChangeText={setUsernameInput}
              placeholder="Tu nombre de jugador"
            />
            <Button
              title={isFirstTime ? "Empezar" : "Guardar"}
              onPress={handleContinue}
            />
          </View>
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginVertical: 12,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
});

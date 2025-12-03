import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "../src/state/store";

export default function RootLayout() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#0055aa" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "700", fontSize: 18 },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="onboarding"
            options={{
              title: "Perfil",
              headerLeft: () => null,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="rooms/new"
            options={{
              title: "Nueva sala",
            }}
          />

          <Stack.Screen
            name="rooms/join"
            options={{
              title: "Unirse a sala",
            }}
          />

          <Stack.Screen
            name="rooms/[code]"
            options={{
              title: "Sala",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </StoreProvider>
  );
}

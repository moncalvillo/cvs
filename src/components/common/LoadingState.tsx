import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

type Props = {
  message?: string;
};

export function LoadingState({ message = "Cargando..." }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
});

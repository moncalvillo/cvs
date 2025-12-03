import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = {
  message: string;
};

export function EmptyState({ message }: Props) {
  return <Text style={styles.emptyText}>{message}</Text>;
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 16,
  },
});

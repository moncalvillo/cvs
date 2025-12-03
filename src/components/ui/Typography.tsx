import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

type TextVariant = "title" | "subtitle" | "body" | "caption" | "meta";

type Props = {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: TextStyle;
};

export function Typography({ children, variant = "body", style }: Props) {
  return <Text style={[styles[variant], style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: "#333",
  },
  caption: {
    fontSize: 13,
    color: "#555",
  },
  meta: {
    fontSize: 12,
    color: "#888",
  },
});

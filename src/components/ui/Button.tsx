import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../styles/colors";

type ButtonVariant = "primary" | "secondary" | "danger" | "copy" | "plus";

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  secondaryText: {
    color: colors.white,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  dangerText: {
    color: colors.white,
  },
  copy: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  copyText: {
    color: colors.white,
    fontSize: 12,
  },
  plus: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  plusText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});

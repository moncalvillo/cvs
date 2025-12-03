// src/styles/colors.ts

/**
 * Sistema de colores centralizado de la aplicación
 */
export const colors = {
  // Colores principales
  primary: "#007AFF", // Azul iOS
  primaryDark: "#0051D5",
  primaryLight: "#4DA3FF",

  // Colores secundarios
  secondary: "#5856D6", // Púrpura
  secondaryDark: "#3634A3",
  secondaryLight: "#7B79E8",

  // Colores de estado
  success: "#34C759",
  warning: "#FF9500",
  danger: "#FF3B30",
  info: "#007AFF",

  // Grises
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Blancos y negros
  white: "#FFFFFF",
  black: "#000000",

  // Fondos
  background: "#F3F4F6",
  backgroundDark: "#1a1a2e",
  surface: "#FFFFFF",
  surfaceDark: "#2d2d44",

  // Textos
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",
  textInverse: "#FFFFFF",

  // Bordes
  border: "#E5E7EB",
  borderDark: "#D1D5DB",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.4)",
};

/**
 * Paleta de colores para modo oscuro (futuro)
 */
export const darkColors = {
  ...colors,
  background: "#1a1a2e",
  surface: "#2d2d44",
  textPrimary: "#F9FAFB",
  textSecondary: "#D1D5DB",
};

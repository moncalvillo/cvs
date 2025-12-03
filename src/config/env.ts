// src/config/env.ts

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name];

  if (value === undefined || value === null || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const APP_CONFIG = {
  env: getEnv("EXPO_PUBLIC_APP_ENV", "dev"),
  apiBaseUrl: getEnv("EXPO_PUBLIC_API_BASE_URL", "http://localhost:3000"),
};

export const FIREBASE_CONFIG = {
  apiKey: getEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
  measurementId: getEnv("EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID"),
};

// src/services/firebase/app.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../../config/env";

const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);

export const db = getFirestore(app);

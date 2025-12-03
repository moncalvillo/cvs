import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import type { RootState } from "./models";

const STORAGE_KEY = "cvs-state-v2";

const initialState: RootState = {
  session: {
    deviceId: "",
    username: "",
  },
  hasCompletedOnboarding: false,
};

type Action =
  | { type: "INIT"; payload: RootState }
  | { type: "SESSION_SET_USERNAME"; payload: { username: string } }
  | { type: "SESSION_FINISH_ONBOARDING"; payload: { username: string } };

function reducer(state: RootState, action: Action): RootState {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "SESSION_SET_USERNAME":
      return {
        ...state,
        session: {
          ...state.session,
          username: action.payload.username,
        },
      };
    case "SESSION_FINISH_ONBOARDING":
      return {
        ...state,
        session: {
          ...state.session,
          username: action.payload.username,
        },
        hasCompletedOnboarding: true,
      };
    default:
      return state;
  }
}

async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const StoreContext = createContext<RootState>(initialState);
type Actions = ReturnType<typeof createActions>;
const StoreActionsContext = createContext<Actions | null>(null);

function createActions(dispatch: React.Dispatch<Action>) {
  return {
    setUsername(username: string) {
      dispatch({
        type: "SESSION_SET_USERNAME",
        payload: { username },
      });
    },
    finishOnboarding(username: string) {
      dispatch({
        type: "SESSION_FINISH_ONBOARDING",
        payload: { username },
      });
    },
  };
}

export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const loaded = await loadJSON<RootState>(STORAGE_KEY);

      if (loaded?.session?.deviceId) {
        const patched: RootState = {
          session: {
            deviceId: loaded.session.deviceId,
            username: loaded.session.username ?? "",
          },
          hasCompletedOnboarding:
            loaded.hasCompletedOnboarding ??
            Boolean(loaded.session.username?.trim()),
        };

        dispatch({ type: "INIT", payload: patched });
      } else {
        const deviceId = Crypto.randomUUID();
        const fresh: RootState = {
          session: {
            deviceId,
            username: "",
          },
          hasCompletedOnboarding: false,
        };
        dispatch({ type: "INIT", payload: fresh });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.session.deviceId) return;
    saveJSON(STORAGE_KEY, state);
  }, [state]);

  const actions = useMemo(() => createActions(dispatch), []);

  return (
    <StoreContext.Provider value={state}>
      <StoreActionsContext.Provider value={actions}>
        {children}
      </StoreActionsContext.Provider>
    </StoreContext.Provider>
  );
};

export function useStore() {
  return useContext(StoreContext);
}

export function useActions() {
  const actions = useContext(StoreActionsContext);
  if (!actions) {
    throw new Error("useActions must be used within a StoreProvider");
  }
  return actions;
}

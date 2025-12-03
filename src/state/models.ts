export type GameMode = "solo" | "teams";

export type Session = {
  deviceId: string;
  username: string;
};

export type Team = {
  id: string;
  name: string;
};

export type Player = {
  deviceId: string;
  username: string;
  teamId?: string;
};

export type Room = {
  code: string;
  name: string;
  mode: GameMode;
  teams: Team[];
  players: Player[];
  scores: Record<string, number>;
  capacity: number;
  createdAt: number;
  updatedAt: number;
  creatorDeviceId: string;
  isFinished: boolean;
};

export type RootState = {
  session: Session;
  hasCompletedOnboarding: boolean;
};

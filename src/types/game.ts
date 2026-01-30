export interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

export interface PlayerRotation {
  y: number;
}

export interface Player {
  id: string;
  user_id: string;
  username: string;
  avatar_color: string;
  avatar_shape: string;
  position: PlayerPosition;
  rotation: PlayerRotation;
  is_online: boolean;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export interface GameState {
  currentPlayer: Player | null;
  otherPlayers: Player[];
  isConnected: boolean;
  isLoading: boolean;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type MovementInput = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
};

export interface WorldObject {
  id: string;
  type: 'cube' | 'sphere' | 'platform' | 'ramp';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

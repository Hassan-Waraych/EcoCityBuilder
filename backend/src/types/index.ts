/**
 * Shared domain and API types (class diagram + DTOs).
 * Used by sim engine, repos, and routes.
 */

// --- Domain (class diagram) ---

export interface Tile {
  zone: string;
  building: string;
  floodplain: boolean;
}

export interface Metrics {
  happiness: number;
  envHealth: number;
  econStability: number;
  carbon: number;
}

export interface MetricsDelta {
  happiness?: number;
  envHealth?: number;
  econStability?: number;
  carbon?: number;
}

export interface PolicyEffect {
  code: string;
  remainingTurns: number;
  perTurnDelta: MetricsDelta;
}

export interface CityState {
  geography: string;
  gridW: number;
  gridH: number;
  tiles: Tile[][];
  metrics: Metrics;
  activePolicies: PolicyEffect[];
  lastEventTurn: number;
}

export interface Decision {
  id?: string;
  turn: number;
  kind: string;
  payload: Record<string, unknown>;
  delta?: Record<string, unknown>;
}

export interface Achievement {
  id?: string;
  code: string;
  title: string;
  description: string;
}

// --- API / request DTOs ---

export interface TakeActionBody {
  kind: string;
  payload?: Record<string, unknown>;
}

export interface TakeActionResponse {
  state: CityState;
  metrics: Metrics;
  pendingEvent?: unknown;
  achievements?: Achievement[];
}

// --- Validation result (for 400 vs 409 + tooltip message) ---

export type ValidationOk<T> = { ok: true; data: T };
export type ValidationFail = { ok: false; message: string };
export type ValidationResult<T> = ValidationOk<T> | ValidationFail;

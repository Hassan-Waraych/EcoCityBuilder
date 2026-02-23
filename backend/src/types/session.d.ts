/**
 * Placeholder for auth: Express Request will be extended with session (or user) containing playerId.
 * Used when auth routes and protected middleware are implemented.
 */
declare global {
  namespace Express {
    interface Request {
      session?: { playerId?: string };
    }
  }
}

export {};

import { Context } from 'grammy';

export interface SessionData {
  isLoggedIn: boolean;
  userId: string;
}

export function getSessionKey(ctx: Context): string | undefined {
  return ctx.from?.id.toString();
}

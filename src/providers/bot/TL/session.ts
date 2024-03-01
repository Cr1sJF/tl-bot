import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
  isLoggedIn: boolean;
}

export function getSessionKey(ctx: Context): string | undefined {
  return ctx.from?.id.toString();
}

export type MyContext = Context & SessionFlavor<SessionData>;

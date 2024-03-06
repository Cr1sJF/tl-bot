import { Bot, Context, SessionFlavor, session } from 'grammy';
import { SessionData, getSessionKey } from './session';
import {
  Conversation,
  ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import loginBuilder from './Wizards/Login';
import requestBuilder from './Wizards/Request';
import whereToBuilder from './Wizards/WhereTo';
import Session from '../../../models/DB/models/Session';
import { TypeormAdapter } from '@grammyjs/storage-typeorm';
import { logout, validateLogin } from './utils';

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;

export type ConversationContext = Conversation<MyContext>;

const setConversation = (bot: Bot<any>) => {
  bot.use(conversations());
  bot.use(createConversation(loginBuilder, 'login'));
  bot.use(createConversation(requestBuilder, 'request'));
  bot.use(createConversation(whereToBuilder, 'whereTo'));
};

const setSession = async (bot: Bot<MyContext>) => {
  function initial(): SessionData {
    return { isLoggedIn: false };
  }

  const repo = Session.getInstance<Session>();

  const adapter = new TypeormAdapter<SessionData>({
    repository: repo,
  });

  bot.use(
    session({
      initial,
      storage: adapter,
      getSessionKey,
    })
  );
};

const setCommands = (bot: Bot<MyContext>) => {
  bot.command('start', (ctx) => {
    ctx.reply('Hello!');
  });

  bot.command('login', async (ctx) => {
    if (ctx.session.isLoggedIn) {
      await ctx.reply('Ya estas logueado :)');
    } else {
      await ctx.conversation.enter('login');
    }
  });

  bot.command('logout', async (ctx) => {
    if (ctx.session.isLoggedIn) {
      await logout(ctx);
    } else {
      await ctx.reply('No estas logueado');
    }
  });

  bot.command('pedir', async (ctx) => {
    const loggedIn = await validateLogin(ctx);

    if (loggedIn) await ctx.conversation.enter('request');
  });

  bot.command('error', async (ctx) => {
    const loggedIn = await validateLogin(ctx);
    if (loggedIn) await ctx.reply('OK');
  });

  bot.command('dondeveo', async (ctx) => {
    await ctx.conversation.enter('whereTo');
  });

  bot.command('config', async (ctx) => {
    const loggedIn = await validateLogin(ctx);

    if (loggedIn) ctx.reply('Settings');
  });
};

export default function setupBot() {
  const bot = new Bot<MyContext>(process.env.TL_BOT_ID!);

  setSession(bot);
  setConversation(bot);
  setCommands(bot);

  bot.start();

  return bot;
}

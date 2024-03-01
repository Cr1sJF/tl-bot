import { Bot, session } from 'grammy';
import { MyContext, SessionData, getSessionKey } from './session';
import { TypeormAdapter } from '@grammyjs/storage-typeorm';
import { getRepository } from 'typeorm';
import { Session } from '../../../models/DB/models/Session';

const setSession = (bot: Bot<MyContext>) => {
  function initial(): SessionData {
    return { isLoggedIn: false };
  }

  bot.use(
    session({
      initial,
      getSessionKey: getSessionKey,
      storage: new TypeormAdapter({ repository: Session.getInstance<Session>() }),
    })
  );
};

const setCommands = (bot: Bot<MyContext>) => {
  bot.command('start', (ctx) => {
    ctx.reply('Hello!');
  });

  bot.command('login', (ctx) => {
    ctx.reply('Login');
  });

  bot.command('pedir', (ctx) => {
    ctx.reply('Pedir');
  });

  bot.command('problema', (ctx) => {
    ctx.reply('Problema');
  });

  bot.command('donde', (ctx) => {
    ctx.reply('Donde');
  });

  bot.command('settings', (ctx) => {
    ctx.reply('Settings');
  });
};

export default function setupBot() {
  const bot = new Bot<MyContext>(process.env.TL_BOT_ID!);

  setSession(bot);

  setCommands(bot);

  bot.start();

  return bot;
}

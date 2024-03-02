import { Bot, Context, SessionFlavor, session } from 'grammy';
import { SessionData, getSessionKey } from './session';
import {
  ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import loginBuilder from './Wizards/Login';
import requestBuilder from './Wizards/Request';
import whereToBuilder from './Wizards/WhereTo';
// import { PsqlAdapter } from '@grammyjs/storage-psql';
// import { Session } from '../../../models/DB/models/Session';

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;

const setConversation = (bot: Bot<any>) => {
  bot.use(conversations());
  bot.use(createConversation(loginBuilder<MyContext>, 'login'));
  bot.use(createConversation(requestBuilder<MyContext>, 'request'));
  bot.use(createConversation(whereToBuilder<MyContext>, 'whereTo'));
};

const setSession = async (bot: Bot<MyContext>) => {
  function initial(): SessionData {
    return { isLoggedIn: false };
  }

  bot.use(
    session({
      initial,
      // getSessionKey: getSessionKey,
      // storage: await PsqlAdapter<SessionData>.create({
      //   client: Session.getClient(),
      //   tableName: 'session',
      // }),
      // storage: new TypeormAdapter({
      //   repository: Session.getInstance<Session>(),
      // }),
    })
  );
};

const setCommands = (bot: Bot<MyContext>) => {
  bot.command('start', (ctx) => {
    ctx.reply('Hello!');
  });

  bot.command('login', async (ctx) => {
    await ctx.conversation.enter('login');
  });

  bot.command('pedir', async (ctx) => {
    await ctx.conversation.enter('request');
  });

  bot.command('problema', (ctx) => {
    ctx.reply('Problema');
  });

  bot.command('donde', async (ctx) => {
    await ctx.conversation.enter('whereTo');
  });

  bot.command('settings', (ctx) => {
    ctx.reply('Settings');
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

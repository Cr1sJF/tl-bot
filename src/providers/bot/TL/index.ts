import {
  Bot,
  Context,
  GrammyError,
  HttpError,
  SessionFlavor,
  session,
} from 'grammy';
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
import { IMAGES, logout, validateLogin } from './utils';
import errorBuilder from './Wizards/Errors';
import {
  getMenu,
  notificationBuilder,
  // collectionBuilder,
  // settingsMenu,
} from './Wizards/Settings';
import profileBuilder from './Wizards/Profile';

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;

export type ConversationContext = Conversation<MyContext>;

const setConversation = (bot: Bot<any>) => {
  bot.use(conversations());
  bot.use(createConversation(loginBuilder, 'login'));
  bot.use(createConversation(requestBuilder, 'request'));
  bot.use(createConversation(whereToBuilder, 'whereTo'));
  bot.use(createConversation(errorBuilder, 'error'));
  // bot.use(createConversation(notificationBuilder, 'notifications'));
  bot.use(createConversation(profileBuilder, 'profile'));

  // bot.use(createConversation(collectionBuilder, 'collections'));
};

const setSession = async (bot: Bot<MyContext>) => {
  function initial(): SessionData {
    return {
      isLoggedIn: false,
      userId: '',
      collections: [],
      enableAllFolders: false,
      notifications: [],
    };
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
    ctx.replyWithAnimation(IMAGES.HI, {
      caption: `Hola! Soy JellyBot. Estoy para ayudarte a mejorar tu experiencia con el servidor. Utiliza el comando /help para ver mis comandos.`,
    });
  });

  bot.command('help', async (ctx) => {
    await ctx.replyWithAnimation(IMAGES.OK, {
      caption: `
    Utiliza los comandos para interactuar con el BOT. Solo el comando /dondeveo puede utilizarse sin login.
    
    Para loguearte en el bot, utiliza el comando /login. Tus credenciales son las mismas que tu perfil de JellyFin. Puedes agilizar el proceso enviando tus credenciales junto al comando. por ejemplo, /login usuario contraseña

    Para pedir contenido, utiliza el comando /pedir. Si quieres agilizar el proceso, puedes agregar tu peticion al comando. Por ejemplo /pedir serie Supernatural

    El comando /dondeveo te será util para saber en que plataforma de streaming encontrar una serie o pelicula. Puedes buscar mas rapido agregando tu consulta. Por ejemplo /dondeveo Supernatural

    Para reportar un error, utiliza el comando /error. El BOT te notificara cuando sea resuelto.
    
    Utiliza el comando /perfil para ver tus datos.
    `,
    });
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
    if (loggedIn) await ctx.conversation.enter('error');
  });

  bot.command('dondeveo', async (ctx) => {
    await ctx.conversation.enter('whereTo');
  });

  bot.command('perfil', async (ctx) => {
    const loggedIn = await validateLogin(ctx);
    if (loggedIn) await ctx.conversation.enter('profile');
  });
};

const setMenu = async (bot: Bot<MyContext>) => {
  const menu = await getMenu();
  bot.use(menu);

  bot.command('notificaciones', async (ctx) => {
    const loggedIn = await validateLogin(ctx);
    if (loggedIn)
      await ctx.reply('Activa o desactiva tus notificaciones', {
        reply_markup: menu,
      });
  });
};

export default function setupBot() {
  const bot = new Bot<MyContext>(process.env.TL_BOT_ID!);

  // bot.use(settingsMenu);
  setSession(bot);
  setConversation(bot);
  setCommands(bot);

  // setMenu(bot);
  bot.start();

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
      console.error('Could not contact Telegram:', e);
    } else {
      console.error('Unknown error:', e);
    }

    ctx.conversation.exit();
  });

  return bot;
}

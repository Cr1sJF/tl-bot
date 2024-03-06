import { Context, InlineKeyboard, Keyboard } from 'grammy';
import Log from '../../../models/Loggers/Logger';
import MessageService from '../../../services/Message';
import { TmdbSearchMediaResponse } from '../../../types/TMDB';
import SearchMedia from '../../../models/SearchMedia';
import TmbdService from '../../../services/TMDB';
import {
  ConversationFlavor,
  ConversationHandle,
} from '@grammyjs/conversations';
import { ConversationContext, MyContext } from '.';
import User from '../../../models/DB/models/User';

const log = new Log('TL_Utils');
const messageService = new MessageService();
const tmbdService = new TmbdService();
const keyboard = new Keyboard()
  .text('✅ Si')
  .text('❌ No')
  .oneTime();

const MAP_TYPES = {
  PELICULA: 'movie',
  SERIE: 'tv',
  TEMPORADA: 'season',
};

export const getMediaWithConfirmation = (media: SearchMedia) => {
  let msg: string = messageService.getSearchMessage(media);

  return {
    text: msg,
    keyboard: keyboard,
  };
};

export const getMediaBatch = async (
  query: string,
  page: number,
  type: keyof typeof MAP_TYPES
): Promise<TmdbSearchMediaResponse[]> => {
  const result = await tmbdService.search(query, page);

  return result?.filter((media) => media.media_type === MAP_TYPES[type]) || [];
};

export const getMediaTypeKeyboard = () => {
  const keyboard = new Keyboard()
    .text('SERIE')
    .row()
    .text('PELICULA')
    .row()
    .persistent()
    .oneTime()
    .placeholder('Selecciona una opción');

  return keyboard;
};

export const getYesNoKeyboard = () => {
  return keyboard;
};

const validateType = (type: string) => {
  return type === 'SERIE' || type === 'PELICULA';
};

const askIfMedia = async (
  ctx: MyContext,
  conversation: ConversationContext,
  media: TmdbSearchMediaResponse
): Promise<boolean> => {
  const { text, keyboard } = getMediaWithConfirmation(
    new SearchMedia({
      backdrop_path: media.backdrop_path,
      id: media.id,
      media_type: media.media_type,
      overview: media.overview,
      original_title: media.original_title,
      poster_path: media.poster_path,
      release_date: media.release_date,
      first_air_date: media.first_air_date,
      title: media.title,
      name: media.name,
      vote_average: media.vote_average,
    })
  );

  await ctx.replyWithPhoto(TmbdService.parseImage(media.poster_path), {
    caption: text,
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });

  ctx = await conversation.waitFor(':text');

  if (ctx.message!.text === '✅ Si') {
    return true;
  } else {
    return false;
  }
};

const getMediaType = async (
  ctx: MyContext,
  conversation: ConversationContext
): Promise<string> => {
  await ctx.reply('Selecciona un tipo', {
    reply_markup: getMediaTypeKeyboard(),
  });

  ctx = await conversation.waitFor(':text');

  return ctx.message?.text || '';
};

export const identifyMedia = async (
  conversation: ConversationContext,
  ctx: MyContext
): Promise<{
  mediaId: string;
  type: string;
  founded: boolean;
  name: string;
}> => {
  try {
    const type = await getMediaType(ctx, conversation);

    await ctx.reply(`Dime el nombre de la ${type.toLocaleLowerCase()}`);

    ctx = await conversation.waitFor(':text');
    let query = ctx.message?.text || '';

    await ctx.reply(`Ok, voy a buscar ${query}...`);

    let page = 1;
    let results = await conversation.external(async () =>
      getMediaBatch(query, page, type as any)
    );

    if (!results || !results.length) {
      await ctx.reply(
        `No se han encontrado resultados para ${query}. Por favor, inicia el proceso nuevamente`
      );
      return {
        mediaId: '',
        type,
        founded: false,
        name: '',
      };
    }
    let found = false;
    let mediaId: string = '';

    let index = 0;
    while (!found && results.length) {
      mediaId = results[index].id.toString();
      found = await askIfMedia(ctx, conversation, results[index]);
      if (!found) index++;

      if (index >= results.length) {
        index = 0;
        page++;
        results = await conversation.external(async () =>
          getMediaBatch(query, page, type as any)
        );
      }
    }

    return {
      founded: found,
      mediaId,
      type,
      name: results[index].name || results[index].title,
    };
  } catch (error: any) {
    log.error('Error identifying media', error);

    return {
      mediaId: '',
      type: '',
      founded: false,
      name: '',
    };
  }
};

export const validateLogin = async (ctx: MyContext): Promise<boolean> => {
  try {
    const sessionLogin = ctx.session.isLoggedIn;

    if (sessionLogin) {
      return true;
    } else {
      const loginDb = await User.validateLogin(ctx.chat?.id);
      if (!loginDb) {
        await ctx.reply(
          'Esta funcionalidad requiere estar logueado. Utiliza el comando /login'
        );
        return false;
      }

      ctx.session.isLoggedIn = true;
      return true;
    }
  } catch (error: any) {
    log.error('Error validating login', error);
    return false;
  }
};

export const logout = async (ctx: MyContext) => {
  try {
    ctx.session.isLoggedIn = false;
    await User.getInstance().delete({
      chatId: ctx.chat?.id,
    });

    await ctx.reply('Sesión cerrada');
  } catch (error: any) {
    ctx.reply('Ocurrio un error al cerrar la sesión');
    log.error('Error logging out', error);
  }
};

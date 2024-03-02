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

const log = new Log('TL_Utils');
const messageService = new MessageService();
const tmbdService = new TmbdService();
const keyboard = new Keyboard()
  .text('✅ Si')
  .text('❌ No')
  .oneTime()
  .persistent();

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

export const identifyMedia = async <T extends Context>(
  conversation: ConversationHandle<T>,
  ctx: Context & ConversationFlavor
): Promise<{ mediaId: string; type: string } | null> => {
  try {
    let type = '';

    while (!validateType(type)) {
      await ctx.reply('Selecciona un tipo', {
        reply_markup: getMediaTypeKeyboard(),
      });

      const typeResponse = await conversation.waitFor(':text');
      type = typeResponse.message?.text || '';

      if (!validateType(type)) {
        await ctx.reply('Por favor, selecciona una opción válida', {
          reply_markup: getMediaTypeKeyboard(),
        });
      }
    }

    let query = '';
    while (!query) {
      await ctx.reply(`Dime el nombre de la ${type.toLocaleLowerCase()}`);

      const queryResponse = await conversation.waitFor(':text');
      query = queryResponse.message?.text || '';
    }

    await ctx.reply(`Ok, voy a buscar la ${type} ${query}...`);

    let page = 1;
    let results = await getMediaBatch(query, page, type as any);

    if (!results || !results.length) {
      await ctx.reply(`No se han encontrado resultados para ${query}`);
      return null;
    }

    let found = false;
    let mediaId: string = '';

    while (!found && results.length) {
      const media = results.shift()!;
      mediaId = media.id.toString();

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

      if (!results.length) {
        results = await getMediaBatch(query, ++page, type as any);
      }

      await ctx.replyWithPhoto(TmbdService.parseImage(media.poster_path), {
        caption: text,
        reply_markup: keyboard,
        parse_mode: 'HTML',
      });

      const response = await conversation.waitFor(':text');

      if (response.message!.text === '✅ Si') {
        found = true;
      }
    }

    return {
      mediaId,
      type,
    };
  } catch (error: any) {
    log.error('Error identifying media', error);

    return null;
  }
};

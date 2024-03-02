import {
  ConversationHandle,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import { Context, Keyboard } from 'grammy';
import { getMediaBatch, getMediaWithConfirmation } from '../utils';
import SearchMedia from '../../../../models/SearchMedia';
import TmbdService from '../../../../services/TMDB';

const requestBuilder = async <T extends Context>(
  conversation: ConversationHandle<T>,
  ctx: Context & ConversationFlavor
) => {
  const keyboard = new Keyboard()
    .text('SERIE')
    .row()
    .text('PELICULA')
    .row()
    .text('TEMPORADA')
    .row()
    .persistent()
    .oneTime()
    .placeholder('Selecciona una opción');

  if (ctx.match) {
  } else {
    await ctx.reply('Dime, ¿Que quieres pedir?', {
      reply_markup: keyboard,
    });

    const typeResponse = await conversation.waitFor(':text');
    const type = typeResponse.message!.text;
    await ctx.reply(`Genial! vamos a buscar ${type}. ¿Cuál es tu búsqueda?`);

    const query = await conversation.waitFor(':text');

    await ctx.reply(`Estoy buscando ${query.message!.text}...`);

    let page = 1;
    let results = await getMediaBatch(query.message!.text, page, type as any);

    if (!results || !results.length) {
      await ctx.reply(
        `No se han encontrado resultados para ${query.message!.text}`
      );
      return;
    }

    let found = false;
    let mediaId: string = '';
    while (!found && results && results.length) {
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

      if (!results?.length) {
        results = await getMediaBatch(query.message!.text, ++page, type as any);
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

    if (!found) {
      await ctx.reply(
        'No se ha podido encontrar el elemento solicitado. Intenta de nuevo'
      );
      return;
    } else {
      await ctx.reply('Listo! Tu pedido quedo registrado. ¡Gracias!');
      return;
    }
  }
};

export default requestBuilder;

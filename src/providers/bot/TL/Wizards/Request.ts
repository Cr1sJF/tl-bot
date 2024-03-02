import {
  ConversationHandle,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import { Context, Keyboard } from 'grammy';
import { getYesNoKeyboard, identifyMedia } from '../utils';

const requestBuilder = async <T extends Context>(
  conversation: ConversationHandle<T>,
  ctx: Context & ConversationFlavor
) => {
  if (ctx.match) {
  } else {
    const media = await identifyMedia(conversation, ctx);

    if (!media) {
      await ctx.reply(
        'No se ha podido identificar el tipo de contenido. Intenta nuevamente'
      );
      return;
    }

    if (media.type == 'SERIE') {
      await ctx.reply('¿Alguna temporada particular?', {
        reply_markup: getYesNoKeyboard(),
      });

      const response = await conversation.waitFor(':text');

      if (response.message?.text == '✅ Si') {
        await ctx.reply('¿Cuál? (enviame solamente el numero)');

        const response = await conversation.waitFor(':text');

        if (response.message?.text) {
          await ctx.reply(
            `Listo! El pedido de la temporada ${response.message?.text} de tu serie quedo registrado`
          );
        }
      } else {
        await ctx.reply('Listo! El pedido de tu serie quedo registrado');
      }
    } else {
      await ctx.reply('Listo! El pedido de tu pelicula quedo registrado');
    }
  }
};

export default requestBuilder;

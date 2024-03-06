import {
  IdentifiedMedia,
  getTypeAndQuery,
  getYesNoKeyboard,
  identifyMedia,
  identifyMediaExpress,
} from '../utils';
import { ConversationContext, MyContext } from '..';
import Request from '../../../../models/DB/models/Request';
// import Request from '../../../../models/DB/models/Request';

const requestBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  let media: IdentifiedMedia;
  if (ctx.match) {
    const { type, query } = getTypeAndQuery(ctx.match as string);
    media = await identifyMediaExpress(ctx, conversation, type, query);
  } else {
    media = await identifyMedia(conversation, ctx);
  }

  if (!media.founded) {
    await ctx.reply(
      'No se ha podido identificar el tipo de contenido. Intenta nuevamente'
    );
    return;
  }

  let season: number | undefined = undefined;
  if (media.type == 'SERIE') {
    await ctx.reply('¿Alguna temporada particular?', {
      reply_markup: getYesNoKeyboard(),
    });

    const response = await conversation.waitFor(':text');

    if (response.message?.text == '✅ Si') {
      await ctx.reply('¿Cuál? (enviame solamente el numero)');

      const response = await conversation.waitFor(':text');
      season = Number(response.message?.text);
    }
  }

  try {
    const status = await conversation.external(
      async () =>
        await Request.registerRequest(
          Number(media.mediaId),
          media.type,
          ctx.chat!.id,
          season
        )
    );

    await ctx.reply(
      'Listo! El pedido de tu serie quedo registrado con numero ' + status?.id
    );
  } catch (error) {
    await ctx.reply('Lo siento, se produjo un error al registrar el pedido');
  }
};

export default requestBuilder;

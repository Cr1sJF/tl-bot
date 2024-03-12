import { Keyboard } from 'grammy';
import {
  IMAGES,
  getTypeAndQuery,
  identifyMedia,
  identifyMediaExpress,
} from '../utils';
import StreamingService from '../../../../services/Streaming';
import { StreamingAvailability } from '../../../../types/Streaming';
import MessageService from '../../../../services/Message';
import { ConversationContext, MyContext } from '..';

const whereToBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  let mediaData;
  if (ctx.match) {
    const { type, query } = getTypeAndQuery(ctx.match as string);
    mediaData = await identifyMediaExpress(ctx, conversation, type, query);
  } else {
    mediaData = await identifyMedia(conversation, ctx);
  }

  if (!mediaData) {
    await ctx.reply(
      'No se ha podido identificar el tipo de contenido. Intenta nuevamente'
    );
  } else {
    await ctx.reply('¿En que pais estas?', {
      reply_markup: new Keyboard().text('AR').text('CL').resized().oneTime(true),
    });

    const countryResponse = await conversation.waitFor(':text');

    const country = countryResponse.message?.text;

    await ctx.reply('Un momento, por favor...', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    const streamingService = new StreamingService();
    const streamingData: StreamingAvailability[] = await streamingService.get(
      mediaData.mediaId,
      mediaData.type as 'tv' | 'movie',
      country?.toLocaleLowerCase() as 'ar' | 'cl'
    );

    if (!streamingData || !streamingData.length) {
      await ctx.replyWithAnimation(IMAGES.ERROR, {
        caption: `No encontré servicios de streaming que tengan la ${mediaData.type} disponible`,
      });
      return;
    }

    const messageService = new MessageService();
    const msg = messageService.getStreamingMessage(
      streamingData,
      mediaData.name
    );

    await ctx.replyWithAnimation(IMAGES.OK, {
      parse_mode: 'HTML',
      caption: msg,
    });
  }
};

export default whereToBuilder;

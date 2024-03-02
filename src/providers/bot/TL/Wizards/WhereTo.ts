import {
  ConversationHandle,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import { Context, Keyboard } from 'grammy';
import {
  identifyMedia,
} from '../utils';
import StreamingService from '../../../../services/Streaming';
import { StreamingAvailability } from '../../../../types/Streaming';
import MessageService from '../../../../services/Message';

const whereToBuilder = async <T extends Context>(
  conversation: ConversationHandle<T>,
  ctx: Context & ConversationFlavor
) => {
  const mediaData = await identifyMedia(conversation, ctx);

  if (!mediaData) {
    await ctx.reply(
      'No se ha podido identificar el tipo de contenido. Intenta nuevamente'
    );
  } else {
    await ctx.reply('¿En que pais estas?', {
      reply_markup: new Keyboard().text('AR').text('CL').persistent().oneTime(),
    });

    const countryResponse = await conversation.waitFor(':text');

    const country = countryResponse.message?.text;

    const streamingService = new StreamingService();
    const streamingData: StreamingAvailability[] = await streamingService.get(
      mediaData.mediaId,
      mediaData.type == 'SERIE' ? 'tv' : 'movie',
      country?.toLocaleLowerCase() as 'ar' | 'cl'
    );

    if (!streamingData || !streamingData.length) {
      await ctx.reply(
        `No encontré servicios de streaming que tengan la ${mediaData.type} disponible`
      );
      return;
    }

    const messageService = new MessageService();
    const msg = messageService.getStreamingMessage(streamingData);

    await ctx.reply(msg, {
      parse_mode: 'HTML',
    });
  }
};

export default whereToBuilder;

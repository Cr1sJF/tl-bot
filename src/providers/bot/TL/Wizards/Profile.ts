import { Keyboard } from 'grammy';
import { ConversationContext, MyContext } from '..';
import User from '../../../../models/DB/models/User';
import TmbdService from '../../../../services/TMDB';
import { MediaType } from '../../../../types/TMDB';
import MessageService from '../../../../services/Message';

const tmbd = new TmbdService();
const messageService = new MessageService();

export const profileBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  try {
    const keybard = new Keyboard()
      .text('PEDIDOS')
      .row()
      .text('REPORTES')
      .row()
      .text('SALIR')
      .resized()
      .oneTime();
    await ctx.reply('Busca tus pedidos o reportes', {
      reply_markup: keybard,
    });

    ctx = await conversation.waitFor(':text');

    const option = ctx.message?.text;
    if (option == 'SALIR') {
      await ctx.reply('Saliendo...', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      return;
    } else if (option == 'PEDIDOS') {
      const pedidos = await conversation.external(async () => {
        const data = await User.getRequests(ctx.chat!.id);
        return data;
      });

      if (pedidos.length == 0) {
        await ctx.reply('No tienes pedidos registrados', {
          reply_markup: {
            remove_keyboard: true,
          },
        });
        return;
      }

      const mediaItems = await conversation.external(async () => {
        const data = pedidos.map((item) => {
          return {
            id: item.tmdbId.toString(),
            type: item.type as MediaType,
          };
        });
        return await tmbd.getItems(data);
      });

      const message = messageService.getRequestMessage(
        mediaItems.map((item) => {
          const status = pedidos.find((p) => p.tmdbId == item.id)!.status;

          return {
            name:
              'name' in item ? item.name : item.title || item.original_title,
            overview: item.overview,
            status: status.label,
          };
        })
      );
      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: {
          remove_keyboard: true,
        },
      });

      return;
    } else if (option == 'REPORTES') {
      await ctx.reply('En construccion...', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      return;
    }
    return;
  } catch (error) {
    console.log(error);

    await ctx.reply('Ocurrio un error', {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    return;
  }
};

export default profileBuilder;

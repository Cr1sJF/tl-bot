import { Keyboard } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { ConversationContext, MyContext } from '..';
import Notification from '../../../../models/DB/models/Notification';
import User from '../../../../models/DB/models/User';

export const notificationBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  try {
    await ctx.reply('En construccion...');
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

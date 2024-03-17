import { Keyboard } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { ConversationContext, MyContext } from '..';
import Notification from '../../../../models/DB/models/Notification';
import User from '../../../../models/DB/models/User';

const toggleNotification = (ctx: MyContext, type: string) => {
  const notif = ctx.session.notifications.find((notif) => notif == type);
  if (notif) {
    ctx.session.notifications = ctx.session.notifications.filter(
      (notif) => notif != type
    );
  } else {
    ctx.session.notifications.push(type);
  }
};

export const getMenu = async () => {
  const settings = await Notification.getInstance<Notification>().find();

  const menu = new Menu<MyContext>('notifications_menu');

  settings.forEach((setting, index) => {
    menu.text(
      (ctx) => {
        const active = ctx.session.notifications.find(
          (notif) => notif == setting.type
        );
        if (active) {
          return `🔔 ${setting.type}`;
        } else {
          return `🔕 ${setting.type}`;
        }
      },
      async (ctx) => {
        toggleNotification(ctx, setting.type);
        ctx.menu.update();
      }
    );

    if (index % 2 == 1) {
      menu.row();
    }
  });

  menu.text('SALIR', async (ctx) => {
    await ctx.reply('Saliendo...', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  });

  return menu;
};

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

import { Keyboard } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { ConversationContext, MyContext } from '..';
import Notification from '../../../../models/DB/models/Notification';
import User from '../../../../models/DB/models/User';

export const settingsMenu = new Menu<MyContext>('settingsMenu')
  .text(
    'Notificaciones',
    async (ctx) => await ctx.conversation.enter('notifications')
  )
  .row()
  .text(
    'Colecciones',
    async (ctx) => await ctx.conversation.enter('collections')
  )
  .row()
  .text(
    'Salir',
    async (ctx) =>
      await ctx.reply('Saliendo...', {
        reply_markup: { remove_keyboard: true },
      })
  );

const buildKeyboard = (
  settings: Notification[],
  userSettings: Notification[]
) => {
  const keyboard = new Keyboard();

  settings.forEach((setting, index) => {
    if (
      userSettings.filter((setting) => setting).find((n) => n.id === setting.id)
    ) {
      keyboard.text('✅ ' + setting.type);
    } else {
      keyboard.text('❌ ' + setting.type);
    }

    if (index % 2 === 1) {
      keyboard.row();
    }
  });

  keyboard.text('SALIR').row();

  return keyboard;
};

export const notificationBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  const settings = await conversation.external(async () =>
    Notification.getInstance<Notification>().find()
  );
  let userSettings = await conversation.external(async () =>
    User.getInstance<User>().findOne({
      where: {
        chatId: ctx.chat!.id,
      },
      relations: ['notifications'],
    })
  );

  if (!userSettings) {
    await ctx.reply('No hay notificaciones activadas');
    return;
  }

  await ctx.reply('Activa o desactiva notificaciones', {
    reply_markup: buildKeyboard(settings, userSettings.notifications || []),
  });
  let msg = '';
  while (msg !== 'SALIR') {
    try {
      ctx = await conversation.waitFor(':text');
      msg = ctx.message?.text!;

      if (msg !== 'SALIR') {
        const [status, settingName] = msg.split(' ') || [];

        const activeSetting = status === '✅' ? false : true;

        const setting = settings.find((s) => s.type === settingName);

        let result: boolean = false;
        if (activeSetting) {
          result = await conversation.external(async () => {
            return User.addNotification(userSettings!, setting!);
          });
        } else {
          result = await conversation.external(async () => {
            return User.removeNotification(userSettings!, setting!);
          });
        }

        await ctx.reply(
          result
            ? `Notificacion de ${setting?.type} ${
                activeSetting ? 'activada' : 'desactivada'
              }`
            : 'Error',
          {
            reply_markup: buildKeyboard(
              settings,
              userSettings.notifications || []
            ),
          }
        );
      }
    } catch (error) {
      console.log(error);
      ctx.reply('Ocurrio un error');
    }
  }

  await ctx.reply('Saliendo...', {
    reply_markup: {
      remove_keyboard: true,
    },
  });
  return;
};

export const collectionBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  await ctx.reply('En construccion...');
};


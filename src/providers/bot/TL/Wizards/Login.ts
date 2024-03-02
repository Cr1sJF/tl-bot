import {
  ConversationHandle,
  type ConversationFlavor,
} from '@grammyjs/conversations';
import { Context } from 'grammy';
import JellyfinService from '../../../../services/Jellyfin';

const jellyFin = new JellyfinService();
const loginBuilder = async <T extends Context>(
  conversation: ConversationHandle<T>,
  ctx: Context & ConversationFlavor
) => {
  await ctx.reply('Para loguearte, enviame primero tu usuario');

  const user = await conversation.waitFor(':text');

  await ctx.reply('Ahora enviame tu contraseña');

  const password = await conversation.waitFor(':text');

  await ctx.reply('Estoy validando tus credenciales...');

  const loginStatus = await jellyFin.login(
    user.message!.text,
    password.message!.text
  );

  if (loginStatus) {
    await ctx.reply('Login exitoso');
  } else {
    await ctx.reply('Login fallido');
  }
};

export default loginBuilder;

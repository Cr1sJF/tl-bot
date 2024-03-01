import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import { CommandContext, Context } from 'grammy';
import JellyfinService from '../../../../services/Jellyfin';

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const jellyFin = new JellyfinService();
const loginBuilder = async (
  conversation: Conversation<MyContext>,
  ctx: CommandContext<MyContext>
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

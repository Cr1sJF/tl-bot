import JellyfinService from '../../../../services/Jellyfin';
import { ConversationContext, MyContext } from '..';
import User from '../../../../models/DB/models/User';

const jellyFin = new JellyfinService();
const loginBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  let user: string = '';
  let password: string = '';
  if (ctx.match) {
    [user, password] = (ctx.match as string).split(' ');
  } else {
    await ctx.reply('Para loguearte, enviame primero tu usuario');

    const userRes = await conversation.waitFor(':text');
    user = userRes.message!.text;
    await ctx.reply('Ahora enviame tu contraseña');

    const passwordRes = await conversation.waitFor(':text');
    password = passwordRes.message!.text;
  }

  await ctx.reply('Estoy validando tus credenciales...');

  const loginStatus = await conversation.external(
    async () => await jellyFin.login(user, password)
  );

  if (loginStatus) {
    conversation.session.isLoggedIn = true;
    await conversation.external(async () => {
      const user = new User();
      user.chatId = ctx.chat!.id!;
      user.jellyId = loginStatus;
      user.name = ctx.from?.first_name || 'anonimo';
      user.lastName = ctx.from?.last_name || 'anonimo';
      await user.save();
    });

    await ctx.reply('Login exitoso');
    return true;
  } else {
    await ctx.reply('Login fallido');
    return false;
  }
};

export default loginBuilder;

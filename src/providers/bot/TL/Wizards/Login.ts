import JellyfinService from '../../../../services/Jellyfin';
import { ConversationContext, MyContext } from '..';
import User from '../../../../models/DB/models/User';
import { InputFile } from 'grammy';
import path from 'path';
import { IMAGES } from '../utils';

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
    await ctx.replyWithAnimation(IMAGES.HI, {
      caption: `Hola ${
        ctx.from?.first_name || ctx.from?.username
      }! Para loguearte, enviame primero tu usuario`,
    });

    const userRes = await conversation.waitFor(':text');
    user = userRes.message!.text;
    await ctx.reply('Ahora, enviame tu contraseña');

    const passwordRes = await conversation.waitFor(':text');
    password = passwordRes.message!.text;
  }

  await ctx.replyWithAnimation(IMAGES.THINKING, {
    caption: 'Estoy validando tus credenciales...',
  });

  const loginStatus = await conversation.external(
    async () => await jellyFin.login(user.trim(), password.trim())
  );

  if (loginStatus) {
    conversation.session.isLoggedIn = true;
    conversation.session.userId = loginStatus;
    await conversation.external(async () => {
      const user = new User();
      user.chatId = ctx.chat!.id!;
      user.jellyId = loginStatus;
      user.name = ctx.from?.first_name || 'anonimo';
      user.lastName = ctx.from?.last_name || 'anonimo';

      const repo = User.getInstance<User>();
      await repo.upsert(user, ['chatId']);
    });

    await ctx.replyWithAnimation(IMAGES.OK, { caption: 'Login exitoso. Bienvenido!' });
    return true;
  } else {
    await ctx.replyWithAnimation(IMAGES.ERROR, { caption: 'Login fallido' });
    return false;
  }
};

export default loginBuilder;

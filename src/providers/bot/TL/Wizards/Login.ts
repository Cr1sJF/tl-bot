import JellyfinService from '../../../../services/Jellyfin';
import { ConversationContext, MyContext } from '..';
import User from '../../../../models/DB/models/User';
import { Keyboard } from 'grammy';
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

  const jellyfinUser = await conversation.external(async () =>
    jellyFin.login(user.trim(), password.trim())
  );

  if (jellyfinUser) {
    await ctx.reply(
      'Por favor, indica tu pais actual (Esta información se utilizará para mejorar los resultados de busquedas de contenido)',
      {
        reply_markup: new Keyboard()
          .text('AR')
          .text('CL')
          .row()
          .text('OMITIR')
          .oneTime()
          .resized(),
      }
    );

    const countryResponse = await conversation.waitFor(':text');
    const country = countryResponse.message?.text;

    conversation.session.isLoggedIn = true;
    conversation.session.userId = jellyfinUser.User.Id;
    conversation.session.collections = jellyfinUser.User.Policy.EnabledFolders;
    conversation.session.enableAllFolders =
      jellyfinUser.User.Policy.EnableAllFolders;
    conversation.session.country = country != 'OMITIR' ? country : undefined;
    await conversation.external(async () => {
      const user = new User();
      user.chatId = ctx.chat!.id!;
      user.jellyId = jellyfinUser.User.Id;
      user.name = ctx.from?.first_name || 'anonimo';
      user.lastName = ctx.from?.last_name || 'anonimo';
      user.country = country && country != 'OMITIR' ? country : '';
      user.active = true;
      const repo = User.getInstance<User>();
      await repo.upsert(user, ['jellyId']);
    });

    await ctx.replyWithAnimation(IMAGES.OK, {
      caption: 'Login exitoso. Bienvenido!',
    });
    return true;
  } else {
    await ctx.replyWithAnimation(IMAGES.ERROR, { caption: 'Login fallido' });
    return false;
  }
};

export default loginBuilder;

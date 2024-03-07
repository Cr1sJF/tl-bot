import { Keyboard } from 'grammy';
import { ConversationContext, MyContext } from '..';
import Report from '../../../../models/DB/models/Report';

const errorBuilder = async (
  conversation: ConversationContext,
  ctx: MyContext
) => {
  try {
    const labels = ['VIDEO', 'AUDIO', 'SUBTITULOS', 'OTROS', 'CANCELAR'];
    const buttonRows = labels.map((label) => [Keyboard.text(label)]);
    const keyboard = Keyboard.from(buttonRows).resized();
    await ctx.reply('Indica el tipo de error', {
      reply_markup: keyboard,
    });

    ctx = await conversation.waitFor(':text');

    const errorType = ctx.message?.text!;
    await ctx.reply('Enviame la informacion del error');
    ctx = await conversation.waitFor(':text');

    const errorInfo = ctx.message?.text!;

    const error = await conversation.external(async () =>
      Report.register(ctx.chat!.id, errorType, errorInfo)
    );

    if (error) {
      await ctx.reply(
        `El error fue reportado con exito con numero ${error.id}. En cuanto se resuelva seras notificado`
      );
    } else {
      await ctx.reply(
        'Ocurrio un error reportando el error. Por favor, reporte un error jajaj'
      );
    }
    return;
  } catch (error) {
    await ctx.reply(
      'Ocurrio un error reportando el error. Por favor, reporte un error jajaj'
    );
    return;
  }
};

export default errorBuilder;

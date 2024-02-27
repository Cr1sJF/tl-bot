import Log from '../../models/Loggers/Logger';
import MessageProvider, { ITelegramMessage } from './Message';

const log = new Log('TelegramMessageProvider');

export default class TelegramMessageProvider extends MessageProvider {
  async sendToChannels(data: ITelegramMessage): Promise<boolean> {
    try {
      const channels = process.env.TL_CHANNELS?.split(';');

      for (const channel of channels!) {
        // await this.bot.api.sendPhoto(channel, message, {
        //   parse_mode: 'HTML',
        // });
        await this.bot.api.sendPhoto(channel, data.image, {
          caption: data.message,
          parse_mode: 'HTML',
        });
      }

      return true;
    } catch (error: any) {
      log.error('Error sending message to Telegram', error);
      return false;
    }
  }
  sendToUser(message: string, chatId: string | number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

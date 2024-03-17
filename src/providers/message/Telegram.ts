import Log from '../../models/Loggers/Logger';
import { IMessageData } from '../../types';
import MessageProvider from './Message';

const log = new Log('TelegramMessageProvider');

export default class TelegramMessageProvider extends MessageProvider {
  async sendToChannels(data: IMessageData): Promise<boolean> {
    try {
      const channels = process.env.TL_CHANNELS?.split(';');

      for (const channel of channels!) {
        try {
          if (data.image) {
            await this.bot.api.sendPhoto(channel, data.image, {
              caption: data.message,
              parse_mode: 'HTML',
            });
          } else {
            await this.bot.api.sendMessage(channel, data.message, {
              parse_mode: 'HTML',
            });
          }
        } catch (error: any) {
          log.error(
            `Error sending message to Telegram channel ${channel}`,
            error
          );
        }
      }

      return true;
    } catch (error: any) {
      log.error('Error sending message to Telegram', error);
      return false;
    }
  }
  sendToUser(_: string, __: string | number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

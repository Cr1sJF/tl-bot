import { IMessageData } from '../../types';
import TelegramBotProvider from '../bot/Telegram';

export default abstract class MessageProvider {
  bot = new TelegramBotProvider().getBot();

  abstract sendToChannels(data: IMessageData): Promise<boolean>;
  abstract sendToUser(
    message: string,
    chatId: string | number
  ): Promise<boolean>;
}

import TelegramBotProvider from '../bot/Telegram';


export interface ITelegramMessage {
  message: string;
  image: string;
}

export default abstract class MessageProvider {
  bot = new TelegramBotProvider().getBot();

  abstract sendToChannels(data: ITelegramMessage): Promise<boolean>;
  abstract sendToUser(
    message: string,
    chatId: string | number
  ): Promise<boolean>;
}

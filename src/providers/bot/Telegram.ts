import { Bot } from 'grammy';
import BotProvider from './Bot';
import Log from '../../models/Loggers/Logger';

const log = new Log('TelegramBotProvider');
const bot = new Bot(process.env.TL_BOT_ID!);

export default class TelegramBotProvider extends BotProvider<Bot> {
  getBot(): Bot {
    return bot;
  }

  async send(message: string, chatId: string): Promise<boolean> {
    try {
      await bot.api.sendMessage(chatId, message);

      return true;
    } catch (error: any) {
      log.error('Error sending message to Telegram', error);

      return false;
    }
  }

  login(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  request(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  report(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  whereToWatch(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

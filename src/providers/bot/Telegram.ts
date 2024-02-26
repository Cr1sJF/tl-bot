import { Bot } from 'grammy';
import BotProvider from './Bot';

const bot = new Bot(process.env.TL_BOT_ID!);

export default class TelegramBotProvider extends BotProvider<Bot> {
  getBot(): Bot {
    return bot;
  }

  async send(message: string, chatId: string): Promise<boolean> {
      return true;
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

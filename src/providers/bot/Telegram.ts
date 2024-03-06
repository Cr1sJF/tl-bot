import { Bot } from 'grammy';
import BotProvider from './Bot';
import Log from '../../models/Loggers/Logger';
import { IMessageData } from '../../types';
import setupBot from './TL';
const log = new Log('TelegramBotProvider');

const bot = setupBot();

export default class TelegramBotProvider extends BotProvider<typeof bot> {
  getBot() {
    return bot;
  }

  async send(message: IMessageData, chatId: number): Promise<boolean> {
    try {
      if (message.image) {
        await bot.api.sendPhoto(chatId, message.image, {
          caption: message.message,
          parse_mode: 'HTML',
        });
      } else {
        await bot.api.sendMessage(chatId, message.message, {
          parse_mode: 'HTML',
        });
      }

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

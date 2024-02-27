import Log from '../models/Loggers/Logger';
import Movie from '../models/Movie';
// import BotProvider from '../providers/bot/Bot';
// import TelegramBotProvider from '../providers/bot/Telegram';
import MessageProvider from '../providers/message/Message';
import TelegramMessageProvider from '../providers/message/Telegram';
import { AnyMediaData, IMovieData, IShowData } from '../types';
import { MediaType } from '../types/TMDB';
import { JellyfinMovieNotification } from '../types/jellyfin';
import MessageService from './Message';
import TmbdService from './TMDB';

const TMDB = new TmbdService();
export default class NotificationService {
  messageService = new MessageService();
  messageProviders: MessageProvider[];
  // botProviders: BotProvider<unknown>[];
  log = new Log('NotificationService');

  constructor() {
    this.messageProviders = [new TelegramMessageProvider()];
    // this.botProviders = [new TelegramBotProvider()];
  }

  private async notifyViaMessage(media: AnyMediaData, type: MediaType) {
    let message = '';
    if (type == 'movie') {
      message = this.messageService.getMovieMessage(media as IMovieData);
    } else if (type == 'tv') {
      message = this.messageService.getShowMessage(media as IShowData);
    }

    for (const provider of this.messageProviders) {
      try {
        const result = await provider.sendToChannels({
          message,
          image: media.posterUrl,
        });
        this.log.info(
          `Message to provider ${provider.constructor.name}: ${result}`
        );
      } catch (error: any) {
        this.log.error(
          `Error sending message to provider ${provider.constructor.name}`,
          error
        );
      }
    }
  }

  // private async notifyViaBot(media: AnyMediaData, type: MediaType) {}

  public async notifyNewMovie(payload: JellyfinMovieNotification) {
    try {
      const tmdbMovie = await TMDB.getMovie(payload.Provider_tmdb);
      if (!tmdbMovie) {
        throw new Error('Movie not found');
      }

      const movie = new Movie({
        id: tmdbMovie.id,
        name: tmdbMovie.title,
        overview: tmdbMovie.overview,
        tagline: tmdbMovie.tagline,
        posterUrl: TMDB.parseImage(tmdbMovie.poster_path),
        genres: tmdbMovie.genres.map((i) => i.name),
        runtime: tmdbMovie.runtime,
        rating: tmdbMovie.vote_average,
        trailer: TMDB.getTrailer(tmdbMovie.videos.results),
        year: tmdbMovie.release_date,
      });

      this.notifyViaMessage(movie, 'movie');
      return true;
      // this.notifyViaBot(movie, 'movie');
    } catch (error: any) {
      this.log.error('Error notificating new movie', error);
      return false;
    }
  }
}

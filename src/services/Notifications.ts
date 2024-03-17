import User from '../models/DB/models/User';
import Log from '../models/Loggers/Logger';
import Movie from '../models/Movie';
import Season from '../models/Season';
import Show from '../models/Show';
import BotProvider from '../providers/bot/Bot';
import TelegramBotProvider from '../providers/bot/Telegram';
import MessageProvider from '../providers/message/Message';
import TelegramMessageProvider from '../providers/message/Telegram';
import { AnyMediaData, IMovieData, ISeasonData, IShowData } from '../types';
import { MediaType } from '../types/TMDB';
import {
  JellyfinMovieNotification,
  JellyfinSeasonNotification,
} from '../types/jellyfin';
import JellyfinService from './Jellyfin';
import MessageService from './Message';
import TmbdService from './TMDB';

// const MEDIA_NOTIFICATION_MAP = {
//   movie: 'PELICULAS',
//   tv: 'SERIES',
//   season: 'TEMPORADAS',
//   episode: 'EPISODIOS',
// };

const TMDB = new TmbdService();
export default class NotificationService {
  messageService = new MessageService();
  messageProviders: MessageProvider[];
  botProviders: BotProvider<unknown>[];
  log = new Log('NotificationService');

  constructor() {
    this.messageProviders = [new TelegramMessageProvider()];
    this.botProviders = [new TelegramBotProvider()];
  }

  private getMessage(media: AnyMediaData, type: MediaType) {
    let message = '';
    if (type == 'movie') {
      message = this.messageService.getMovieMessage(media as IMovieData);
    } else if (type == 'tv') {
      message = this.messageService.getShowMessage(media as IShowData);
    } else if (type == 'season') {
      message = this.messageService.getSeasonMessage(media as ISeasonData);
    }
    return message;
  }

  private async notifyViaMessage(media: AnyMediaData, type: MediaType) {
    const message = this.getMessage(media, type);
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

  private async notifyViaBot(media: AnyMediaData, type: MediaType) {
    const message = this.getMessage(media, type);

    const destinations = await User.find('notifications');

    for (const provider of this.botProviders) {
      for (const destination of destinations) {
        try {
          // const typeToFind = MEDIA_NOTIFICATION_MAP[type];

          // if (
          //   destination.notifications.some((notif) => notif.type == typeToFind)
          // ) {
          const result = await provider.send(
            {
              message,
              image: media.posterUrl,
            },
            destination.chatId
          );

          this.log.info(
            `Message trough provider ${provider.constructor.name} to user ${destination.name}: ${result}`
          );
          // }
        } catch (error) {
          this.log.error(
            `Error sending message trough provider ${provider.constructor.name} to user ${destination.name}`
          );
        }
      }
    }
  }

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
        MPAARating: TMDB.getMPA(tmdbMovie.release_dates.results),
      });

      await this.notifyViaMessage(movie, 'movie');
      await this.notifyViaBot(movie, 'movie');
      return true;
    } catch (error: any) {
      this.log.error('Error notificating new movie', error);
      return false;
    }
  }

  public async notifyNewShow(
    payload: JellyfinMovieNotification
  ): Promise<boolean> {
    try {
      const tmdbShow = await TMDB.getTv(payload.Provider_tmdb);
      if (!tmdbShow) {
        throw new Error('Show not found');
      }

      const show = new Show({
        id: tmdbShow.id,
        name: tmdbShow.original_name,
        overview: tmdbShow.overview,
        tagline: tmdbShow.tagline,
        posterUrl: TMDB.parseImage(tmdbShow.poster_path),
        genres: tmdbShow.genres.map((i) => i.name),
        rating: tmdbShow.vote_average,
        trailer: TMDB.getTrailer(tmdbShow.videos.results),
        chapters: tmdbShow.number_of_episodes,
        seasons: tmdbShow.number_of_seasons,
        status: tmdbShow.status,
        from: tmdbShow.first_air_date,
        to: tmdbShow.last_air_date,
        MPAARating: TMDB.getContentRating(tmdbShow.content_ratings.results),
      });

      await this.notifyViaMessage(show, 'tv');
      await this.notifyViaBot(show, 'tv');

      return true;
    } catch (error: any) {
      this.log.error('Error notificating new show', error);

      return false;
    }
  }

  public async notifyNewSeason(
    payload: JellyfinSeasonNotification
  ): Promise<boolean> {
    try {
      const jellyfin = new JellyfinService();
      const showId = await jellyfin.getTmdbIdBySeason(payload.ItemId);

      const tmdbShow = await TMDB.getTv(showId!);
      const tmdbSeason = await TMDB.getSeason(showId!, payload.SeasonNumber);
      if (!tmdbShow || !tmdbSeason) {
        throw new Error('Show or season not found');
      }

      const season = tmdbShow.seasons.find(
        (i) => i.season_number == payload.SeasonNumber
      )!;

      const show = new Season({
        id: tmdbShow.id,
        name: tmdbShow.original_name,
        overview: season.overview || tmdbShow.overview,
        tagline: tmdbShow.tagline,
        posterUrl: TMDB.parseImage(season.poster_path),
        genres: tmdbShow.genres.map((i) => i.name),
        rating: season.vote_average,
        trailer: TMDB.getTrailer(tmdbSeason.videos.results),
        chapters: season.episode_count,
        season: season.season_number,
        year: tmdbSeason.air_date,
        episodes: tmdbSeason.episodes,
        MPAARating: TMDB.getContentRating(tmdbShow.content_ratings.results),
      });

      await this.notifyViaMessage(show, 'season');
      await this.notifyViaBot(show, 'season');

      return true;
    } catch (error: any) {
      this.log.error('Error notificating new season', error);

      return false;
    }
  }
}

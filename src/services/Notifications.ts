import Log from '../models/Loggers/Logger';
import Movie from '../models/Movie';
import { JellyfinMovieNotification } from '../types/jellyfin';
import TmbdService from './TMDB';

const TMDB = new TmbdService();
export default class NotificationService {
  log = new Log('NotificationService');
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
        posterUrl: tmdbMovie.poster_path,
        genres: tmdbMovie.genres.map((i) => i.name),
        runtime: tmdbMovie.runtime.toString(),
        providers: tmdbMovie['watch/providers'].AR.flatrate.map(
          (i) => i.provider_name
        ),
        rating: tmdbMovie.vote_average.toString(),
        trailer: tmdbMovie.videos.results[0]?.key,
        year: tmdbMovie.release_date.slice(0, 4),
        
      });
    } catch (error: any) {
      this.log.error('Error notificating new movie', error);
    }
  }
}

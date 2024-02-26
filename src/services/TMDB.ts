import { ApiResponse } from '../types';
import {
  MediaType,
  TmdbFindResponse,
  TmdbMovieResponse,
  TmdbShowResponse,
} from '../types/TMDB';
import ApiService from './Api';

export default class TmbdService extends ApiService {
  constructor() {
    super('TMDB', {
      baseUrl: 'https://api.themoviedb.org/3',
      token: process.env.TMDB_API,
    });
  }

  private async get<T>(id: string, type: MediaType): Promise<T | null> {
    try {
      const { data } = await this.conector.get<ApiResponse<T>>(
        `/${type}/` + id,
        {
          params: {
            append_to_response: 'videos,watch/providers',
          },
        }
      );

      if (data.success) {
        return data.data;
      } else {
        this.log.error('Error fetching movie', data);
        return null;
      }
    } catch (error: any) {
      this.log.error('Error fetching movie', error);

      throw new Error('Error fetching movie');
    }
  }

  private async find<T>(
    term: string,
    type: MediaType
  ): Promise<TmdbFindResponse<T> | null> {
    try {
      const { data } = await this.conector.get<
        ApiResponse<TmdbFindResponse<T>>
      >(`/${type}/search`, {
        params: {
          query: term,
        },
      });

      if (data.success) {
        return data.data;
      } else {
        this.log.error('Error searching movie', data);

        return null;
      }
    } catch (error: any) {
      this.log.error('Error searching movie', error);

      throw new Error('Error searching movie');
    }
  }

  public async getMovie(id: string): Promise<TmdbMovieResponse | null> {
    return this.get<TmdbMovieResponse>(id, 'movie');
  }

  public async getTv(id: string): Promise<TmdbShowResponse | null> {
    return this.get<TmdbShowResponse>(id, 'tv');
  }

  public async searchMovie(
    term: string
  ): Promise<TmdbFindResponse<TmdbMovieResponse> | null> {
    return this.find<TmdbMovieResponse>(term, 'movie');
  }

  public async searchShow(
    term: string
  ): Promise<TmdbFindResponse<TmdbShowResponse> | null> {
    return this.find<TmdbShowResponse>(term, 'tv');
  }
}

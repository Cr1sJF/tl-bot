import { ApiResponse } from '../types';
import {
  MediaType,
  TmdbFindResponse,
  TmdbMovieResponse,
  TmdbSearchMediaResponse,
  TmdbSeasonResponse,
  TmdbShowResponse,
  VideoInfo,
} from '../types/TMDB';
import ApiService from './Api';

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
export default class TmbdService extends ApiService {
  constructor() {
    super('TMDB', {
      baseUrl: 'https://api.themoviedb.org/3',
      token: process.env.TMDB_API,
      params: {
        language: 'es-MX',
      },
    });
  }

  private getUrl(ids: string | string[], type: MediaType) {
    switch (type) {
      case 'movie':
        return `/${type}/` + ids;
      case 'tv':
        return `/${type}/` + ids;
      case 'season':
        return `/tv/${ids[0]}/season/${ids[1]}`;
      default:
        return `/${type}/` + ids;
    }
  }

  private async get<T>(
    ids: string | string[],
    type: MediaType
  ): Promise<T | null> {
    try {
      const { data } = await this.conector.get<ApiResponse<T>>(
        this.getUrl(ids, type),
        {
          params: {
            append_to_response: 'videos',
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

  public async getSeason(
    showId: string,
    seasonNumber: number
  ): Promise<TmdbSeasonResponse | null> {
    return this.get<TmdbSeasonResponse>(
      [showId, seasonNumber.toString()],
      'season'
    );
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

  public async search(
    query: string,
    page: number = 1
  ): Promise<TmdbSearchMediaResponse[] | null> {
    try {
      const response = await this.conector.get<ApiResponse<TmdbFindResponse>>(
        '/search/multi',
        {
          params: {
            query: query,
            include_adult: false,
            page: page,
          },
        }
      );

      if (response.data.success) {
        return response.data.data.results;
      } else {
        return null;
      }
    } catch (error: any) {
      this.log.error('Error searching', error);
      return null;
    }
  }

  public parseImage(path: string): string {
    return IMG_URL + path;
  }

  public static parseImage(path: string): string {
    return IMG_URL + path;
  }

  public getTrailer(videos: VideoInfo[]): string | undefined {
    try {
      let trailer;

      trailer = videos.find(
        (video) =>
          video.type === 'Trailer' &&
          video.site === 'YouTube' &&
          video.name.toUpperCase().indexOf('SUBTITULADO') !== -1
      )?.key;

      if (!trailer) {
        trailer = videos.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        )?.key;
      }

      return trailer ? `https://www.youtube.com/watch?v=${trailer}` : undefined;
    } catch (error: any) {
      this.log.error('Error getting trailer', error);

      return;
    }
  }
}

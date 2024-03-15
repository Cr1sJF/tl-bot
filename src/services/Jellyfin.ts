import Log from '../models/Loggers/Logger';
import { ApiResponse } from '../types';
import {
  JellifynShowItem,
  JellyfinMovieItem,
  JellyfinResponse,
  UserResponse,
} from '../types/jellyfin';
import ApiService from './Api';

const log = new Log('JellyfinService');

export default class JellyfinService extends ApiService {
  constructor() {
    super('Jellyfin', {
      baseUrl: process.env.JELLY_URL,
      headers: {
        Authorization: process.env.JELLYFIN_TOKEN,
      },
    });
  }

  public async search<T>(
    query: string,
    type?: 'Movie' | 'Series',
    userId?: string
  ): Promise<(JellyfinMovieItem | JellifynShowItem)[]> {
    try {
      const { data } = await this.conector.get<
        ApiResponse<JellyfinResponse<JellyfinMovieItem | JellifynShowItem>>
      >('/Items', {
        params: {
          recursive: true,
          fields: 'ProviderIds',
          searchTerm: query,
          userId: userId || undefined,
        },
      });

      if (data.success) {
        if (type) {
          return data.data.Items.filter((item) => item.Type === type);
        } else {
          return data.data.Items;
        }
      } else {
        log.error('Error searching in jellyfin', data);

        return [];
      }
    } catch (error: any) {
      log.error('Error searching in jellyfin', error);

      return [];
    }
  }

  public async getItem<T>(id: string): Promise<JellyfinResponse<T> | null> {
    try {
      const { data } = await this.conector.get<
        ApiResponse<JellyfinResponse<T>>
      >(`/Items`, {
        params: {
          ids: id,
          fields: 'Genres,Overview,Path,ProviderIds,ParentId',
          imageTypes: 'Primary',
        },
      });

      if (data.success) {
        return data.data;
      } else {
        this.log.error('Error fetching item', data);

        return null;
      }
    } catch (error: any) {
      this.log.error('Error fetching item', error);

      return null;
    }
  }

  public async login(
    username: string,
    password: string
  ): Promise<UserResponse | null> {
    try {
      const { data } = await this.conector.post<ApiResponse<UserResponse>>(
        '/Users/AuthenticateByName',
        {
          Username: username,
          Pw: password,
        }
      );

      if (data.success) {
        return data.data;
      } else {
        return null;
      }
    } catch (error: any) {
      this.log.error('Error performing login', error);

      return null;
    }
  }

  public async updateCollections(
    userId: string,
    collections: string[] = [],
    enableAllFolders: boolean = false
  ): Promise<boolean> {
    try {
      await this.conector.post(`/Users/${userId}/Policy`, {
        EnabledFolders: enableAllFolders ? [] : collections,
        EnableAllFolders: enableAllFolders,
        AuthenticationProviderId:
          'Jellyfin.Server.Implementations.Users.DefaultAuthenticationProvider',
        PasswordResetProviderId:
          'Jellyfin.Server.Implementations.Users.DefaultPasswordResetProvider',
      });

      return true;
    } catch (error: any) {
      log.error('Error updating collections', error);

      return false;
    }
  }

  public async getTmdbIdBySeason(id: string): Promise<string | null> {
    try {
      const itemResponse = await this.getItem<any>(id);
      const show = await this.getItem<any>(itemResponse?.Items[0].SeriesId);

      return show?.Items[0]?.ProviderIds?.Tmdb;
    } catch (error: any) {
      log.error('Error finding show by season id', error);

      return null;
    }
  }

  // public async findByTmdbId(
  //   id: string,
  //   name: string
  // ): Promise<JellyfinResponse<any> | null> {
  //   try {
  //     const items = await this.conector.get()

  //   } catch (error: any) {
  //     log.error('Error finding show by id', error);

  //     return null;
  //   }
  // }

  public async jellifynAvailability(
    tmdbId: string,
    query: string,
    type?: 'Movie' | 'Series',
    userId?: string
  ): Promise<string> {
    try {
      const items = await this.search(query, type, userId);

      const found = items.find((item) => item.ProviderIds.Tmdb === tmdbId);

      return found
        ? `${process.env.JELLY_URL}/web/index.html#!/details?id=${found.Id}`
        : '';
    } catch (error: any) {
      log.error('Error finding show by id', error);

      return '';
    }
  }
}

import { ApiResponse } from '../types';
import { JellyfinResponse } from '../types/jellyfin';
import ApiService from './Api';

export default class JellyfinService extends ApiService {
  constructor() {
    super('Jellyfin', {
      baseUrl: process.env.JELLY_URL,
      headers: {
        Authorization: process.env.JELLYFIN_TOKEN,
      },
    });
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
  ): Promise<string | null> {
    try {
      const { data } = await this.conector.post<ApiResponse<any>>(
        '/Users/AuthenticateByName',
        {
          Username: username,
          Pw: password,
        }
      );

      if (data.success) {
        return data.data.User.Id as string;
      } else {
        return null;
      }
    } catch (error: any) {
      this.log.error('Error performing login', error);

      return null;
    }
  }
}
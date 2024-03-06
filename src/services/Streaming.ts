import { ApiResponse } from '../types';
import {
  StreamingAvailability,
  StreamingData,
  StreamingDescription,
} from '../types/Streaming';
import ApiService from './Api';

export default class StreamingService extends ApiService {
  constructor() {
    super('streaming', {
      baseUrl: 'https://streaming-availability.p.rapidapi.com',
      headers: {
        'X-RapidAPI-Key': process.env.STREAMING_AVAILABILITY_API,
        'X-RapidAPI-Host': process.env.STREAMING_AVAILABILITY_HOST,
      },
      params: {
        output_language: 'es',
      },
    });
  }

  public async get(
    id: string,
    type: 'movie' | 'tv',
    country: 'ar' | 'cl'
  ): Promise<StreamingAvailability[]> {
    try {
      const result = await this.conector.get<ApiResponse<StreamingData>>(
        '/get',
        {
          params: {
            tmdb_id: `${type}/${id}`,
          },
        }
      );

      if (!result.data.success) {
        this.log.error('Error finding movie  availability', result.data);
        return [];
      }

      if (!result.data.data.result.streamingInfo[country]) {
        return [];
      }

      return result.data.data.result.streamingInfo[country]
        .filter(
          (element: StreamingDescription) =>
            element.streamingType == 'subscription'
        )
        .map((element: StreamingDescription) => {
          return {
            link: element.link,
            streamingPlatform: element.service.toUpperCase(),
          };
        });
    } catch (error: any) {
      this.log.error('Error finding movie  availability', error);
      return [];
    }
  }

  public async getMovieAvailability(
    id: string,
    country: 'ar' | 'cl'
  ): Promise<StreamingAvailability[]> {
    return await this.get(id, 'movie', country);
  }

  public async getShowAvailability(
    id: string,
    country: 'ar' | 'cl'
  ): Promise<StreamingAvailability[]> {
    return await this.get(id, 'tv', country);
  }
}

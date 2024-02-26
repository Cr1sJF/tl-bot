import { IMediaData, IMovieData } from '../types';

export default class Media implements IMediaData {
  id: number;
  name: string;
  overview: string;
  posterUrl: string;
  genres: string[];
  runtime?: string | undefined;
  providers: string[];
  rating: string;
  trailer?: string | undefined;

  constructor(data: IMediaData) {
    this.id = data.id;
    this.name = data.name;
    this.overview = data.overview;
    this.posterUrl = data.posterUrl;
    this.genres = data.genres;
    this.runtime = data.runtime;
    this.providers = data.providers;
    this.rating = data.rating;
    this.trailer = data.trailer;
  }
}

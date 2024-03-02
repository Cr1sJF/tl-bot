import { TmdbSearchMediaResponse } from '../types/TMDB';

export default class SearchMedia
  implements
    Omit<
      TmdbSearchMediaResponse,
      | 'genre_ids'
      | 'video'
      | 'vote_count'
      | 'adult'
      | 'original_language'
      | 'popularity'
    >
{
  title: string;
  original_title: string;
  media_type: string;
  release_date: string;
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  vote_average: number;
  rating?: string;
  constructor(
    data: Omit<
      TmdbSearchMediaResponse,
      | 'genre_ids'
      | 'video'
      | 'vote_count'
      | 'adult'
      | 'original_language'
      | 'popularity'
    >
  ) {
    this.title = data.title ? data.title : data.name ? data.name : '';
    this.original_title = data.original_title;
    this.media_type = data.media_type;
    this.release_date = data.release_date
      ? data.release_date.substring(0, 4)
      : data.first_air_date
      ? data.first_air_date.substring(0, 4)
      : '';
    this.backdrop_path = data.backdrop_path;
    this.id = data.id;
    this.overview = data.overview;
    this.poster_path = data.poster_path;
    this.vote_average = data.vote_average;
    this.rating = Number(data.vote_average).toFixed(2);
  }
}

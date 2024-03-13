export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface VideoInfo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface ReleaseDate {
  certification: string;
  descriptors: string[];
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
}

export interface ReleaseDates {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface TmdbResponseBase {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  homepage: string;
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  videos: {
    results: VideoInfo[];
  };
}

export interface TmdbMovieResponse extends TmdbResponseBase {
  belongs_to_collection: BelongsToCollection;
  budget: number;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
  vote_count: number;

  release_dates: {
    results: ReleaseDates[];
  };
}

export interface TmdbVideoResponse {
  id: number;
  results: VideoInfo[];
}

export interface TmdbShowResponse extends TmdbResponseBase {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: null | any;
  networks: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
  type: string;
  vote_count: number;

  content_ratings: {
    results: ContentRating[];
  };
}

export interface ContentRating {
  descriptors: string[];
  iso_3166_1: string;
  rating: string;
}

export interface TmdbSeasonResponse {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
  videos: {
    results: VideoInfo[];
  };
}

export interface Episode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: Crew[];
  guest_stars: Crew[];
}

export interface Crew {
  job?: string;
  department?: Department;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: Department;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  character?: string;
  order?: number;
}

export enum Department {
  Acting = 'Acting',
  Camera = 'Camera',
  Crew = 'Crew',
  Directing = 'Directing',
  Editing = 'Editing',
  Production = 'Production',
  Sound = 'Sound',
  Writing = 'Writing',
}

export interface TmdbFindResponse<T = TmdbSearchMediaResponse> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbSearchMediaResponse
  extends Pick<
    TmdbResponseBase,
    | 'adult'
    | 'backdrop_path'
    | 'id'
    | 'original_language'
    | 'overview'
    | 'poster_path'
    | 'popularity'
    | 'vote_average'
  > {
  title: string;
  original_title: string;
  name?: string;
  media_type: string;
  genre_ids: number[];
  release_date?: string;
  first_air_date?: string;
  video: boolean;
  vote_count: number;
}

export type MediaType = 'movie' | 'tv' | 'season' | 'episode';

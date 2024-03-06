export interface IMessageData {
  message: string;
  image?: string;
}
export type LabelValueObj = {
  value: number | string;
  label: string;
};

export interface IConvertToLabelValueOptions {
  sort: boolean;
  upper: boolean;
}

export type KeyValueObj = {
  [key: string]: any;
};

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

export interface ApiResponseError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export interface IMediaData {
  id: number;
  name: string;
  overview: string;
  tagline: string;
  posterUrl: string;
  genres: string | string[];
  rating: string | number;
  runtime?: string | number;
  trailer?: string;
}

export interface IMovieData extends IMediaData {
  year: string;
}

export interface IShowData extends IMediaData {
  years: string;
  from: string;
  to: string;
  chapters: number;
  seasons: number;
  status: string;
}

export interface ISeasonData extends IMediaData {
  season: number;
  chapters: number;
  year: string;
  status: string;
}

export type AnyMediaData = IMediaData | IMovieData | IShowData | ISeasonData;
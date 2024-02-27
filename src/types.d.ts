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
  genres: string;
  runtime?: string;
  rating: string;
  trailer?: string;
}

export interface IMediaDataConstructor {
  id: number;
  name: string;
  overview: string;
  tagline: string;
  posterUrl: string;
  genres: string[];
  runtime?: number;
  rating: number;
  trailer?: string;
}

export interface IMovieData extends IMediaData {
  year: string;
}

export interface IMovieDataConstructor extends IMediaDataConstructor {
  year: string;
}

export interface IShowData extends IMediaData {
  years: string;
  chapters: number;
  seasons: number;
  status: string;
}

export type AnyMediaData = IMediaData | IMovieData | IShowData;

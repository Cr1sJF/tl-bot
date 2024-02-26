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
  posterUrl: string;
  genres: string[];
  runtime?: string;
  providers: string[];
  rating: string;
  trailer?: string;
}

export interface IMovieData extends IMediaData {
  year: string;
}

export interface IShowData extends IMediaData {
  years: string;
  chapters: number;
  seasons: number;
  status: string;
}

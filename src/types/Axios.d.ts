import { InternalAxiosRequestConfig } from "axios";

type ApiCredentials = {
  user: string;
  password: string;
};

type AxiosConfig = {
  baseUrl?: string;
  token?: string;
  credentials?: ApiCredentials;
  timeout?: number;
  responseValidator?: Function;
  headers?: Object;
};

type AxiosBody = {
  params: Object;
  data: Object;
};

interface AxiosRequestLog {
  url: string;
  method: string;
  type: string;
  data: AxiosBody;
  params?: Object;
}

interface AxiosErrorLog {
  url: string;
  method: string;
  status: number;
  data: AxiosBody;
  isError: true;
  params?: Object;
}

declare module "axios" {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
    customValidator?: Function;
  }

  export interface AxiosResponse {
    duration: number;
  }
}

export interface IAxiosResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: any;
}

import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CreateAxiosDefaults, AxiosInstance } from 'axios';
import AxiosLogger from '../models/Loggers/Axios';
import { AxiosConfig } from '../types/Axios';
const log = new AxiosLogger('AXIOS');

const getApiUrl = (config: any) => {
  const data = config.config ? config.config : config;
  const URL = data.baseURL ? data.baseURL + data.url : data.url;
  return URL;
};

export default (config?: AxiosConfig) => {
  let options: CreateAxiosDefaults = {
    timeout: config?.timeout ? config.timeout : 28000,
    metadata: { startTime: new Date() },
  };

  if (config) {
    if (config.baseUrl) {
      options.baseURL = config.baseUrl;
    }

    if (config.token) {
      options.headers = {
        Authorization: 'Bearer ' + config.token,
      };
    }

    if (config.credentials) {
      options.auth = {
        username: config.credentials.user,
        password: config.credentials.password,
      };
    }

    if (config.params) {
      options.params = config.params;
    }

    if (config.headers) {
      options.headers = config.headers;
    }
  }

  const conector: AxiosInstance = axios.create(options);

  conector.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    const exclude = false;
    if (!exclude) {
      log.axiosLog({
        url: getApiUrl(request),
        method: request.method || '',
        type: 'REQ',
        data:
          request.data instanceof URLSearchParams
            ? Object.fromEntries(request.data)
            : request.data,
        params: request.params,
      });
    }

    if (request.metadata) request.metadata.startTime = new Date();
    return request;
  });

  conector.interceptors.response.use(
    (response: AxiosResponse) => {
      // response.duration = new Date().getTime() - response.config.metadata.startTime.getTime();

      const { parsed, validator } = response.data;
      response.data = parsed;

      if (validator) {
        response.data = validator(response.data);
      }

      if (response.config.customValidator) {
        response.data = response.config.customValidator(response.data);
      }

      if (!response.data.hasOwnProperty('success')) {
        response.data = {
          success: response.status >= 200 && response.status < 300,
          data: response.data,
        };
      }

      log.axiosLog({
        url: getApiUrl(response),
        method: response.config.method || '',
        type: 'RES',
        data: response.data.success,
      });

      return response;
    },
    (error: any) => {
      // const URL = getApiUrl(error);
      // EXCEPCIONES NO CONTROLADAS
      let errorData: any = { response: {} };
      if (!error.response) {
        errorData.response = {
          // status: error.code,
          success: false,
          message: error.message,
          data: error.stack,
        };
        error.response = {
          data: {
            success: false,
            data: {
              message: error.message,
              stack: error.stack,
            },
          },
        };
      } else {
        errorData = {
          // status: error.response.status,
          message: error.response.statusText,
          data: error.response.data.parsed,
        };
        error.response.data = {
          success: false,
          data: error.response.data.parsed,
        };
      }

      log.axiosErrorLog({
        isError: true,
        status: error.response.status,
        data: error.response.data,
        method: error.config.method,
        url: getApiUrl(error),
      });

      return Promise.reject(error);
    }
  );

  conector.defaults.transformResponse = (response) => {
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (error) {
      parsedResponse = {
        error: true,
        stringResponse: response,
      };
    }
    return {
      parsed: parsedResponse,
      validator: config?.responseValidator ? config.responseValidator : null,
    };
  };

  return conector;
};

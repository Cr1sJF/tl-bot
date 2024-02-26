import { AxiosInstance } from 'axios';
import { AxiosConfig } from '../types/Axios';
import axiosHelper from '../utils/axiosHelper';
import Log from '../models/Loggers/Logger';

export default class ApiService {
  conector: AxiosInstance;
  log: Log;
  constructor(name: string, data: AxiosConfig) {
    const conector = axiosHelper(data);
    this.log = new Log(name);
    this.conector = conector;
  }
}

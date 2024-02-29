import { IShowData } from '../types';
import Media from './Media';

export enum ShowStatus {
  ended = 'Ended',
  canceled = 'Canceled',
  inProgress = 'Returning Series',
}
export default class Show extends Media implements IShowData {
  years: string;
  from: string;
  to: string;
  chapters: number;
  seasons: number;
  status: string;

  constructor(data: Omit<IShowData, "years">) {
    super(data);

    this.from = data.from;
    this.to = data.to;
    this.years = this.getDuration(data.from, data.to, data.status);
    this.chapters = data.chapters;
    this.seasons = data.seasons;
    this.status = this.getStatus(data.status);
  }

  private getStatus(status: string): string {
    switch (status) {
      case ShowStatus.ended:
        return '🟢 Finalizada';
      case ShowStatus.inProgress:
        return '🔵 En emisión';
      case ShowStatus.canceled:
        return '🔴 Cancelada';
      default:
        return status;
    }
  }

  private getDuration(
    firstAirDate: string,
    lastAirDate: string,
    status: string
  ): string {
    const from = firstAirDate.substring(0, 4);
    if (status === ShowStatus.inProgress) {
      return `${from} - Actualidad`;
    } else {
      const to = lastAirDate.substring(0, 4);
      return `${from} - ${to}`;
    }
  }
}

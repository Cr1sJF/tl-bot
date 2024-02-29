import { ISeasonData } from '../types';
import { Episode } from '../types/TMDB';
import Media from './Media';

export default class Season extends Media implements ISeasonData {
  season: number;
  chapters: number;
  year: string;
  status: string;
  constructor(data: Omit<ISeasonData, 'status'> & { episodes: Episode[] }) {
    super(data);
    this.season = data.season;
    this.chapters = data.chapters;
    this.year = data.year.substring(0, 4);
    this.status = this.getStatus(data.episodes);
  }

  private getStatus(episodes: Episode[]): string {
    const lastEpisode = episodes[episodes.length - 1];

    if (lastEpisode.episode_type == 'standard') return '🔵 En emisión';
    else if (lastEpisode.episode_type == 'finale') return '🟢 Completa';
    else return '⚫ Desconocido';
  }
}

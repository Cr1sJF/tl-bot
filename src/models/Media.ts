import { IMediaData, IMediaDataConstructor } from '../types';

const formatTime = (min: number) => {
  if (isNaN(min) || min < 0) {
    return 'Tiempo inválido';
  }

  const hours = Math.floor(min / 60);
  const left = min % 60;

  return `${hours}h ${left}min`;
};

export default class Media implements IMediaData {
  id: number;
  name: string;
  overview: string;
  tagline: string;
  posterUrl: string;
  genres: string;
  runtime?: string | undefined;
  rating: string;
  trailer?: string;

  constructor(data: IMediaDataConstructor) {
    this.id = data.id;
    this.name = data.name;
    this.overview = data.overview;
    this.tagline = data.tagline;
    this.posterUrl = data.posterUrl;
    this.genres = data.genres.join(' | ');
    this.runtime = formatTime(Number(data.runtime));
    this.rating = Number(data.rating).toFixed(2);

    this.trailer = data.trailer;
  }
}

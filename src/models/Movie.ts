import { IMovieData } from '../types';
import Media from './Media';

export default class Movie extends Media implements IMovieData {
  year: string;

  constructor(data: IMovieData) {
    super(data);

    this.year = data.year.slice(0, 4);
  }
}

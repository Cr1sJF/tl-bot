import { IMovieData, IMovieDataConstructor } from '../types';
import Media from './Media';

export default class Movie extends Media implements IMovieData {
  year: string;

  constructor(data: IMovieDataConstructor) {
    super(data);

    this.year = data.year.slice(0, 4);
  }
}

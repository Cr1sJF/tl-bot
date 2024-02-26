import { IMediaData, IMovieData, IShowData } from '../types';

// enum MediaType {
//   MOVIE = 'NUEVA PELICULA',
//   SHOW = 'NUEVA SERIE',
//   SEASON = 'NUEVA TEMPORADA',
//   EPISODE = 'NUEVO CAPITULO',
// }
const TYPE_TITLE = 'TITLE';
const TYPE_NEW_LINE = 'NEW_LINE';
interface MessageData {
  type: string;
  value?: string;
}

const typeToEmoji: Record<string, string> = {
  name: '✒️',
  overview: '💭',
  year: '📅',
  rating: '⭐️',
  genres: '🎭',
  runtime: '🕑',
  providers: '📺',
  trailer: '🎬',
  status: 'ℹ️',
};

export default class MessageService {
  private getStatus(status: string): string {
    switch (status) {
      case 'Ended':
        return 'Finalizada';
      case 'Returning Series':
        return 'En emision';
      case 'Canceled':
        return 'Cancelada';
      default:
        return status;
    }
  }

  private buildHTML(items: MessageData[]): string {
    const htmlArray: string[] = [];

    items.forEach((item) => {
      let htmlItem = '';
      if (item.type == TYPE_TITLE) {
        htmlArray.push(`<h2>🚨${item.value}🚨</h2> \n`);
      } else if (item.type == TYPE_NEW_LINE) {
        htmlArray.push(`\n`);
      } else if (item.type == 'trailer' && item.value) {
        const emoji = typeToEmoji[item.type] || ''; // Obtener emoji del mapeo
        htmlItem = `<p>${emoji}:</p> <a href="${item.value}">Ver Trailer</a> \n`;
      } else {
        const emoji = typeToEmoji[item.type] || ''; // Obtener emoji del mapeo
        // const formattedValue = item.value.replace(/\n/g, '<br>'); // Reemplazar saltos de línea con <br>

        if (item.value) {
          htmlItem = `<p>${emoji}: ${
            item.type == 'name' ? '<i>' + item.value + '</i>' : item.value
          }</p> \n`;
        }
      }

      htmlArray.push(htmlItem);
    });

    return htmlArray.join('');
  }

  public getMovieMessage(data: IMovieData): string {
    try {
      let msg = this.buildHTML([
        { type: TYPE_TITLE, value: 'NUEVA PELÍCULA' },
        { type: TYPE_NEW_LINE },
        { type: 'name', value: data.name },
        { type: TYPE_NEW_LINE },
        { type: 'overview', value: data.overview },
        { type: TYPE_NEW_LINE },
        { type: 'year', value: data.year },
        { type: 'rating', value: data.rating },
        { type: 'genres', value: data.genres.join(' | ') },
        { type: 'runtime', value: data.runtime },
        { type: TYPE_NEW_LINE },
        { type: 'providers', value: data.providers.join(' | ') },
        { type: TYPE_NEW_LINE },
        { type: 'trailer', value: data.trailer },
      ]);

      return msg;
    } catch (error) {
      return '';
    }
  }

  public getShowMessage(data: IShowData): string {
    let msg = this.buildHTML([
      { type: TYPE_TITLE, value: 'NUEVA SERIE' },
      { type: TYPE_NEW_LINE },
      { type: 'name', value: data.name },
      { type: 'overview', value: data.overview },
      { type: TYPE_NEW_LINE },
      {
        type: 'seasons',
        value: `Temporadas: ${data.seasons} | Capitulos: ${data.chapters}`,
      },
      { type: 'status', value: this.getStatus(data.status) },
      { type: 'year', value: data.years },
      { type: 'rating', value: data.rating },
      { type: 'genres', value: data.genres.join(' | ') },
      { type: 'runtime', value: data.runtime },
      { type: TYPE_NEW_LINE },
      { type: 'providers', value: data.providers.join(' | ') },
      { type: TYPE_NEW_LINE },
      { type: 'trailer', value: data.trailer },
    ]);

    return msg;
  }

  // async notifyNewEpisode(payload: any) {
  //   console.log('PAYLOAD', payload);
  //   return true;
  // }

  getSeasonMessage(data: IShowData): string {
    const msg = this.buildHTML([
      { type: TYPE_TITLE, value: 'NUEVA TEMPORADA' },
      { type: TYPE_NEW_LINE },
      { type: 'name', value: data.name },
      { type: 'overview', value: data.overview },
      { type: TYPE_NEW_LINE },
      {
        type: 'seasons',
        value: `Temporadas: ${data.seasons} | Capitulos: ${data.chapters}`,
      },
      { type: 'status', value: this.getStatus(data.status) },
      { type: 'year', value: data.years },
      { type: 'rating', value: data.rating },
      { type: 'genres', value: data.genres.join(' | ') },
      { type: 'runtime', value: data.runtime },
      { type: TYPE_NEW_LINE },
      { type: 'providers', value: data.providers.join(' | ') },
      { type: TYPE_NEW_LINE },
      { type: 'trailer', value: data.trailer },
    ]);

    return msg;
  }
}

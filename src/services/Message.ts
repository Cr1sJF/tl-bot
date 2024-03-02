import SearchMedia from '../models/SearchMedia';
import { IMovieData, ISeasonData, IShowData } from '../types';
import { StreamingAvailability } from '../types/Streaming';

const TYPE_TITLE = 'TITLE';
const TYPE_NEW_LINE = 'NEW_LINE';
interface MessageData {
  type: string;
  value?: string;
}

const typeToEmoji: Record<string, string> = {
  name: '✒️',
  tagline: '💭',
  overview: '📖',
  seasons: '📺',
  year: '📅',
  rating: '⭐️',
  genres: '🎭',
  runtime: '🕑',
  providers: '🍿',
  trailer: '🎬',
  status: 'ℹ️',
};

export default class MessageService {
  private buildHTML(items: MessageData[]): string {
    const htmlArray: string[] = [];

    items.forEach((item) => {
      let htmlItem = '';
      if (item.type == TYPE_TITLE) {
        htmlArray.push(`<b>🚨${item.value}🚨</b> \n`);
      } else if (item.type == TYPE_NEW_LINE) {
        htmlArray.push(`\n`);
      } else if (item.type == 'trailer' && item.value) {
        const emoji = typeToEmoji[item.type] || ''; // Obtener emoji del mapeo
        htmlItem = `${emoji}: <a href="${item.value}">Ver Trailer</a> \n`;
      } else {
        const emoji = typeToEmoji[item.type] || ''; // Obtener emoji del mapeo
        // const formattedValue = item.value.replace(/\n/g, '<br>'); // Reemplazar saltos de línea con <br>

        if (item.value) {
          htmlItem = `${emoji}: ${
            item.type == 'name' || item.type == 'tagline'
              ? '<i>' + item.value + '</i>'
              : item.value
          } \n`;
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
        { type: 'tagline', value: data.tagline },
        { type: TYPE_NEW_LINE },
        { type: 'overview', value: data.overview },
        { type: TYPE_NEW_LINE },
        { type: 'year', value: data.year },
        { type: 'rating', value: data.rating.toString() },
        { type: 'genres', value: data.genres.toString() },
        { type: 'runtime', value: data.runtime?.toString() },
        { type: TYPE_NEW_LINE },
        // { type: 'providers', value: data.providers.join(' | ') },
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
      { type: TYPE_NEW_LINE },
      { type: 'overview', value: data.overview },
      { type: TYPE_NEW_LINE },
      {
        type: 'seasons',
        value: `Temporadas: ${data.seasons} | Capítulos: ${data.chapters}`,
      },
      { type: 'status', value: data.status },
      { type: 'year', value: data.years },
      { type: 'rating', value: data.rating.toString() },
      { type: 'genres', value: data.genres.toString() },
      { type: 'runtime', value: data.runtime?.toString() },
      { type: TYPE_NEW_LINE },
      { type: 'trailer', value: data.trailer },
    ]);

    return msg;
  }

  // async notifyNewEpisode(payload: any) {
  //   console.log('PAYLOAD', payload);
  //   return true;
  // }

  getSeasonMessage(data: ISeasonData): string {
    const msg = this.buildHTML([
      { type: TYPE_TITLE, value: 'NUEVA TEMPORADA' },
      { type: TYPE_NEW_LINE },
      { type: 'name', value: data.name },
      { type: TYPE_NEW_LINE },
      { type: 'overview', value: data.overview },
      {
        type: 'seasons',
        value: `Temporada: ${data.season} | Capitulos: ${data.chapters}`,
      },
      { type: 'status', value: data.status },
      { type: 'year', value: data.year },
      { type: 'rating', value: data.rating.toString() },
      { type: 'genres', value: data.genres.toString() },
      { type: TYPE_NEW_LINE },
      { type: 'trailer', value: data.trailer },
    ]);

    return msg;
  }

  getSearchMessage(data: SearchMedia): string {
    const msg = this.buildHTML([
      { type: 'name', value: data.original_title },
      { type: TYPE_NEW_LINE },
      { type: 'overview', value: data.overview },
      { type: 'year', value: data.release_date },
      { type: 'rating', value: data.rating },
    ]);

    return msg;
  }

  getStreamingMessage(data: StreamingAvailability[]): string {
    const msg = data
      .map((i) => {
        return `-> <a href="${i.link}">${i.streamingPlatform}</a>`;
      })
      .join('\n');

      return msg;
  }
}

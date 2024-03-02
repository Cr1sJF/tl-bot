import { InlineKeyboard, Keyboard } from 'grammy';
import Log from '../../../models/Loggers/Logger';
import MessageService from '../../../services/Message';
import { MediaType, TmdbSearchMediaResponse } from '../../../types/TMDB';
import SearchMedia from '../../../models/SearchMedia';
import TmbdService from '../../../services/TMDB';

const log = new Log('TL_Utils');
const messageService = new MessageService();
const tmbdService = new TmbdService();
const keyboard = new Keyboard()
  .text('✅ Si')
  .text('❌ No')
  .oneTime()
  .persistent();

const MAP_TYPES = {
  PELICULA: 'movie',
  SERIE: 'tv',
  TEMPORADA: 'season',
};

export const getMediaWithConfirmation = (media: SearchMedia) => {
  let msg: string = messageService.getSearchMessage(media);

  return {
    text: msg,
    keyboard: keyboard,
  };
};

export const getMediaBatch = async (
  query: string,
  page: number,
  type: keyof typeof MAP_TYPES
): Promise<TmdbSearchMediaResponse[] | null> => {
  const result = await tmbdService.search(query, page);

  return (
    result?.filter((media) => media.media_type === MAP_TYPES[type]) || null
  );
};

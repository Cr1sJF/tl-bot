export interface StreamingDescription {
  service: string;
  streamingType: string;
  link: string;
  audios: { language: string; region: string }[];
  subtitles: {
    locale: { language: string; region: string };
    closedCaptions: boolean;
  }[];
  availableSince: number;
}

interface StreamingInfo {
  [countryCode: string]: StreamingDescription[];
}

interface Episode {
  type: string;
  title: string;
  streamingInfo: StreamingInfo;
  year: number;
}

interface Season {
  type: string;
  title: string;
  streamingInfo: StreamingInfo;
  firstAirYear: number;
  lastAirYear: number;
  episodes: Episode[];
}

interface Genre {
  id: number;
  name: string;
}

interface Result {
  type: string;
  title: string;
  overview: string;
  streamingInfo: StreamingInfo;
  cast: string[];
  firstAirYear: number;
  lastAirYear: number;
  imdbId: string;
  tmdbId: number;
  originalTitle: string;
  genres: Genre[];
  creators: string[];
  status: {
    statusCode: number;
    statusText: string;
  };
  seasonCount: number;
  episodeCount: number;
  seasons: Season[];
}

export interface StreamingData {
  result: Result;
}

export interface StreamingAvailability {
  streamingPlatform: string;
  link: string;
}

interface JellyfinBaseNotification {
    ServerId: string;
    ServerName: string;
    ServerVersion: string;
    ServerUrl: string;
    NotificationType: string;
    Timestamp: string;
    UtcTimestamp: string;
    Name: string;
    Overview: string;
    Tagline: string;
    ItemId: string;
    ItemType: string;
    RunTimeTicks: number;
    RunTime: string;
}

interface VideoInfo {
    Title: string;
    Type: string;
    Codec: string;
    Profile: string;
    Level: number;
    Height: number;
    Width: number;
    AspectRatio: string;
    Interlaced: boolean;
    FrameRate: number;
    VideoRange: string;
    ColorSpace: string | null;
    ColorTransfer: string | null;
    ColorPrimaries: string | null;
    PixelFormat: string;
    RefFrames: number;
}

interface AudioInfo {
    Title: string;
    Type: string;
    Language: string;
    Codec: string;
    Channels: number;
    Bitrate: number;
    SampleRate: number;
    Default: boolean;
}

interface SubtitleInfo {
    Title: string;
    Type: string;
    Language: string;
    Codec: string;
    Default: boolean;
    Forced: boolean;
    External: boolean;
}

// Interfaces específicas para cada tipo de notificación
export interface JellyfinMovieNotification extends JellyfinBaseNotification {
    Provider_tmdb: string;
    Provider_imdb: string;
    Video_0: VideoInfo;
    Audio_0: AudioInfo;
    Subtitle_0: SubtitleInfo;
    Subtitle_1: SubtitleInfo;
    type: "movie"
}

export interface JellyfinEpisodeNotification extends JellyfinBaseNotification {
    SeriesName: string;
    SeasonNumber: number;
    SeasonNumber00: string;
    SeasonNumber000: string;
    EpisodeNumber: number;
    EpisodeNumber00: string;
    EpisodeNumber000: string;
    Video_0: VideoInfo;
    Audio_0: AudioInfo;
    type: "episode"
}

export interface JellyfinShowNotification extends JellyfinBaseNotification {
    Year: number;
    Provider_tmdb: string;
    Provider_imdb: string;
    Provider_tvdb: string;
    type: "show"
}

export interface JellyfinSeasonNotification extends JellyfinBaseNotification {
    SeriesName: string;
    SeasonNumber: number;
    SeasonNumber00: string;
    SeasonNumber000: string;
    type: "season"
}

export interface MovieItem {
    Name: string;
    ServerId: string;
    Id: string;
    HasSubtitles: boolean;
    Container: string;
    PremiereDate: string;
    CriticRating: number;
    Path: string;
    OfficialRating: string;
    ChannelId: string | null;
    Overview: string;
    Genres: string[];
    CommunityRating: number;
    RunTimeTicks: number;
    ProductionYear: number;
    IsFolder: boolean;
    Type: string;
    GenreItems: GenreItem[];
    VideoType: string;
    ImageTags: {
        Primary: string;
        Logo: string;
    };
    BackdropImageTags: string[];
    ImageBlurHashes: {
        Backdrop: {
            [key: string]: string;
        };
        Primary: {
            [key: string]: string;
        };
        Logo: {
            [key: string]: string;
        };
    };
    LocationType: string;
    MediaType: string;
}

export interface SeasonItem {
    Name: string;
    ServerId: string;
    Id: string;
    PremiereDate: string;
    ParentId: string;
    ChannelId: string | null;
    ProductionYear: number;
    IndexNumber: number;
    IsFolder: boolean;
    Type: string;
    ParentBackdropItemId: string;
    ParentBackdropImageTags: string[];
    SeriesName: string;
    SeriesId: string;
    SeriesPrimaryImageTag: string;
    ImageTags: {
        Primary: string;
    };
    BackdropImageTags: string[];
    ImageBlurHashes: {
        Primary: {
            [key: string]: string;
        };
        Backdrop: {
            [key: string]: string;
        };
    };
    LocationType: string;
}

export interface ShowItem {
    Name: string;
    ServerId: string;
    Id: string;
    PremiereDate: string;
    ChannelId: string | null;
    CommunityRating: number;
    RunTimeTicks: number;
    ProductionYear: number;
    ProviderIds: {
        Tmdb: string;
        Imdb: string;
        Tvdb: string;
    };
    IsFolder: boolean;
    ParentId: string;
    Type: string;
    Status: string;
    AirDays: string[];
    ImageTags: {
        Primary: string;
    };
    BackdropImageTags: string[];
    ImageBlurHashes: {
        Backdrop: {
            [key: string]: string;
        };
        Primary: {
            [key: string]: string;
        };
    };
    LocationType: string;
    EndDate: string;
}

export interface GenreItem {
    Name: string;
    Id: string;
}

export interface JellyfinResponse<T> {
    Items: T[];
    TotalRecordCount: number;
    StartIndex: number;
}


//

interface FolderItem {
    Name: string;
    ServerId: string;
    Id: string;
    Etag: string;
    DateCreated: string;
    CanDelete: boolean;
    CanDownload: boolean;
    SortName: string;
    ExternalUrls: any[]; // Cambia "any" por el tipo correcto si es conocido
    Path: string;
    EnableMediaSourceDisplay: boolean;
    ChannelId: string | null;
    Taglines: any[]; // Cambia "any" por el tipo correcto si es conocido
    Genres: any[]; // Cambia "any" por el tipo correcto si es conocido
    RemoteTrailers: any[]; // Cambia "any" por el tipo correcto si es conocido
    ProviderIds: any; // Cambia "any" por el tipo correcto si es conocido
    IsFolder: boolean;
    ParentId: string | null;
    Type: string;
    People: any[]; // Cambia "any" por el tipo correcto si es conocido
    Studios: any[]; // Cambia "any" por el tipo correcto si es conocido
    GenreItems: any[]; // Cambia "any" por el tipo correcto si es conocido
    LocalTrailerCount: number;
    SpecialFeatureCount: number;
    DisplayPreferencesId: string;
    Tags: any[]; // Cambia "any" por el tipo correcto si es conocido
    ImageTags: any; // Cambia "any" por el tipo correcto si es conocido
    BackdropImageTags: any[]; // Cambia "any" por el tipo correcto si es conocido
    ImageBlurHashes: any; // Cambia "any" por el tipo correcto si es conocido
    LocationType: string;
    LockedFields: any[]; // Cambia "any" por el tipo correcto si es conocido
    LockData: boolean;
}
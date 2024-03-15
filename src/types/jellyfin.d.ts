//#region NOTIFICATIONS
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
  type: 'movie';
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
  type: 'episode';
}

export interface JellyfinShowNotification extends JellyfinBaseNotification {
  Year: number;
  Provider_tmdb: string;
  Provider_imdb: string;
  Provider_tvdb: string;
  type: 'show';
}

export interface JellyfinSeasonNotification extends JellyfinBaseNotification {
  SeriesName: string;
  SeasonNumber: number;
  SeasonNumber00: string;
  SeasonNumber000: string;
  type: 'season';
}
//#endregion

//#region ITEMS RESPONSE
export interface JellyfinBaseItem {
  BackdropImageTags: string[];
  ChannelId: string;
  CommunityRating: number;
  Id: string;
  ImageBlurHashes: {
    [key: string]: {
      [key: string]: string;
    };
  };
  ImageTags: {
    Logo: string;
    Primary: string;
  };
  isFolder: boolean;
  LocationType: string;
  Name: string;
  OfficialRating: string;
  PremiereDate: string;
  ProductionYear: number;
  ParentId: string;
  ProviderIds: {
    Imdb: string;
    Tmdb: string;
  };
  RunTimeTicks: number;
  ServerId: string;
  UserData: {
    IsFavorite: boolean;
    Key: string;
    PlaybackPositionTicks: number;
    PlayCount: number;
    Played: boolean;
  };
}

export interface JellyfinMovieItem extends JellyfinBaseItem {
  Container: string;
  CriticRating: number;
  HasSubtitles: boolean;
  MediaType: string;
  VideoType: string;
  Type: "Movie";
}

export interface JellifynShowItem extends JellyfinBaseItem {
  AirDays: string[];
  ProviderIds: {
    Tvdb: string;
    Tmdb: string;
    Imdb: string;
  };
  Status: string;
  UserData: {
    IsFavorite: boolean;
    Key: string;
    PlaybackPositionTicks: number;
    PlayCount: number;
    Played: boolean;
    UnplayedItemCount: number;
  };
  Type: "Series"
}

export interface JellyfinResponse<T> {
  Items: T[];
  TotalRecordCount: number;
  StartIndex: number;
}

//#endregion


//#region USER RESPONSE
export interface UserResponse {
  User:        User;
  SessionInfo: SessionInfo;
  AccessToken: string;
  ServerId:    string;
}

export interface SessionInfo {
  PlayState:                PlayState;
  AdditionalUsers:          any[];
  Capabilities:             Capabilities;
  RemoteEndPoint:           string;
  PlayableMediaTypes:       any[];
  Id:                       string;
  UserId:                   string;
  UserName:                 string;
  Client:                   string;
  LastActivityDate:         Date;
  LastPlaybackCheckIn:      Date;
  DeviceName:               string;
  DeviceId:                 string;
  ApplicationVersion:       string;
  IsActive:                 boolean;
  SupportsMediaControl:     boolean;
  SupportsRemoteControl:    boolean;
  NowPlayingQueue:          any[];
  NowPlayingQueueFullItems: any[];
  HasCustomDeviceName:      boolean;
  ServerId:                 string;
  SupportedCommands:        any[];
}

export interface Capabilities {
  PlayableMediaTypes:           any[];
  SupportedCommands:            any[];
  SupportsMediaControl:         boolean;
  SupportsContentUploading:     boolean;
  SupportsPersistentIdentifier: boolean;
  SupportsSync:                 boolean;
}

export interface PlayState {
  CanSeek:    boolean;
  IsPaused:   boolean;
  IsMuted:    boolean;
  RepeatMode: string;
}

export interface User {
  Name:                      string;
  ServerId:                  string;
  Id:                        string;
  HasPassword:               boolean;
  HasConfiguredPassword:     boolean;
  HasConfiguredEasyPassword: boolean;
  EnableAutoLogin:           boolean;
  LastLoginDate:             Date;
  LastActivityDate:          Date;
  Configuration:             Configuration;
  Policy:                    Policy;
}

export interface Configuration {
  AudioLanguagePreference:    string;
  PlayDefaultAudioTrack:      boolean;
  SubtitleLanguagePreference: string;
  DisplayMissingEpisodes:     boolean;
  GroupedFolders:             any[];
  SubtitleMode:               string;
  DisplayCollectionsView:     boolean;
  EnableLocalPassword:        boolean;
  OrderedViews:               string[];
  LatestItemsExcludes:        string[];
  MyMediaExcludes:            any[];
  HidePlayedInLatest:         boolean;
  RememberAudioSelections:    boolean;
  RememberSubtitleSelections: boolean;
  EnableNextEpisodeAutoPlay:  boolean;
}

export interface Policy {
  IsAdministrator:                  boolean;
  IsHidden:                         boolean;
  IsDisabled:                       boolean;
  BlockedTags:                      any[];
  EnableUserPreferenceAccess:       boolean;
  AccessSchedules:                  any[];
  BlockUnratedItems:                any[];
  EnableRemoteControlOfOtherUsers:  boolean;
  EnableSharedDeviceControl:        boolean;
  EnableRemoteAccess:               boolean;
  EnableLiveTvManagement:           boolean;
  EnableLiveTvAccess:               boolean;
  EnableMediaPlayback:              boolean;
  EnableAudioPlaybackTranscoding:   boolean;
  EnableVideoPlaybackTranscoding:   boolean;
  EnablePlaybackRemuxing:           boolean;
  ForceRemoteSourceTranscoding:     boolean;
  EnableContentDeletion:            boolean;
  EnableContentDeletionFromFolders: any[];
  EnableContentDownloading:         boolean;
  EnableSyncTranscoding:            boolean;
  EnableMediaConversion:            boolean;
  EnabledDevices:                   any[];
  EnableAllDevices:                 boolean;
  EnabledChannels:                  any[];
  EnableAllChannels:                boolean;
  EnabledFolders:                   any[];
  EnableAllFolders:                 boolean;
  InvalidLoginAttemptCount:         number;
  LoginAttemptsBeforeLockout:       number;
  MaxActiveSessions:                number;
  EnablePublicSharing:              boolean;
  BlockedMediaFolders:              any[];
  BlockedChannels:                  any[];
  RemoteClientBitrateLimit:         number;
  AuthenticationProviderId:         string;
  PasswordResetProviderId:          string;
  SyncPlayAccess:                   string;
}

//#endregion

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

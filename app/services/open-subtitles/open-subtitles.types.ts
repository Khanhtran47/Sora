export interface ISubtitlesSearch {
  data: ISubtitle[];
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface ISubtitleDownload {
  file_name: string;
  link: string;
  message: string;
  remaining: number;
  requests: number;
  reset_time: string;
  reset_time_utc: Date;
}

export interface ISubtitle {
  attributes: IAttributes;
  id: string;
  type: string;
}

export interface IAttributes {
  ai_translated: boolean;
  comments: string;
  download_count: number;
  feature_details: IFeatureDetails;
  files: IFile[];
  foreign_parts_only: boolean;
  fps: number;
  from_trusted: boolean | null;
  hd: boolean;
  hearing_impaired: boolean;
  language: string;
  legacy_subtitle_id: number | null;
  machine_translated: boolean;
  new_download_count: number;
  ratings: number;
  related_links: IRelatedLinks;
  release: string;
  subtitle_id: string;
  upload_date: Date;
  uploader: IUploader;
  url: string;
  votes: number;
}

export interface IFeatureDetails {
  feature_id: number;
  feature_type: string;
  imdb_id: number;
  movie_name: string;
  title: string;
  tmdb_id: number;
  year: number;
}

export interface IFile {
  cd_number: number;
  file_id: number;
  file_name: null | string;
}

export interface IRelatedLinks {
  img_url: string;
  label: string;
  url: string;
}

export interface IUploader {
  name: string;
  rank: string;
  uploader_id: number | null;
}

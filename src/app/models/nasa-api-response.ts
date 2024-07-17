export interface Link {
  href: string;
  rel: string;
  render?: string;
  prompt?: string;
}

export interface Data {
  center: string;
  date_created: string;
  description: string;
  keywords?: string[];
  location?: string;
  media_type: string;
  nasa_id: string;
  photographer?: string;
  title: string;
  description_508?: string;
  secondary_creator?: string;
}

export interface Item {
  href: string;
  data: Data[];
  links: Link[];
}

export interface Metadata {
  total_hits: number;
}

export interface Collection {
  version: string;
  href: string;
  items: Item[];
  metadata?: Metadata;
  links?: Link[];
}

export interface NasaApiResponse {
  collection: Collection;
}

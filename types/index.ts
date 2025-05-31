export interface LocationType {
  id: string;
  name: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
  slug?: string;
  country_code: string;
}

export interface ImageType {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export interface CategoryType {
  id: string;
  name: string;
}

export interface TagType {
  id: string;
  name: string;
}

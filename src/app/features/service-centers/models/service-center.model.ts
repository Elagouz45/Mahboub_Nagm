export interface ServiceCenter {
  readonly id: string;
  readonly name: string;
  readonly governorate: string;
  readonly categorySlugs: readonly string[];
  readonly address?: string;
  readonly phone?: string;
  readonly lat?: number;
  readonly lng?: number;
}

export interface ServiceCentersQuery {
  readonly q: string;
  readonly governorate: string;
  readonly category: string;
}

export interface ServiceCentersSearchResult {
  readonly items: readonly ServiceCenter[];
  readonly total: number;
}

export const DEFAULT_SERVICE_CENTERS_QUERY: ServiceCentersQuery = {
  q: '',
  governorate: '',
  category: '',
};

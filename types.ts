export interface LocationData {
  name: string;
  date: string;
}

export interface PosterFormData {
  title: string;
  englishTitle: string;
  locations: [LocationData, LocationData, LocationData];
  referenceImage: string | null; // Base64
}

export enum AppState {
  IDLE = 'IDLE',
  PROMPT_REVIEW = 'PROMPT_REVIEW',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationResult {
  imageUrl: string;
}
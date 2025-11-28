export interface AnalysisResult {
  dataUsage: string;
  permissions: string;
  risks: string;
  rights: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}
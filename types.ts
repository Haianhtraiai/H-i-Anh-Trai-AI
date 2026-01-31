
export enum AppStep {
  UPLOAD = 'UPLOAD',
  CHARACTER = 'CHARACTER',
  BACKGROUND = 'BACKGROUND',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT'
}

export interface SelectionOption {
  id: string;
  name: string;
  thumbnail: string;
  promptDescription: string;
}

export interface AppState {
  step: AppStep;
  productImage: string | null;
  selectedCharacter: SelectionOption | null;
  selectedBackground: SelectionOption | null;
  resultImage: string | null;
  error: string | null;
}

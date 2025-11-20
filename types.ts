export interface Poem {
  id: string;
  title: string;
  author: string;
  content: string; // Full content
  chunks: string[]; // Pre-calculated chunks for gameplay
}

export interface CellData {
  id: string;
  char: string;
  row: number;
  col: number;
  isPath: boolean; // Is this part of the correct path?
  sequenceIndex: number; // Order in the sentence (-1 if distractor)
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED'
}

import { CardDto } from './card';

export interface DetermineObject {
  valid: boolean;
  highCard: number;
  cards: CardDto[];
  name?: string;
  power?: number;
  ranking?: number;
}

export interface DetermineWinnerObject {
  player1Winner: boolean;
  player2Winner: boolean;
}

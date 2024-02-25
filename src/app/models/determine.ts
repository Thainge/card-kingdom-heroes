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
  tie: boolean;
  player1Winner: boolean;
  player1Determine: DetermineObject;
  player2Winner: boolean;
  player2Determine: DetermineObject;
}

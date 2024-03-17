export interface CardDto {
  id: number;
  suit?: string;
  value?: string;
  image?: string;

  wild?: boolean;
  wildInitial?: string;
  wildCurrent?: string;

  wildRange?: number;
  wildSuit?: boolean;
  wildSuits?: number[];
}

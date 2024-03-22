export interface FlagDto {
  id: number;
  x: number;
  y: number;
  levelStatus: levelStatus;
  levelType: levelType;
  dots: DotDto[];
}

type levelStatus = 'nextLevel' | 'finished' | 'hidden';
type levelType = 'normal' | 'boss';

export interface DotDto {
  id: number;
  x: number;
  y: number;
}

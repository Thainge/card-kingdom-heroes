export interface FlagDto {
  id: number;
  x: number;
  y: number;
  levelStatus: levelStatus;
  levelType: levelType;
  dots: DotDto[];
  alreadyAnimated: boolean;
}

type levelStatus = 'nextLevel' | 'finished' | 'justFinished' | 'hidden';
type levelType = 'normal' | 'boss';

export interface DotDto {
  id: number;
  x: number;
  y: number;
}

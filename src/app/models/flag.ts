export interface FlagDto {
  id: number;
  x: number;
  y: number;
  levelStatus: levelStatus;
  levelType: levelType;
  dots: DotDto[];
  alreadyAnimated: boolean;
  missionDetails: MissionDetails;
}

interface MissionDetails {
  image: string;
  title: string;
  description: string;
  rewardMin: number;
  rewardMax: number;
}

type levelStatus = 'nextLevel' | 'finished' | 'justFinished' | 'hidden';
type levelType = 'normal' | 'boss';

export interface DotDto {
  id: number;
  x: number;
  y: number;
}

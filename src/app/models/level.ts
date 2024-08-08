import { AbilityCard } from './abilityCard';
import { BackgroundDto } from './backgrounds';
import { CardDto } from './card';
import { DialogDto } from './dialog';
import { PlayerDto } from './player';
import { gameTheme } from './theme';

export interface LevelDto {
  id: number;

  shuffleCards: boolean;
  shuffleAbilityCards: boolean;
  shuffleCardsBot: boolean;
  shuffleAbilityCardsBot: boolean;
  allCardsWild?: boolean;
  showGuide?: boolean;
  showAbilityGuide?: boolean;
  showComicStart?: boolean;
  showComicEnd?: boolean;
  comicData?: Comic;
  comicDataEndOnly?: Comic;
  showComicEndOnly?: boolean;

  cards: CardDto[];

  hideDialog?: boolean;
  easyMode?: boolean;
  combatPhases: EnemyLevelDto[];
  isChallengeLevel?: boolean;

  playerLevelUpEnabled: boolean;
  skipRedrawPhase: boolean;
  battleRewardXp: number;
}

export interface Comic {
  id: number;
  comics: ComicPage[];
  display: boolean;
}

export interface ComicPage {
  id: number;
  image: string;
  display: boolean;
  blackList: ComicBlack[];
}

interface ComicBlack {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  display: boolean;
}

export interface EnemyLevelDto {
  id: number;
  enemyPlayers: PlayerDto[];
  enemyAbilityCards: AbilityCard[];
  background: BackgroundDto;
  enemyCardTheme: gameTheme;

  showSnowEffect: boolean;
  showBubblesEffect: boolean;
  showLeavesEffect: boolean;
  showSunFlareEffect: boolean;
  showCloudsEffect: boolean;
  showNightEffect: boolean;
  showFireEffect: boolean;
  showAshesEffect: boolean;

  dialogStart?: DialogDto[];
  dialogEnd?: DialogDto[];
}

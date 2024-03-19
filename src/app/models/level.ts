import { AbilityCard } from './abilityCard';
import { BackgroundDto } from './backgrounds';
import { DialogDto } from './dialog';
import { PlayerDto } from './player';

export interface LevelDto {
  id: number;

  shuffleCards: boolean;
  shuffleAbilityCards: boolean;
  shuffleCardsBot: boolean;
  shuffleAbilityCardsBot: boolean;

  easyMode: boolean;
  canDefendWithMultipleCards: boolean;
  alwaysWinTies: boolean;
  canSeeTopCard: boolean;
  canSeeTopCardAbilities: boolean;
  combatPhases: EnemyLevelDto[];

  playerLevelUpEnabled: boolean;
  skipRedrawPhase: boolean;
  battleRewardXp: number;
}

export interface EnemyLevelDto {
  id: number;
  enemyPlayers: PlayerDto[];
  enemyAbilityCards: AbilityCard[];
  background: BackgroundDto;
  enemyCardTheme: CardThemeDto;

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

type CardThemeDto = 'default' | 'mario';

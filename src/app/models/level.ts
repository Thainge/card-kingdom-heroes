import { AbilityCard } from './abilityCard';
import { BackgroundDto } from './backgrounds';
import { DialogDto } from './dialog';
import { PlayerDto } from './player';

export interface LevelDto {
  id: number;

  dialogList: DialogDto[];

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
}

export interface EnemyLevelDto {
  id: number;
  enemyPlayers: PlayerDto[];
  enemyAbilityCards: AbilityCard[];
  background: BackgroundDto;
  enemyCardTheme: CardThemeDto;
}

type CardThemeDto = 'default' | 'mario';

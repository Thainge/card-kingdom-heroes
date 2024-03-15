import { AbilityCard } from './abilityCard';
import { CardDto } from './card';
import { PlayerDto } from './player';

export interface LevelDto {
  id: number;
  enemyPlayers: PlayerDto[];
  enemyAbilityCards: AbilityCard[];
  enemyCardTheme: CardThemeDto;
  background: LevelBackgroundDto;
}

type CardThemeDto = 'default' | 'mario';
type LevelBackgroundDto = 'forest';

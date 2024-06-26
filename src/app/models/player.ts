import { HeroSound } from './sound';

export interface PlayerDto {
  id: number;
  health: number;
  attack: number;
  image: string;
  name: string;
  baseHealth: number;
  baseAttack: number;
  level: number;
  heroSelectSound?: HeroSound;
  xp?: number;
  xpLevels?: number[];
  isMaxLevel?: boolean;
  skills?: PlayerUnlockedAbilties;
  color?: HeroColor;
  points?: number;
  usedPoints?: number;
  selected?: boolean;
  unlocked?: boolean;
  upgrades?: HeroUpgrade[];
  disabled?: boolean;
  canDefendWithMultipleCards?: boolean;
  alwaysWinTies?: boolean;
  canSeeTopCard?: boolean;
  canSeeTopCardAbilities?: boolean;
}

export interface HeroUpgrade {
  id: number;
  level: HeroUpgradeLevel;
  image: string;
  title: string[];
  description: string[];
  cost: number[];
  type: UpgradeType[];
}

type UpgradeType =
  | 'canDefendWithMultipleCards'
  | 'alwaysWinTies'
  | 'canSeeTopCard'
  | 'canSeeTopCardAbilities'
  | 'wildCardsCount'
  | 'extraHealth'
  | 'extraAttack'
  | 'wildHearts'
  | 'wildDiamonds'
  | 'wildSpades'
  | 'wildClubs'
  | 'rangeHearts'
  | 'rangeDiamonds'
  | 'rangeSpades'
  | 'rangeClubs'
  | 'extraHeartsDamage'
  | 'extraDiamondsDamage'
  | 'extraSpadesDamage'
  | 'extraClubsDamage'
  | 'rangeHeartsDiamonds'
  | 'rangeSpadesClubs';

type HeroUpgradeLevel = 0 | 1 | 2 | 3;
type HeroColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

interface PlayerUnlockedAbilties {
  // Which cards are wild
  wildHearts: boolean;
  wildDiamonds: boolean;
  wildSpades: boolean;
  wildClubs: boolean;

  // What range can wild cards go
  rangeHearts: number;
  rangeDiamonds: number;
  rangeSpades: number;
  rangeClubs: number;

  // What suit options should appear
  showWildHearts: boolean;
  showWildDiamonds: boolean;
  showWildSpades: boolean;
  showWildClubs: boolean;

  // Extra damage for suites
  extraHeartsDamage: boolean;
  extraDiamondsDamage: boolean;
  extraSpadesDamage: boolean;
  extraClubsDamage: boolean;

  // Wild cards unlocked
  wildCardsCount: number;

  // Extra health
  extraHealth: number;

  // Extra attack
  extraAttack: number;
}

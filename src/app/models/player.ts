export interface PlayerDto {
  id: number;
  health: number;
  attack: number;
  image: string;
  name: string;
  baseHealth: number;
  baseAttack: number;
  level: number;
  skills?: PlayerUnlockedAbilties;
}

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

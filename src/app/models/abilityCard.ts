export interface AbilityCard {
  id: number;
  name: string;
  cost: number[];
  description: string;
  level: number;
  image: string;
  abilityFunction: AbilityFunction;
  abilityValue: number;
}

type AbilityFunction = 'damage' | 'heal';

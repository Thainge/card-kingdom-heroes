export interface AbilityCard {
  id: number;
  name: string;
  cost: costValue[];
  description: string;
  level: number;
  image: string;
  abilityFunction: AbilityFunction;
  abilityValue: number;
}

type AbilityFunction = 'damage' | 'heal';
type costValue = 'hearts' | 'diamonds' | 'spades' | 'clubs';

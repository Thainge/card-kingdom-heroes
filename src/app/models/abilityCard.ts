export interface AbilityCard {
  id: number;
  name: string;
  cost: CostValue[];
  description: string;
  level: number;
  image: string;
  abilityFunction: AbilityFunction;
  targetAll: boolean;
  abilityValue: number;
  hitAnimation: AnimationType;
}

type AbilityFunction =
  | 'damage'
  | 'heal'
  | 'draw'
  | 'redraw'
  | 'redrawAll'
  | 'discard'
  | 'offense'
  | 'leach'
  | 'wildSuit'
  | 'wildRange'
  | 'wildSuitRange';
type CostValue = 'hearts' | 'diamonds' | 'spades' | 'clubs' | 'black' | 'red';
type AnimationType = 'fire' | 'heal' | 'shield';

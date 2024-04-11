import { PlayerDto } from './player';

export interface AbilityCard {
  id: number;
  name: string;
  cost: CostValue[][];
  description: string[];
  level: number;
  image: string;
  abilityFunction: AbilityFunction;
  targetAll: boolean;
  abilityValue: number[];
  hitAnimation: AnimationType;
  alliesCalled?: PlayerDto[][];
  numberOwned: number;
  trueNumberOwned: number;
  isNew: boolean;
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
  | 'wildSuitRange'
  | 'increaseDefense'
  | 'callInSupport';
type CostValue = 'hearts' | 'diamonds' | 'spades' | 'clubs' | 'black' | 'red';
type AnimationType = 'fire' | 'heal' | 'shield';

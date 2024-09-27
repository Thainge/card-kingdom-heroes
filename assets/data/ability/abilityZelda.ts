import { AbilityCard } from 'src/app/models/abilityCard';

export const AbilityDataZelda: AbilityCard[] = [
  {
    id: 1,
    boosterId: 1,
    abilityFunction: 'leach',
    targetAll: false,
    abilityValue: [1, 2, 3],
    cost: [
      ['red', 'red'],
      ['red', 'red'],
      ['hearts'],
    ],
    name: 'Leach Shield',
    description: [
      'Steal 1 health from target enemy',
      'Steal 2 health from target enemy',
      'Steal 3 health from target enemy',
    ],

    image: '11.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 5,
    boosterId: 1,
    abilityFunction: 'leach',
    targetAll: true,
    abilityValue: [1, 1, 2],
    cost: [
      ['red', 'black'],
      ['red', ],
      ['hearts'],
    ],
    name: 'Thorns',
    description: [
      'Steal 1 health from all enemies',
      'Steal 1 health from all enemies',
      'Steal 2 health from all enemies',
    ],

    image: '12.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 10,
    boosterId: 1,
    abilityFunction: 'offense',
    targetAll: true,
    abilityValue: [1, 2, 2],
    cost: [
      ['clubs', 'diamonds'],
      ['black', 'black'],
      ['black'],
    ],
    name: 'Poison',
    description: [
      'Apply -1 offense to every enemy',
      'Apply -2 offense to every enemy',
      'Apply -2 offense to every enemy',
    ],

    image: '9.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 15,
    boosterId: 1,
    abilityFunction: 'offense',
    targetAll: false,
    abilityValue: [1, 2, 4],
    cost: [
      ['hearts', 'diamonds'],
      ['red', 'red'],
      ['red'],
    ],
    name: 'Forest Ring',
    description: [
      'Apply -1 offense to target enemy',
      'Apply -2 offense to target enemy',
      'Apply -4 offense to target enemy',
    ],

    image: '10.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 20,
    boosterId: 2,
    abilityFunction: 'damage',
    targetAll: false,
    abilityValue: [1,2, 3],
    cost: [
      ['spades'],
      ['spades'],
      ['spades'],
    ],
    name: 'Frost Shot',
    description: [
      'Deal 1 damage to target enemy',
      'Deal 2 damage to target enemy',
      'Deal 3 damage to target enemy',
    ],

    image: '6.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 25,
    boosterId: 2,
    abilityFunction: 'heal',
    targetAll: false,
    abilityValue: [1, 2, 3],
    cost: [['hearts'], ['hearts'], ['hearts']],
    name: 'Frost Pendant',
    description: [
      'Heal player for 1 health',
      'Heal player for 2 health',
      'Heal player for 3 health',
    ],

    image: '5.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 30,
    boosterId: 2,
    abilityFunction: 'heal',
    targetAll: false,
    abilityValue: [3, 4, 4],
    cost: [
      ['red', 'red'],
      ['red', 'red'],
      ['red',],
    ],
    name: 'Frozen Heart',
    description: [
      'Heal player for 3 health',
      'Heal player for 4 health',
      'Heal player for 4 health',
    ],

    image: '8.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 35,
    boosterId: 2,
    abilityFunction: 'draw',
    targetAll: false,
    abilityValue: [3, 3, 3],
    cost: [
      ['red','diamonds', 'hearts'],
      ['red', 'red', 'red'],
      ['red', 'red'],
    ],
    name: 'Mountain Roar',
    description: ['Draw 3 cards', 'Draw 3 cards', 'Draw 3 cards'],
    image: '7.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 40,
    boosterId: 3,
    abilityFunction: 'redraw',
    targetAll: false,
    abilityValue: [5, 5, 5],
    cost: [
      ['black', 'black', 'red', 'red'],
      ['black', 'black', 'red'],
      ['black', 'red'],
    ],
    name: 'Han Trick',
    description: [
      'Redraw Entire Hand',
      'Redraw Entire Hand',
      'Redraw Entire Hand',
    ],
    image: '15.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 45,
    boosterId: 3,
    abilityFunction: 'redrawAll',
    targetAll: false,
    abilityValue: [5, 5, 5],
    cost: [
      ['hearts', 'spades'],
      ['hearts'],
      [],
    ],
    name: 'Magic Pot',
    description: [
      'Redraw Entire Hand',
      'Redraw Entire Hand',
      'Redraw Entire Hand',
    ],
    image: '13.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 50,
    boosterId: 3,
    abilityFunction: 'wildSuit',
    targetAll: false,
    abilityValue: [1, 1, 1],
    cost: [['black', 'clubs'], ['clubs'], []],
    name: 'Gold Potion',
    description: [
      'Wild Suit A Card In Hand',
      'Wild Suit A Card In Hand',
      'Wild Suit A Card In Hand',
    ],
    image: '16.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 55,
    boosterId: 3,
    abilityFunction: 'wildRange',
    targetAll: false,
    abilityValue: [1, 2, 3],
    cost: [['diamonds'], [], []],
    name: 'Gold Fork',
    description: [
      'Wild Range +1 For A Card In Hand',
      'Wild Range +2 For A Card In Hand',
      'Wild Range +3 For A Card In Hand',
    ],
    image: '14.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 60,
    boosterId: 3,
    abilityFunction: 'wildSuitRange',
    targetAll: false,
    abilityValue: [14, 14, 14],
    cost: [['hearts'], ['red'], []],
    name: 'Fire Potion',
    description: [
      'Wild A Card In Hand',
      'Wild A Card In Hand',
      'Wild A Card In Hand',
    ],
    image: '2.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 65,
    boosterId: 3,
    abilityFunction: 'increaseDefense',
    targetAll: false,
    abilityValue: [1, 2, 2],
    cost: [['red','black'], ['red'], []],
    name: 'Heart of Fire',
    description: [
      'Increase Defense by 1',
      'Increase Defense by 2',
      'Increase Defense by 2',
    ],

    image: '4.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 70,
    boosterId: 3,
    abilityFunction: 'increaseDefense',
    targetAll: true,
    abilityValue: [2, 2, 2],
    cost: [['black', 'black'], ['black'], []],
    name: 'Seethe',
    description: [
      'Increase Defense by 2',
      'Increase Defense by 2',
      'Increase Defense by 2',
    ],

    image: '3.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
  {
    id: 70,
    boosterId: 3,
    abilityFunction: 'wildRange',
    targetAll: true,
    abilityValue: [1, 1, 2],
    cost: [['black'], [], []],
    name: 'Fire Void',
    description: [
      'Wild range +1 for target card in hand',
      'Wild range +1 for target card in hand',
      'Wild range +2 for target card in hand',
    ],

    image: '1.png',
    level: 1,
    isNew: true,
    numberOwned: 1,
    trueNumberOwned: 1,
    goldCost: [100, 250, 500],
    alliesCalled: [],
    hitAnimation: 'fire',
  },
];
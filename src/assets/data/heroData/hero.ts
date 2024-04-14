import { PlayerDto } from 'src/app/models/player';

export const HeroData: PlayerDto[] = [
  {
    id: 1,
    name: 'Mario',
    image: 'mario.png',
    color: 'red',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 2,
    name: 'Link',
    image: 'link.png',
    color: 'green',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 3,
    name: 'Link',
    image: 'link.png',
    color: 'green',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 4,
    name: 'Link',
    image: 'link.png',
    color: 'green',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 5,
    name: 'Koopa',
    image: 'koopa.png',
    color: 'orange',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 6,
    name: 'Goomba',
    image: 'goomba.png',
    color: 'yellow',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 7,
    name: 'Moblin',
    image: 'moblin.png',
    color: 'blue',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
  {
    id: 8,
    name: 'Dummy',
    image: 'dummy.png',
    color: 'purple',
    level: 1,
    health: 3,
    attack: 1,
    baseAttack: 1,
    baseHealth: 3,
    canDefendWithMultipleCards: false,
    alwaysWinTies: false,
    canSeeTopCard: false,
    canSeeTopCardAbilities: false,
    xp: 0,
    isMaxLevel: false,
    skills: {
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,
      wildCardsCount: 4,
      extraHealth: 0,
      extraAttack: 0,
    },
    xpLevels: [60, 90, 120],
    upgrades: [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        type: 'extraAttack',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        type: 'extraHealth',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        type: 'wildCardsCount',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        type: 'extraHeartsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        type: 'extraClubsDamage',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ],
    points: 5,
    selected: false,
    unlocked: false,
    usedPoints: 0,
    disabled: true,
  },
];

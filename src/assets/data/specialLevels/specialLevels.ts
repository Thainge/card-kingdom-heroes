import { LevelDto } from 'src/app/models/level';
import { EnemyAbilityCardsSet1 } from '../enemyAbilityCards/enemyAbilityCards';
import { FlagDto } from 'src/app/models/flag';
import { Cards } from '../cards';

const Level: LevelDto = {
  id: 1,
  skipRedrawPhase: true,
  battleRewardXp: 50,
  playerLevelUpEnabled: true,
  hideDialog: false,
  allCardsWild: false,
  showGuide: true,
  showAbilityGuide: false,
  cards: Cards,

  shuffleAbilityCards: true,
  shuffleCards: true,
  shuffleAbilityCardsBot: true,
  shuffleCardsBot: true,
  isChallengeLevel: true,

  combatPhases: [],
};

export const ChallengeFlags: FlagDto[] = [
  {
    id: 101,
    x: 0,
    y: 0,
    levelStatus: 'nextLevel',
    alreadyAnimated: true,
    missionDetails: {
      image: 'loadingBg.png',
      title: 'Skyloft',
      description: `A place of harmony and peace...`,
      rewardMin: 50,
      rewardMax: 100,
    },
    levelType: 'normal',
    dots: [],
  },
  {
    id: 102,
    x: 0,
    y: 0,
    levelStatus: 'nextLevel',
    alreadyAnimated: true,
    missionDetails: {
      image: 'loadingBg.png',
      title: 'Skyloft',
      description: `A place of harmony and peace...`,
      rewardMin: 50,
      rewardMax: 100,
    },
    levelType: 'normal',
    dots: [],
  },
  {
    id: 103,
    x: 0,
    y: 0,
    levelStatus: 'nextLevel',
    alreadyAnimated: true,
    missionDetails: {
      image: 'loadingBg.png',
      title: 'Skyloft',
      description: `A place of harmony and peace...`,
      rewardMin: 50,
      rewardMax: 100,
    },
    levelType: 'normal',
    dots: [],
  },
  {
    id: 104,
    x: 0,
    y: 0,
    levelStatus: 'nextLevel',
    alreadyAnimated: true,
    missionDetails: {
      image: 'loadingBg.png',
      title: 'Skyloft',
      description: `A place of harmony and peace...`,
      rewardMin: 50,
      rewardMax: 100,
    },
    levelType: 'normal',
    dots: [],
  },
];

export const ChallengeLevels: LevelDto[] = [
  {
    ...Level,
    shuffleAbilityCards: false,
    shuffleAbilityCardsBot: false,
    shuffleCards: false,
    shuffleCardsBot: false,
    id: 101,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'loadingBg.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Bowser has to be here somewhere...',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: "Who's there!?!",
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: "He's seen us, we have no choice... Fight!!",
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: 'Nooooo!!!!',
            shownText: '',
            player: false,
          },
        ],
      },
    ],
  },
  {
    ...Level,
    shuffleAbilityCards: false,
    shuffleAbilityCardsBot: false,
    shuffleCards: false,
    shuffleCardsBot: false,
    id: 102,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'forest.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Bowser has to be here somewhere...',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: "Who's there!?!",
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: "He's seen us, we have no choice... Fight!!",
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: 'Nooooo!!!!',
            shownText: '',
            player: false,
          },
        ],
      },
      {
        id: 2,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'loadingBg.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: true,
        showNightEffect: true,
        showFireEffect: false,
        showAshesEffect: false,
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            text: 'Bwaaaaaahhhhgg!!!!',
            title: 'Bowser',
            color: '#E50000',
            shownText: '',
            player: false,
          },
        ],
      },
    ],
  },
  {
    ...Level,
    shuffleAbilityCards: false,
    shuffleAbilityCardsBot: false,
    shuffleCards: false,
    shuffleCardsBot: false,
    id: 103,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'forest.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Bowser has to be here somewhere...',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: "Who's there!?!",
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: "He's seen us, we have no choice... Fight!!",
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: 'Nooooo!!!!',
            shownText: '',
            player: false,
          },
        ],
      },
      {
        id: 2,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'loadingBg.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: true,
        showNightEffect: true,
        showFireEffect: false,
        showAshesEffect: false,
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            text: 'Bwaaaaaahhhhgg!!!!',
            title: 'Bowser',
            color: '#E50000',
            shownText: '',
            player: false,
          },
        ],
      },
    ],
  },
  {
    ...Level,
    shuffleAbilityCards: false,
    shuffleAbilityCardsBot: false,
    shuffleCards: false,
    shuffleCardsBot: false,
    id: 104,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'forest.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Bowser has to be here somewhere...',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: "Who's there!?!",
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'avatar.png',
            title: 'Link',
            color: '#4CE500',
            text: "He's seen us, we have no choice... Fight!!",
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            title: 'Bowser',
            color: '#E50000',
            text: 'Nooooo!!!!',
            shownText: '',
            player: false,
          },
        ],
      },
      {
        id: 2,
        enemyPlayers: [
          {
            id: 1,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'goomba.png',
            name: 'Goomba',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1,
        enemyCardTheme: 'default',
        background: 'loadingBg.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: true,
        showNightEffect: true,
        showFireEffect: false,
        showAshesEffect: false,
        dialogEnd: [
          {
            id: 1,
            image: 'avatar.png',
            text: 'Bwaaaaaahhhhgg!!!!',
            title: 'Bowser',
            color: '#E50000',
            shownText: '',
            player: false,
          },
        ],
      },
    ],
  },
];

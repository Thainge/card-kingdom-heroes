import { LevelDto } from 'src/app/models/level';
import { EnemyAbilityCardsSet1Zelda } from '../enemyAbilityCards/enemyAbilityCardsZelda';
import { ComicData } from '../comic/comic';
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

  combatPhases: [],
};

export const LevelsDataZelda: LevelDto[] = [
  {
    ...Level,
    id: 1,
    battleRewardXp: 50,
    comicData: ComicData[0],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
    id: 2,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 3,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 4,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 5,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 6,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 7,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 8,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 9,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 10,
    battleRewardXp: 50,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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
    id: 11,
    battleRewardXp: 50,
    comicData: ComicData[0],
    showComicEnd: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
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
            image: 'moblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 1,
            baseHealth: 1,
            level: 1,
          },
          {
            id: 2,
            image: 'moblin.png',
            name: 'Moblin',
            attack: 3,
            baseAttack: 3,
            health: 1,
            baseHealth: 1,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
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

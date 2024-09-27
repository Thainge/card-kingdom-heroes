import { LevelDto } from 'src/app/models/level';
import { EnemyAbilityCardsSet1Zelda } from '../enemyAbilityCards/enemyAbilityCardsZelda';
import { Cards } from '../cards';
import { ComicDataZelda } from '../comic/comicZelda';

const Level: LevelDto = {
  id: 1,
  skipRedrawPhase: false,
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
    skipRedrawPhase: true,
    battleRewardXp: 50,
    comicData: ComicDataZelda[0],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda0.png',
            name: 'Bokoblin',
            attack: 1,
            baseAttack: 1,
            health: 2,
            baseHealth: 2,
            level: 1,
          },
          {
            id: 1,
            image: 'zelda0.png',
            name: 'Bokoblin',
            attack: 1,
            baseAttack: 1,
            health: 2,
            baseHealth: 2,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaSkyloft.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: true,
        showNightEffect: true,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'What is going on! Skyloft is being overrun by monsters!',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'fi.png',
            title: 'Fi',
            color: '#0082be',
            text: 'Master link, help! Ghirahim has brought these bokoblins onto skylift using dark magic.',
            shownText: '',
            player: true,
          },
          {
            id: 3,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'What!!! Ghirahim is back? I thought we got rid of him... No matter, I will help you and then I will go after him.',
            shownText: '',
            player: true,
          },
          {
            id: 4,
            image: 'bokoblin.png',
            title: 'Bokoblin',
            color: '#E50000',
            text: '*BATTLE CRY',
            shownText: '',
            player: false,
          },
          {
            id: 5,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Stand back Fi, let a professional handle this!',
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [],
      },
    ],
  },
  {
    ...Level,
    id: 2,
    battleRewardXp: 50,
    comicData: ComicDataZelda[1],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda2.png',
            name: 'Deku Baba',
            attack: 3,
            baseAttack: 3,
            health: 5,
            baseHealth: 5,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaForest2.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [],
        dialogEnd: [],
      },
    ],
  },
  {
    ...Level,
    id: 3,
    battleRewardXp: 50,
    comicData: ComicDataZelda[2],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda1.png',
            name: 'Spume',
            attack: 2,
            baseAttack: 2,
            health: 2,
            baseHealth: 2,
            level: 1,
          },
          {
            id: 2,
            image: 'zelda1.png',
            name: 'Spume',
            attack: 2,
            baseAttack: 2,
            health: 2,
            baseHealth: 2,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaForest.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [],
        dialogEnd: [],
      },
    ],
  },
  {
    ...Level,
    id: 4,
    battleRewardXp: 100,
    comicData: ComicDataZelda[3],
    showComicEnd: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda3.png',
            name: 'Staldra',
            attack: 3,
            baseAttack: 3,
            health: 5,
            baseHealth: 5,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaForest.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: true,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [],
        dialogEnd: [],
      },
      {
        id: 2,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda4.png',
            name: 'Stalfos',
            attack: 2,
            baseAttack: 2,
            health: 3,
            baseHealth: 3,
            level: 1,
          },
          {
            id: 2,
            image: 'zelda9.png',
            name: 'Ghirahim',
            attack: 4,
            baseAttack: 4,
            health: 6,
            baseHealth: 6,
            level: 2,
          },
          {
            id: 3,
            image: 'zelda4.png',
            name: 'Stalfos',
            attack: 2,
            baseAttack: 2,
            health: 3,
            baseHealth: 3,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaForest.png',
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
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Come out Ghirahim! You must pay for what you did to skyloft!',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'Fool! You have little to no knowledge of what kind of power I have, leave while you have the chance!',
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: "He's trying to run, get him!",
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: "I've wasted enough time with you fools, I will take my leave.",
            shownText: '',
            player: false,
          },
          {
            id: 2,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'No! Stop him!',
            shownText: '',
            player: true,
          },
          {
            id: 3,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'To late, good luck boy, you will need it.',
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
    comicData: ComicDataZelda[4],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda6.png',
            name: 'Earth Guardian',
            attack: 5,
            baseAttack: 5,
            health: 8,
            baseHealth: 8,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaVolcano.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: true,
        dialogStart: [],
        dialogEnd: [],
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
            image: 'zelda7.png',
            name: 'Lizalfos',
            attack: 5,
            baseAttack: 5,
            health: 5,
            baseHealth: 5,
            level: 1,
          },
          {
            id: 2,
            image: 'zelda7.png',
            name: 'Lizalfos',
            attack: 5,
            baseAttack: 5,
            health: 5,
            baseHealth: 5,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaVolcano.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: true,
        showAshesEffect: true,
        dialogStart: [],
        dialogEnd: [],
      },
    ],
  },
  {
    ...Level,
    id: 7,
    battleRewardXp: 100,
    comicData: ComicDataZelda[8],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda10.png',
            name: 'Scaldera',
            attack: 6,
            baseAttack: 6,
            health: 10,
            baseHealth: 10,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaVolcano.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: true,
        showAshesEffect: true,
        dialogStart: [
          {
            id: 1,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'You have come a long way boy, but it will not be enough... I have greater plans than this in mind...',
            shownText: '',
            player: false,
          },
          {
            id: 2,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'You have become much more of a nuisance than I thought. You require greater care..',
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'I will leave you again... Deal with this!',
            shownText: '',
            player: false,
          },
        ],
        dialogEnd: [],
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
            image: 'zelda5.png',
            name: 'Bokoblin',
            attack: 5,
            baseAttack: 5,
            health: 3,
            baseHealth: 3,
            level: 1,
          },
          {
            id: 2,
            image: 'zelda6.png',
            name: 'Bokoblin',
            attack: 5,
            baseAttack: 5,
            health: 8,
            baseHealth: 8,
            level: 1,
          },
          {
            id: 3,
            image: 'zelda5.png',
            name: 'Bokoblin',
            attack: 5,
            baseAttack: 5,
            health: 3,
            baseHealth: 3,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaDesert.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: true,
        showCloudsEffect: true,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [],
        dialogEnd: [],
      },
    ],
  },
  {
    ...Level,
    id: 9,
    battleRewardXp: 100,
    comicData: ComicDataZelda[5],
    showComicStart: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda8.png',
            name: 'Armos',
            attack: 4,
            baseAttack: 4,
            health: 6,
            baseHealth: 6,
            level: 1,
          },
          {
            id: 2,
            image: 'zelda8.png',
            name: 'Armos',
            attack: 4,
            baseAttack: 4,
            health: 6,
            baseHealth: 6,
            level: 1,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaDesert.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: true,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: "Ghirahim ran inside, after him! We must stop whatever he's doing!",
            shownText: '',
            player: true,
          },
        ],
        dialogEnd: [],
      },
      {
        id: 2,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda11.png',
            name: 'Moldarach',
            attack: 6,
            baseAttack: 6,
            health: 12,
            baseHealth: 12,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaDesert.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: true,
        showCloudsEffect: false,
        showNightEffect: false,
        showFireEffect: false,
        showAshesEffect: false,
        dialogStart: [
          {
            id: 1,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'You have led yourself into a dead end Ghirahim!',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'Ughh, what a pain you are... Always in my way!',
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'ghirahim.png',
            title: 'Ghirahim',
            color: '#E50000',
            text: 'Rise beast, deal with this pest!',
            shownText: '',
            player: false,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'Ghirahim! Where did he go?',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'fi.png',
            title: 'Fi',
            color: '#0082be',
            text: 'Master link, I sense Ghirahim has traveled to the sealed grounds. I believe he has what he needs to awaken Demise.',
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'fi.png',
            title: 'Fi',
            color: '#0082be',
            text: 'We must stop him!',
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
    battleRewardXp: 100,
    comicData: ComicDataZelda[6],
    showComicStart: true,
    comicDataEndOnly: ComicDataZelda[7],
    showComicEndOnly: true,
    combatPhases: [
      {
        id: 1,
        enemyPlayers: [
          {
            id: 1,
            image: 'zelda13.png',
            name: 'Ghirahim',
            attack: 5,
            baseAttack: 5,
            health: 12,
            baseHealth: 12,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaFinal1.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: true,
        showFireEffect: false,
        showAshesEffect: true,
        dialogStart: [
          {
            id: 1,
            image: 'link.png',
            title: 'Link',
            color: '#4CE500',
            text: 'What happened here? What is going on..',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'ghirahim2.png',
            title: 'Demon Ghirahim',
            color: '#E50000',
            text: 'YOU THINK TO STOP ME FROM FINISHING MY TASK? TRY AS YOU MIGHT BOY, I WILL ALWAYS WIN.',
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'fi.png',
            title: 'Fi',
            color: '#0082be',
            text: 'Master link! You must defeat him before he completes his ritual!',
            shownText: '',
            player: false,
          },
        ],
        dialogEnd: [
          {
            id: 1,
            image: 'ghirahim2.png',
            title: 'Demon Ghirahim',
            color: '#4CE500',
            text: 'AGHHHHGH!!',
            shownText: '',
            player: true,
          },
          {
            id: 2,
            image: 'ghirahim2.png',
            title: 'Demon Ghirahim',
            color: '#E50000',
            text: 'IT IS TO LATE BOY. MY WORK IS FINISHED. YOU WILL NOT BE ABLE TO STOP US NOW!',
            shownText: '',
            player: false,
          },
          {
            id: 3,
            image: 'demise.png',
            title: 'Demise',
            color: '#E50000',
            text: '...',
            shownText: '',
            player: false,
          },
          {
            id: 4,
            image: 'demise.png',
            title: 'Demise',
            color: '#E50000',
            text: "MY SERVANT'S WORK IS COMPLETE. HIS USEFULNESS IS OVER.",
            shownText: '',
            player: false,
          },
          {
            id: 5,
            image: 'demise.png',
            title: 'Demise',
            color: '#E50000',
            text: 'YOU WILL GET OUT OF MY WAY BOY, OR I WILL DESTROY YOU LIKE I WILL DESTROY THIS LAND!',
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
            image: 'zelda12.png',
            name: 'Demise',
            attack: 7,
            baseAttack: 7,
            health: 18,
            baseHealth: 18,
            level: 2,
          },
        ],
        enemyAbilityCards: EnemyAbilityCardsSet1Zelda,
        enemyCardTheme: 'zelda',
        background: 'zeldaFinal2.png',
        showSnowEffect: false,
        showBubblesEffect: false,
        showLeavesEffect: false,
        showSunFlareEffect: false,
        showCloudsEffect: false,
        showNightEffect: true,
        showFireEffect: false,
        showAshesEffect: true,
        dialogStart: [],
        dialogEnd: [
          {
            id: 1,
            image: 'demise.png',
            title: 'Demise',
            color: '#E50000',
            text: 'CONGRATULATIONS MORTAL, YOU HAVE STOPPED MY REIGN OF THIS LAND. FOR NOW...',
            shownText: '',
            player: false,
          },
        ],
      },
    ],
  },
];
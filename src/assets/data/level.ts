import { LevelDto } from 'src/app/models/level';

export const passedObj: LevelDto = {
  id: 1,
  skipRedrawPhase: false,
  battleRewardXp: 61,
  playerLevelUpEnabled: true,
  hideDialog: false,
  allCardsWild: false,
  showGuide: false,
  showAbilityGuide: false,

  shuffleAbilityCards: true,
  shuffleCards: true,
  shuffleAbilityCardsBot: true,
  shuffleCardsBot: true,

  canDefendWithMultipleCards: true,
  alwaysWinTies: true,
  canSeeTopCard: false,
  canSeeTopCardAbilities: false,
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
      enemyAbilityCards: [
        {
          id: 1,
          abilityFunction: 'increaseDefense',
          targetAll: false,
          abilityValue: [1, 1, 1],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 2,
          abilityFunction: 'increaseDefense',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 3,
          abilityFunction: 'callInSupport',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [[], [], []],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
          alliesCalled: [
            [
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
            ],
            [
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
            ],
            [
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
            ],
          ],
        },
        {
          id: 4,
          abilityFunction: 'heal',
          targetAll: false,
          abilityValue: [2, 2, 2],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 5,
          abilityFunction: 'discard',
          targetAll: true,
          abilityValue: [2, 2, 2],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 6,
          abilityFunction: 'heal',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 7,
          abilityFunction: 'heal',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 8,
          abilityFunction: 'offense',
          targetAll: false,
          abilityValue: [1, 1, 1],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 9,
          abilityFunction: 'damage',
          targetAll: false,
          abilityValue: [1, 1, 1],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
      ],
      enemyCardTheme: 'mario',
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
      enemyAbilityCards: [
        {
          id: 1,
          abilityFunction: 'increaseDefense',
          targetAll: false,
          abilityValue: [1, 1, 1],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 2,
          abilityFunction: 'increaseDefense',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 3,
          abilityFunction: 'callInSupport',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [[], [], []],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
          alliesCalled: [
            [
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
            ],
            [
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
            ],
            [
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
              {
                id: 0,
                image: 'goomba.png',
                name: 'Goomba',
                attack: 1,
                baseAttack: 1,
                health: 3,
                baseHealth: 3,
                level: 1,
              },
            ],
          ],
        },
        {
          id: 4,
          abilityFunction: 'heal',
          targetAll: false,
          abilityValue: [2, 2, 2],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 5,
          abilityFunction: 'discard',
          targetAll: true,
          abilityValue: [2, 2, 2],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 6,
          abilityFunction: 'heal',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 7,
          abilityFunction: 'heal',
          targetAll: true,
          abilityValue: [1, 1, 1],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 8,
          abilityFunction: 'offense',
          targetAll: false,
          abilityValue: [1, 1, 1],
          cost: [['red'], ['red'], ['red']],
          name: 'Ganon',
          description: [
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
            'Apply -1 offense to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
        {
          id: 9,
          abilityFunction: 'damage',
          targetAll: false,
          abilityValue: [1, 1, 1],
          cost: [['diamonds'], ['diamonds'], ['diamonds']],
          name: 'Ganon',
          description: [
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
            'Deal 1 damage to target enemy',
          ],
          image: 'sliceAbility.png',
          level: 1,
          hitAnimation: 'fire',
        },
      ],
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
};

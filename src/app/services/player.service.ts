import { BehaviorSubject } from 'rxjs';
import { gameTheme } from './../models/theme';
import { Injectable, OnInit } from '@angular/core';
import { CardDto } from '../models/card';
import { CheatDto } from '../models/cheat';
import { PlayerDto } from '../models/player';
import { AbilityCard } from '../models/abilityCard';

@Injectable({
  providedIn: 'root',
})
export class playerService implements OnInit {
  readonly gameTheme$ = new BehaviorSubject<gameTheme>('default');
  readonly wildCard: CardDto = {
    id: 55,
    wild: true,
    wildRange: 14,
    wildSuit: true,
    wildSuits: [1, 1, 1, 1],
    suit: 'spades',
    value: '14',
    wildInitial: '14',
    image: '14_of_spades.png',
  };

  constructor() {
    this.gameTheme$.subscribe((x) => {
      this.updateThemeStyles(x);
    });
  }

  ngOnInit(): void {}

  public getPlayer(): PlayerDto {
    const playerSkills = {
      // Which cards are wild
      wildHearts: false,
      wildDiamonds: false,
      wildSpades: false,
      wildClubs: false,

      // What range can wild cards go
      rangeHearts: 0,
      rangeDiamonds: 0,
      rangeSpades: 0,
      rangeClubs: 0,

      // What suit options should appear
      showWildHearts: false,
      showWildDiamonds: false,
      showWildSpades: false,
      showWildClubs: false,

      // Extra damage for suites
      extraHeartsDamage: false,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,

      // Wild cards unlocked
      wildCardsCount: 4,

      // Extra health
      extraHealth: 0,

      // Extra attack
      extraAttack: 0,
    };
    return {
      id: 5,
      image: 'link.png',
      name: 'Link',
      attack: 2 + playerSkills.extraAttack,
      baseAttack: 2 + playerSkills.extraAttack,
      health: 5 + playerSkills.extraHealth,
      baseHealth: 9 + playerSkills.extraHealth,
      level: 1,
      xp: 10,
      xpLevels: [60, 90, 120],
      skills: playerSkills,
      isMaxLevel: false,
    };
  }

  public getAbilityCards(): AbilityCard[] {
    return [
      {
        id: 1,
        abilityFunction: 'leach',
        targetAll: false,
        abilityValue: 2,
        cost: ['hearts', 'hearts', 'hearts', 'hearts', 'hearts'],
        name: 'Ganon',
        description: 'Steal 2 health from target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 2,
        abilityFunction: 'leach',
        targetAll: true,
        abilityValue: 1,
        cost: ['hearts', 'hearts'],
        name: 'Ganon',
        description: 'Steal 1 health from all enemies',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 3,
        abilityFunction: 'offense',
        targetAll: true,
        abilityValue: 1,
        cost: ['black', 'black'],
        name: 'Ganon',
        description: 'Apply -1 offense to every enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 4,
        abilityFunction: 'offense',
        targetAll: false,
        abilityValue: 2,
        cost: ['red', 'black'],
        name: 'Ganon',
        description: 'Apply -2 offense to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 5,
        abilityFunction: 'damage',
        targetAll: true,
        abilityValue: 3,
        cost: ['diamonds', 'spades'],
        name: 'Ganon',
        description: 'Deal 3 damage to every enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 6,
        abilityFunction: 'damage',
        targetAll: false,
        abilityValue: 3,
        cost: ['spades', 'spades'],
        name: 'Ganon',
        description: 'Deal 3 damage to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 7,
        abilityFunction: 'heal',
        targetAll: false,
        abilityValue: 1,
        cost: ['hearts'],
        name: 'Ganon',
        description: 'Heal player for 1 health',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 8,
        abilityFunction: 'heal',
        targetAll: false,
        abilityValue: 3,
        cost: ['hearts', 'hearts'],
        name: 'Ganon',
        description: 'Heal player for 3 health',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 9,
        abilityFunction: 'draw',
        targetAll: false,
        abilityValue: 3,
        cost: ['red', 'red', 'red'],
        name: 'Ganon',
        description: 'Draw 3 cards',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 10,
        abilityFunction: 'redraw',
        targetAll: false,
        abilityValue: 5,
        cost: ['black', 'black'],
        name: 'Ganon',
        description: 'Redraw Entire Hand',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 11,
        abilityFunction: 'redrawAll',
        targetAll: false,
        abilityValue: 5,
        cost: ['red', 'red'],
        name: 'Ganon',
        description: 'Redraw Entire Hand',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 12,
        abilityFunction: 'wildSuit',
        targetAll: false,
        abilityValue: 1,
        cost: ['red'],
        name: 'Ganon',
        description: 'Wild Suit A Card In Hand',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 13,
        abilityFunction: 'wildRange',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Wild Range +1 For A Card In Hand',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 14,
        abilityFunction: 'wildSuitRange',
        targetAll: false,
        abilityValue: 14,
        cost: [],
        name: 'Ganon',
        description: 'Wild A Card In Hand',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 15,
        abilityFunction: 'increaseDefense',
        targetAll: false,
        abilityValue: 1,
        cost: ['red'],
        name: 'Ganon',
        description: 'Increase Defense by 1',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 16,
        abilityFunction: 'increaseDefense',
        targetAll: true,
        abilityValue: 2,
        cost: ['black'],
        name: 'Ganon',
        description: 'Increase Defense by 2',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
    ];
  }

  public getAbilityCardsBot(): AbilityCard[] {
    return [
      {
        id: 1,
        abilityFunction: 'increaseDefense',
        targetAll: false,
        abilityValue: 1,
        cost: ['red'],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 2,
        abilityFunction: 'increaseDefense',
        targetAll: true,
        abilityValue: 1,
        cost: ['diamonds'],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 3,
        abilityFunction: 'callInSupport',
        targetAll: true,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
        alliesCalled: [
          {
            id: 0,
            image: 'goblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 3,
            baseHealth: 3,
            level: 1,
          },
          {
            id: 0,
            image: 'goblin.png',
            name: 'Moblin',
            attack: 1,
            baseAttack: 1,
            health: 3,
            baseHealth: 3,
            level: 1,
          },
        ],
      },
      {
        id: 4,
        abilityFunction: 'heal',
        targetAll: false,
        abilityValue: 2,
        cost: ['red'],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 5,
        abilityFunction: 'discard',
        targetAll: true,
        abilityValue: 2,
        cost: ['diamonds'],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 6,
        abilityFunction: 'heal',
        targetAll: true,
        abilityValue: 1,
        cost: ['red'],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 7,
        abilityFunction: 'heal',
        targetAll: true,
        abilityValue: 1,
        cost: ['diamonds'],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 8,
        abilityFunction: 'offense',
        targetAll: false,
        abilityValue: 1,
        cost: ['red'],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 9,
        abilityFunction: 'damage',
        targetAll: false,
        abilityValue: 1,
        cost: ['diamonds'],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: 'sliceAbility.png',
        level: 1,
        hitAnimation: 'fire',
      },
    ];
  }

  public generateWildCard(cards: CardDto[]): CardDto {
    const newWildCard: CardDto = {
      ...this.wildCard,
      id: cards.length + 1,
    };
    return newWildCard;
  }

  public getPlayerCheats(): CheatDto {
    return {
      canDefendWithMultipleCards: true,
      alwaysWinTies: true,
      canSeeTopCard: true,
    };
  }

  private updateThemeStyles(gameTheme: gameTheme) {
    // Update cursor and font app wide
    document.body.classList.add(gameTheme + '-body');
  }
}

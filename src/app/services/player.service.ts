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
  // heartsWildCard: CardDto = {
  //   id: 53,
  //   wild: true,
  //   wildRange: 1,
  //   wildSuit: false,
  //   suit: 'hearts',
  //   value: '10',
  //   wildInitial: '10',
  //   image: '10_of_hearts.png',
  // };
  // spadesWildCard: CardDto = {
  //   id: 54,
  //   wild: true,
  //   wildRange: 2,
  //   wildSuit: true,
  //   suit: 'spades',
  //   value: '10',
  //   wildInitial: '10',
  //   image: '10_of_spades.png',
  // };
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

  public getPlayer(gameThemePath: gameTheme): PlayerDto {
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
      image: './assets/' + gameThemePath + '/' + 'link.png',
      name: 'Link',
      attack: 0 + playerSkills.extraAttack,
      health: 4 + playerSkills.extraHealth,
      baseHealth: 9 + playerSkills.extraHealth,
      baseAttack: 4 + playerSkills.extraAttack,
      level: 1,
      skills: playerSkills,
    };
  }

  public getAbilityCards(gameThemePath: string): AbilityCard[] {
    return [
      {
        id: 1,
        abilityFunction: 'leach',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Steal 1 health from target enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 2,
        abilityFunction: 'leach',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Steal 1 health from target enemies',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 3,
        abilityFunction: 'offense',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 4,
        abilityFunction: 'offense',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 5,
        abilityFunction: 'damage',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Deal 1 damage to every enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 6,
        abilityFunction: 'damage',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 7,
        abilityFunction: 'heal',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Heal player for 1 health',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 8,
        abilityFunction: 'heal',
        targetAll: false,
        abilityValue: 3,
        cost: [],
        name: 'Ganon',
        description: 'Heal player for 3 health',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 9,
        abilityFunction: 'wildSuit',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Wild Suit A Card In Hand',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 10,
        abilityFunction: 'wildRange',
        targetAll: false,
        abilityValue: 1,
        cost: [],
        name: 'Ganon',
        description: 'Wild Range +1 For A Card In Hand',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 11,
        abilityFunction: 'wildSuitRange',
        targetAll: false,
        abilityValue: 14,
        cost: [],
        name: 'Ganon',
        description: 'Wild A Card In Hand',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
    ];
  }

  public getAbilityCardsBot(gameThemePath: string): AbilityCard[] {
    return [
      {
        id: 1,
        abilityFunction: 'discard',
        targetAll: false,
        abilityValue: 1,
        cost: ['red'],
        name: 'Ganon',
        description: 'Apply -1 offense to target enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      {
        id: 2,
        abilityFunction: 'draw',
        targetAll: true,
        abilityValue: 1,
        cost: ['diamonds'],
        name: 'Ganon',
        description: 'Deal 1 damage to target enemy',
        image: './assets/' + gameThemePath + '/abilitycard.png',
        level: 1,
        hitAnimation: 'fire',
      },
      // {
      //   id: 1,
      //   abilityFunction: 'heal',
      //   targetAll: false,
      //   abilityValue: 1,
      //   cost: ['red'],
      //   name: 'Ganon',
      //   description: 'Apply -1 offense to target enemy',
      //   image: './assets/' + gameThemePath + '/abilitycard.png',
      //   level: 1,
      //   hitAnimation: 'fire',
      // },
      // {
      //   id: 2,
      //   abilityFunction: 'heal',
      //   targetAll: true,
      //   abilityValue: 1,
      //   cost: ['diamonds'],
      //   name: 'Ganon',
      //   description: 'Deal 1 damage to target enemy',
      //   image: './assets/' + gameThemePath + '/abilitycard.png',
      //   level: 1,
      //   hitAnimation: 'fire',
      // },
      // {
      //   id: 1,
      //   abilityFunction: 'offense',
      //   targetAll: false,
      //   abilityValue: 1,
      //   cost: ['red'],
      //   name: 'Ganon',
      //   description: 'Apply -1 offense to target enemy',
      //   image: './assets/' + gameThemePath + '/abilitycard.png',
      //   level: 1,
      //   hitAnimation: 'fire',
      // },
      // {
      //   id: 2,
      //   abilityFunction: 'damage',
      //   targetAll: false,
      //   abilityValue: 1,
      //   cost: ['diamonds'],
      //   name: 'Ganon',
      //   description: 'Deal 1 damage to target enemy',
      //   image: './assets/' + gameThemePath + '/abilitycard.png',
      //   level: 1,
      //   hitAnimation: 'fire',
      // },
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

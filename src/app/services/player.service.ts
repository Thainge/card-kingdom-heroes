import { BehaviorSubject } from 'rxjs';
import { gameTheme } from './../models/theme';
import { Injectable, OnInit } from '@angular/core';
import { CardDto } from '../models/card';
import { CheatDto } from '../models/cheat';
import { PlayerDto } from '../models/player';

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
    suit: 'clubs',
    value: '5',
    wildInitial: '5',
    image: '5_of_spades.png',
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
      wildHearts: true,
      wildDiamonds: true,
      wildSpades: false,
      wildClubs: false,

      // What range can wild cards go
      rangeHearts: 1,
      rangeDiamonds: 1,
      rangeSpades: 0,
      rangeClubs: 0,

      // What suit options should appear
      showWildHearts: true,
      showWildDiamonds: true,
      showWildSpades: false,
      showWildClubs: false,

      // Extra damage for suites
      extraHeartsDamage: true,
      extraDiamondsDamage: false,
      extraSpadesDamage: false,
      extraClubsDamage: false,

      // Wild cards unlocked
      wildCardsCount: 4,

      // Extra health
      extraHealth: 1,

      // Extra attack
      extraAttack: 1,
    };
    return {
      id: 5,
      image: './assets/' + gameThemePath + '/' + 'link.png',
      name: 'Link',
      attack: 6 + playerSkills.extraAttack,
      health: 9 + playerSkills.extraHealth,
      baseHealth: 9 + playerSkills.extraHealth,
      skills: playerSkills,
    };
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

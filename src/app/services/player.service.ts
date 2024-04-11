import { BehaviorSubject } from 'rxjs';
import { gameTheme } from './../models/theme';
import { Injectable, OnInit } from '@angular/core';
import { CardDto } from '../models/card';
import { CheatDto } from '../models/cheat';
import { PlayerDto } from '../models/player';
import { AbilityCard } from '../models/abilityCard';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class playerService implements OnInit {
  readonly gameTheme$ = new BehaviorSubject<gameTheme>('mario');
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

  readonly gold$ = new BehaviorSubject<number>(-9999);

  constructor(private router: Router) {
    this.gameTheme$.subscribe((x) => {
      this.updateThemeStyles(x);
    });
    const localGold = Number(localStorage.getItem('playerGold') ?? 0);
    this.gold$.next(localGold);
    this.gold$.next(9999);
    this.gold$.subscribe((x) => {
      if (x !== -9999) {
        localStorage.setItem('playerGold', JSON.stringify(x));
      }
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
      image: 'mario.png',
      name: 'Mario',
      attack: 2 + playerSkills.extraAttack,
      baseAttack: 2 + playerSkills.extraAttack,
      health: 5 + playerSkills.extraHealth,
      baseHealth: 5 + playerSkills.extraHealth,
      level: 1,
      xp: 10,
      xpLevels: [60, 90, 120],
      skills: playerSkills,
      isMaxLevel: false,
    };
  }

  public getAbilityCards(): AbilityCard[] {
    const localDeck = JSON.parse(
      localStorage.getItem('playerDeck') ?? '[]'
    ) as AbilityCard[];

    return localDeck;
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
      canSeeTopCardAbilities: false,
    };
  }

  private updateThemeStyles(gameTheme: gameTheme) {
    // Update cursor and font app wide
    document.body.classList.add(gameTheme + '-body');
  }
}

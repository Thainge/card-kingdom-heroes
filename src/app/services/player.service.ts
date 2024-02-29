import { BehaviorSubject } from 'rxjs';
import { gameTheme } from './../models/theme';
import { Injectable, OnInit } from '@angular/core';
import { CardDto } from '../models/card';
import { CheatDto } from '../models/cheat';

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

  public getPlayerWildCards(): CardDto[] {
    return [
      this.wildCard,
      { ...this.wildCard, id: 56 },
      { ...this.wildCard, id: 57 },
      { ...this.wildCard, id: 58 },
    ];
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

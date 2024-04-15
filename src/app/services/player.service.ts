import { BehaviorSubject } from 'rxjs';
import { gameTheme } from './../models/theme';
import { Injectable, OnInit } from '@angular/core';
import { CardDto } from '../models/card';
import { CheatDto } from '../models/cheat';
import { PlayerDto } from '../models/player';
import { AbilityCard } from '../models/abilityCard';
import { Router } from '@angular/router';
import { HeroData } from 'src/assets/data/hero';

const defaultPlayer: PlayerDto = {
  id: 0,
  health: 1,
  attack: 1,
  image: 'link.png',
  name: '',
  baseHealth: 1,
  baseAttack: 1,
  level: 1,
  color: 'green',
  disabled: false,
  points: 0,
  canDefendWithMultipleCards: false,
  alwaysWinTies: false,
  canSeeTopCard: false,
  canSeeTopCardAbilities: false,
  selected: true,
  unlocked: true,
  upgrades: [
    {
      cost: [0],
      description: [''],
      id: 0,
      image: '',
      level: 0,
      title: [''],
      type: [],
    },
  ],
  usedPoints: 0,
};

type Sound =
  | 'attack.mp3'
  | 'battleStart.mp3'
  | 'block.mp3'
  | 'button.mp3'
  | 'buyItem.mp3'
  | 'cardDestroyed.mp3'
  | 'cardFlip.mp3'
  | 'cardOpen.mp3'
  | 'close.mp3'
  | 'defeat.mp3'
  | 'fire.mp3'
  | 'freeze.mp3'
  | 'heal.mp3'
  | 'open.mp3'
  | 'start.wav'
  | 'victory.mp3';

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
  readonly currentHero$ = new BehaviorSubject<any | undefined>(undefined);
  readonly stars$ = new BehaviorSubject<number>(0);
  audioVolume: number = 0.5;
  musicVolume: number = 0.5;
  readonly audioVolume$ = new BehaviorSubject<number>(0.5);
  readonly musicVolume$ = new BehaviorSubject<number>(0.5);

  constructor(private router: Router) {
    this.gameTheme$.subscribe((x) => {
      this.updateThemeStyles(x);
    });
    const localGold = Number(localStorage.getItem('playerGold') ?? 0);
    this.gold$.next(localGold);
    this.gold$.subscribe((x) => {
      if (x !== -9999) {
        localStorage.setItem('playerGold', JSON.stringify(x));
      }
    });
    const localAudio = localStorage.getItem('audioVolume');
    const localMusic = localStorage.getItem('audioVolume');
    if (localAudio) {
      this.audioVolume$.next(Number(localAudio));
    }
    if (localMusic) {
      this.musicVolume$.next(Number(localMusic));
    }
    this.audioVolume$.subscribe((x) => {
      localStorage.setItem('audioVolume', JSON.stringify(x));
      this.audioVolume = x;
    });
    this.musicVolume$.subscribe((x) => {
      localStorage.setItem('audioVolume', JSON.stringify(x));
      this.musicVolume = x;
    });
  }

  ngOnInit(): void {}

  public playSound(sound: Sound) {
    let audio = new Audio();
    audio.src = './assets/sound/' + sound;
    audio.load();
    audio.play();
    audio.volume = this.audioVolume;
  }

  public getPlayer(): PlayerDto {
    let heroes: PlayerDto[] = JSON.parse(
      localStorage.getItem('heroData') ?? '[]'
    );
    if (heroes.length < 1) {
      localStorage.setItem('heroData', JSON.stringify(HeroData));
      heroes = HeroData;
    }
    return heroes.find((x) => x.selected) ?? defaultPlayer;
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

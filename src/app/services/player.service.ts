import { BehaviorSubject } from 'rxjs';
import { gameTheme } from './../models/theme';
import { Injectable, OnInit } from '@angular/core';
import { CardDto } from '../models/card';
import { CheatDto } from '../models/cheat';
import { PlayerDto } from '../models/player';
import { AbilityCard } from '../models/abilityCard';
import { Router } from '@angular/router';
import { HeroData } from 'src/assets/data/hero';
import { AchievementService } from './achievement.service';
import { LocalStorageService } from './localstorage.service';
import { Music } from '../models/music';
import { HeroSound, Sound } from '../models/sound';

const defaultPlayer: PlayerDto = {
  id: 0,
  health: 1,
  attack: 1,
  image: 'link.png',
  name: '',
  heroSelectSound: 'mario.mp3',
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

@Injectable({
  providedIn: 'root',
})
export class playerService {
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

  readonly gold$ = new BehaviorSubject<number>(-9999);
  readonly currentHero$ = new BehaviorSubject<any | undefined>(undefined);
  readonly stars$ = new BehaviorSubject<number>(0);
  readonly audioVolume$ = new BehaviorSubject<number>(20);
  readonly musicVolume$ = new BehaviorSubject<number>(20);
  readonly heroDataChanged$ = new BehaviorSubject<boolean>(true);
  readonly currentPlayingMusic$ = new BehaviorSubject<any | undefined>(
    undefined
  );
  private currentMusic: HTMLAudioElement | undefined;

  constructor(
    private router: Router,
    private achievementService: AchievementService,
    private localStorageService: LocalStorageService
  ) {
    this.gameTheme$.subscribe((x) => {
      this.updateThemeStyles(x);
    });
    const localGold = this.localStorageService.getPlayerGold();
    this.gold$.next(localGold);
    this.gold$.subscribe((x) => {
      if (x !== -9999) {
        this.localStorageService.setPlayerGold(x);
      }
      if (x >= 1000) {
        this.achievementService.unlockNewAchievement(3);
      }
    });
    const localAudio = localStorage.getItem('audioVolume');
    const localMusic = localStorage.getItem('musicVolume');
    if (localAudio) {
      this.audioVolume$.next(Number(localAudio));
    }
    if (localMusic) {
      this.musicVolume$.next(Number(localMusic));
    }
    this.audioVolume$.subscribe((x) => {
      localStorage.setItem('audioVolume', JSON.stringify(x));
    });
    this.musicVolume$.subscribe((x) => {
      localStorage.setItem('musicVolume', JSON.stringify(x));
      if (this.currentMusic) {
        this.currentMusic.volume = x / 100;
        this.currentPlayingMusic$.next(this.currentMusic);
      }
    });
    this.currentPlayingMusic$.subscribe((x) => {
      this.currentMusic = x;
    });
  }

  public stopCurrentAudio() {
    this.currentMusic?.pause();
  }

  public playHeroSound(sound: HeroSound) {
    try {
      let audio = new Audio();
      const localVolume = Number(localStorage.getItem('audioVolume'));
      audio.src = './assets/sound/' + sound;
      audio.volume = localVolume / 100;
      audio.load();
      audio.play();
    } catch (err) {}
  }

  public playSound(sound: Sound) {
    try {
      let audio = new Audio();
      const localVolume = Number(localStorage.getItem('audioVolume'));
      audio.src = './assets/sound/' + sound;
      audio.volume = localVolume / 100;
      audio.load();
      audio.play();
    } catch (err) {}
  }

  public playMusic(music: Music) {
    try {
      let audio = new Audio();
      this.currentMusic?.pause();
      const localVolume = Number(localStorage.getItem('musicVolume'));
      audio.src = './assets/sound/' + music;
      audio.volume = localVolume / 100;
      audio.load();
      audio.play();
      this.currentPlayingMusic$.next(audio);
    } catch (err) {}
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
    const localDeck = this.localStorageService.getPlayerDeck();
    return localDeck;
  }

  public generateWildCard(cards: CardDto[]): CardDto {
    const newWildCard: CardDto = {
      ...this.wildCard,
      id: cards.length + 1,
    };
    return newWildCard;
  }

  private updateThemeStyles(gameTheme: gameTheme) {
    // Update cursor and font app wide
    document.body.classList.add(gameTheme + '-body');
  }
}

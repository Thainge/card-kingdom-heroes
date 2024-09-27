import { playerService } from 'src/app/services/player.service';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AchievementService } from './services/achievement.service';
import { AchievementObject } from './models/achievement';
import {
  fadeOutUpOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
  fadeInDownOnEnterAnimation,
  fadeOutDownOnLeaveAnimation,
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { CheatsService } from './services/cheats.service';
import { LoadingService } from './services/loading.service';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from './services/localstorage.service';

type ClickObject = {
  id: number;
  x: number;
  y: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeInDownOnEnterAnimation({ anchor: 'fadeDownEnter' }),
    fadeOutDownOnLeaveAnimation({ anchor: 'fadeDownLeave' }),
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),
  ],
})
export class AppComponent implements OnInit {
  title = 'Card Kingdom Heroes';

  consoleShouldShow: boolean = false;
  consoleHasBeenOpened: boolean = false;
  consoleOpen: boolean = false;
  consoleControl = new FormControl('');
  consoleItems: string[] = ['', "Type 'help' for a list of commands"];

  achievementPopupsList: AchievementObject[] = [];
  clickAnimationsList: ClickObject[] = [];
  showGif: boolean = false;

  isLoading: boolean = false;
  initFinished: boolean = false;
  loadingBg: string = 'homeLoading.png';

  optionsMenuOpened: boolean = false;
  docElement: HTMLElement | undefined;
  isFullScreen: boolean = false;
  soundControl = new FormControl('75');
  musicControl = new FormControl('75');
  areYouSurePopup: boolean = false;
  loadingText: string = '';

  display: boolean = false;

  @ViewChild('consoleInput') consoleInput: ElementRef | undefined;

  constructor(
    private achievementService: AchievementService,
    private cheatsService: CheatsService,
    private loadingService: LoadingService,
    private playerService: playerService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (
      !localStorage.getItem('clearStorage') ||
      localStorage.getItem('clearStorage') === 'v2' ||
      localStorage.getItem('clearStorage') === 'v3'
    ) {
      localStorage.clear();
      localStorage.setItem('clearStorage', 'v4');
      location.reload();
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const gameTheme = this.localStorageService.setCampaignRoute();
        this.playerService.gameTheme$.next(gameTheme);
        const music = this.localStorageService.getMusic();
        this.playerService.playMusic(music);
      }
    });
    this.playerService.audioVolume$.subscribe((x) => {
      this.soundControl.setValue(x.toString());
    });
    this.playerService.musicVolume$.subscribe((x) => {
      this.musicControl.setValue(x.toString());
    });
    this.setInitialDeck();
    this.docElement = document.documentElement;
    this.loadingService.isLoading$.subscribe((x) => {
      if (x.loading === true && x.url !== 'null') {
        this.isLoading = true;
        this.loadingBg = x.image;
        this.loadingText = x.text;
        console.log(x.url);
        setTimeout(() => {
          if (this.isLoading) {
            this.isLoading = false;
            this.router.navigate([x.url]);
          }
        }, 1500);
      } else if (x.url !== 'null') {
        this.isLoading = false;
      }
      setTimeout(() => {
        this.initFinished = true;
      }, 1500);
    });
    // setTimeout(() => {
    //   const currentRoute = this.router.url;
    //   this.loadingService.navigate(
    //     currentRoute,
    //     'homeLoading.png',
    //     'Loading...'
    //   );
    // }, 1);
    setInterval(() => {
      try {
        this.clickAnimationsList = this.clickAnimationsList.slice(
          this.clickAnimationsList.length - 4
        );
      } catch (err) {}
    }, 1000 * 30);
    this.achievementService.achievements$.subscribe((x: AchievementObject) => {
      if (x.id !== 0) {
        this.achievementPopup(x);
      }
    });
    this.loadingService.displayOptions$.subscribe((x) => {
      this.display = x;
    });
  }

  setLocal() {
    this.playerService.musicVolume$.next(Number(this.musicControl.value));
    this.playerService.audioVolume$.next(Number(this.soundControl.value));
  }

  checkSure() {
    this.areYouSurePopup = false;
    this.playerService.playSound('button.mp3');
  }

  checkSureYes() {
    this.areYouSurePopup = true;
    this.playerService.playSound('button.mp3');
  }

  setInitialDeck() {
    this.localStorageService.getAbilityCards();
  }

  currentRouteIsNotHome(): boolean {
    return this.router.url.length > 3;
  }

  isBattle(): boolean {
    return this.router.url.includes('battle');
  }

  muteIconSound(): number {
    return Number(this.soundControl.value);
  }

  muteIconMusic(): number {
    return Number(this.musicControl.value);
  }

  toggleFullScreen() {
    this.playerService.playSound('button.mp3');
    if (this.docElement) {
      if (!this.isFullScreen) {
        this.docElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      this.isFullScreen = !this.isFullScreen;
    }
  }

  openDifficulty() {
    this.playerService.playSound('open.mp3');
    this.optionsMenuOpened = false;
    this.loadingService.difficultyIsOpen$.next(true);
  }

  resetProgress() {
    this.playerService.playSound('button.mp3');
    localStorage.clear();
    location.reload();
  }

  openConsole() {
    this.playerService.playSound('button.mp3');
    this.consoleShouldShow = true;
    this.consoleOpen = true;
  }

  refreshCombat() {
    this.playerService.playSound('button.mp3');
    this.loadingService.isRefreshing$.next(true);
    this.optionsMenuOpened = false;
  }

  surrenderCombat() {
    this.playerService.playSound('button.mp3');
    this.loadingService.isSurrendering$.next(true);
    this.optionsMenuOpened = false;
  }

  async clickAnimation(e: any) {
    const ID = this.clickAnimationsList.length + 1;
    const clickObject: ClickObject = {
      id: ID,
      x: e.clientX,
      y: e.clientY,
    };
    this.clickAnimationsList.push(clickObject);
  }

  achievementPopup(achievement: AchievementObject) {
    const ID = achievement.id;
    this.achievementPopupsList.push(achievement);
    this.showGif = true;
    setTimeout(() => {
      this.playerService.playSound('achievement.mp3');
    }, 1500);
    setTimeout(() => {
      this.showGif = false;
    }, 2800);
    setTimeout(() => {
      this.achievementPopupsList = this.achievementPopupsList.filter(
        (x) => x.id !== ID
      );
    }, 5000);
  }

  @HostListener('document:keypress', ['$event'])
  toggleConsoleKeypress(event: KeyboardEvent) {
    if (event.key.toLowerCase() === '`') {
      setTimeout(() => {
        this.consoleInput?.nativeElement.focus();
        this.consoleControl.setValue('');
      }, 50);
      this.consoleOpen = !this.consoleOpen;
      if (this.consoleOpen) {
        this.consoleShouldShow = this.consoleOpen;
      } else {
        setTimeout(() => {
          this.consoleShouldShow = this.consoleOpen;
        }, 500);
      }
      this.consoleHasBeenOpened = true;
    }
  }

  runCommand() {
    const newCommand = this.consoleControl.value?.toLowerCase() ?? '';
    this.consoleControl.setValue('');

    this.determineCommand(newCommand);
  }

  async determineCommand(value: string) {
    const secretCodeEntered = localStorage.getItem('secretCodeEntered');
    const secretCodeUnlocked = localStorage.getItem(
      'achievementTipShownFinish'
    );

    if (value.toLowerCase() === 'help') {
      await this.timeout(500);
      this.consoleItems.unshift('--- Commands List ---');

      if (secretCodeEntered) {
        this.consoleItems.unshift(
          'Gives player x amount of gold:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>setGold x</b>'
        );
        this.consoleItems.unshift(
          'All cards in hand turn wild:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>wildHand</b>'
        );
        this.consoleItems.unshift(
          "Sets the player's health to 99:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>infiniteHealth</b>"
        );
        this.consoleItems.unshift(
          "Sets the enemies's health to 1:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>defeatEnemy</b>"
        );
      }

      this.consoleItems.unshift(
        'Shows list of possible commands:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>help</b>'
      );
      this.consoleItems.unshift(
        'Clears the console:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b>clear</b>'
      );
      if (!secretCodeEntered) {
        this.consoleItems.unshift(
          `Unlocks Cheat Codes:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b>${
            secretCodeUnlocked
              ? 'iloveyou'
              : 'SECRET CODE (100% all achievements to view secret code)'
          }</b>`
        );
      }
      this.consoleItems.unshift('');
      return;
    }

    if (value.includes('clear')) {
      this.consoleItems = ['', "Type 'help' for a list of commands"];
      return;
    }

    if (value.includes('setgold') && secretCodeEntered) {
      const goldValue = Number(value.slice(8));
      if (goldValue && typeof goldValue === 'number') {
        this.playerService.gold$.next(goldValue);
      }
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      return;
    }

    if (value.includes('wildhand') && secretCodeEntered) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('wildHand');
      return;
    }

    if (value.includes('infinitehealth') && secretCodeEntered) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('infiniteHealth');
      return;
    }

    if (value.includes('defeatenemy') && secretCodeEntered) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('defeatEnemy');
      return;
    }

    if (value.includes('iloveyou')) {
      localStorage.setItem('secretCodeEntered', JSON.stringify(true));
      setTimeout(() => {
        this.consoleItems.unshift('Congratualations!');
      }, 100);
      setTimeout(() => {
        this.consoleItems.unshift('Cheats have now been unlocked');
      }, 300);
      setTimeout(() => {
        this.consoleItems.unshift(
          "Type 'help' to list out all possible cheat commands"
        );
        this.consoleItems.unshift('');
      }, 500);
    }

    this.consoleItems.unshift('');
  }

  toggleOptions() {
    this.optionsMenuOpened = !this.optionsMenuOpened;
    this.playerService.playSound('open.mp3');
  }

  closeMenu() {
    this.playerService.musicVolume$.next(Number(this.musicControl.value));
    this.playerService.audioVolume$.next(Number(this.soundControl.value));
    this.optionsMenuOpened = false;
    this.playerService.playSound('close.mp3');
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  closeConsole() {
    this.consoleHasBeenOpened = true;
    setTimeout(() => {
      this.consoleShouldShow = this.consoleOpen;
    }, 500);
    this.consoleOpen = false;
  }
}

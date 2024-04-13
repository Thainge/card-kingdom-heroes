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
import { Router } from '@angular/router';

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
  title = 'card-kingdom-heroes';

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
  loadingBg: string = 'loadingBg.png';

  optionsMenuOpened: boolean = false;
  docElement: HTMLElement | undefined;
  isFullScreen: boolean = false;
  soundControl = new FormControl('75');
  musicControl = new FormControl('75');
  areYouSurePopup: boolean = false;

  display!: boolean;

  @ViewChild('consoleInput') consoleInput: ElementRef | undefined;

  constructor(
    private achievementService: AchievementService,
    private cheatsService: CheatsService,
    private loadingService: LoadingService,
    private playerService: playerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.docElement = document.documentElement;
    this.loadingService.isLoading$.subscribe((x) => {
      if (x.loading === true && x.url !== 'null') {
        this.isLoading = true;
        this.loadingBg = x.image;

        setTimeout(() => {
          if (this.isLoading) {
            this.isLoading = false;
            this.router.navigate([x.url]);
          }
        }, 2500);
      } else if (x.url !== 'null') {
        this.isLoading = false;
      }
      setTimeout(() => {
        this.initFinished = true;
      }, 2500);
    });
    const currentRoute = this.router.url;
    // this.loadingService.navigate(currentRoute, 'forest.png');
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
    // this.achievementService.pushNewAchievement({
    //   id: 1,
    //   description: 'test description',
    //   image: 'gold.png',
    //   title: 'First Blood',
    //   unlocked: true,
    // });
    this.loadingService.displayOptions$.subscribe((x) => {
      // this.display = x;
    });
    this.display = true;
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
    this.optionsMenuOpened = false;
    this.loadingService.difficultyIsOpen$.next(true);
  }

  resetProgress() {
    localStorage.clear();
    location.reload();
  }

  openConsole() {
    this.consoleShouldShow = true;
    this.consoleOpen = true;
  }

  refreshCombat() {
    this.loadingService.isRefreshing$.next(true);
    this.optionsMenuOpened = false;
  }

  surrenderCombat() {
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
      this.showGif = false;
    }, 2800);
    // setTimeout(() => {
    //   this.achievementPopupsList = this.achievementPopupsList.filter(
    //     (x) => x.id !== ID
    //   );
    // }, 5000);
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
    if (value.toLowerCase() === 'help') {
      await this.timeout(500);
      this.consoleItems.unshift('--- Commands List ---');
      this.consoleItems.unshift(
        'Toggles the difficulty to easy or hard: &nbsp;<b>easyMode</b>'
      );
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
        'Shows list of possible commands:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>help</b>'
      );
      this.consoleItems.unshift(
        'Clears the console:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b>clear</b>'
      );
      this.consoleItems.unshift('');
      return;
    }

    if (value.includes('clear')) {
      this.consoleItems = ['', "Type 'help' for a list of commands"];
      return;
    }

    if (value.includes('setgold')) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      return;
    }

    if (value.includes('wildhand')) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('wildHand');
      return;
    }

    if (value.includes('infinitehealth')) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('infiniteHealth');
      return;
    }

    if (value.includes('easymode')) {
      const easyLocal = localStorage.getItem('easymode');
      let easyMode = false;
      if (easyLocal) {
        easyMode = JSON.parse(easyLocal);
      }

      localStorage.setItem('easymode', JSON.stringify(!easyMode));
      window.location.reload();
    }

    this.consoleItems.unshift('');
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

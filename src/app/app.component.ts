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

  @ViewChild('consoleInput') consoleInput: ElementRef | undefined;

  constructor(
    private achievementService: AchievementService,
    private cheatsService: CheatsService
  ) {}

  ngOnInit(): void {
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
    // });
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
    setTimeout(() => {
      this.achievementPopupsList = this.achievementPopupsList.filter(
        (x) => x.id !== ID
      );
      console.log(this.achievementPopupsList);
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
    if (value.toLowerCase() === 'help') {
      await this.timeout(500);
      this.consoleItems.unshift('--- Commands List ---');
      this.consoleItems.unshift(
        'Gives player x amount of gold: &nbsp;&nbsp;&nbsp;&nbsp;<b>setGold x</b>'
      );
      this.consoleItems.unshift(
        'All cards in hand turn wild: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>setWildHand</b>'
      );
      this.consoleItems.unshift(
        "Sets the player's health to 99: &nbsp;&nbsp;&nbsp;<b>infiniteHealth</b>"
      );
      this.consoleItems.unshift(
        'Shows list of possible commands: &nbsp; <b>help</b>'
      );
      this.consoleItems.unshift(
        'Clears the console: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b>clear</b>'
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

    if (value.includes('setwildhand')) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('setWildHand');
      return;
    }

    if (value.includes('infinitehealth')) {
      this.consoleItems.unshift(value);
      this.consoleItems.unshift('');
      this.cheatsService.cheats$.next('infiniteHealth');
      return;
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

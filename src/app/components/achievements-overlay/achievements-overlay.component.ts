import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { AchievementObject } from 'src/app/models/achievement';
import { AchievementService } from 'src/app/services/achievement.service';
import { LocalStorageVersion } from 'src/app/services/env';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-achievements-overlay',
  templateUrl: './achievements-overlay.component.html',
  styleUrls: ['./achievements-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class AchievementsOverlayComponent implements OnInit {
  open: boolean = false;
  currentWorld: number = 0;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    this.currentWorld = this.localStorageService.getCurrentAchievementPage();
    this.pageAchievements(this.currentpage);
    if (x) {
      this.checkTip();
    }
  }
  achievementsList: AchievementObject[] = [];
  achievementsListClean: AchievementObject[] = [];
  currentpage: number = 1;
  pageNumbers: number[] = [1];
  gold: number = 0;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);
  goldImage: string = './assets/gold.png';

  constructor(
    private playerService: playerService,
    private achievementService: AchievementService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.goldImage = this.localStorageService.getCurrentGoldImage();
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    this.achievementService.achievements$.subscribe((x) => {
      this.initAchievements();
    });
    this.achievementService.allAchievements$.subscribe((x) => {
      this.initAchievements();
    });
    this.initAchievements();
    this.currentpage = this.localStorageService.getCurrentAchievementPage();
    this.pageAchievements(this.currentpage);
  }

  initAchievements() {
    this.achievementsListClean = this.localStorageService.getAllAchievements();
  }

  checkTip() {
    const deckTipShown = localStorage.getItem(
      LocalStorageVersion + 'achievementTipShown'
    );
    if (!deckTipShown) {
      localStorage.setItem(
        LocalStorageVersion + 'achievementTipShown',
        JSON.stringify(true)
      );
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Achievements',
        text: 'Unlock additonal rewards by completing achievements',
        img: 'achievementImg.png',
        tipRows: [
          '- Unlock achievements to earn rewards',
          '- Unlock all achievements to unlock cheats',
        ],
      });
      this.loadingService.showTip$.next(true);
    }
  }

  checkTipFinish() {
    const allDone = this.achievementsListClean.filter((x) => x.unlocked);
    if (allDone.length !== this.achievementsListClean.length) {
      return;
    }

    const deckTipShown = localStorage.getItem(
      LocalStorageVersion + 'achievementTipShownFinish'
    );
    if (!deckTipShown) {
      localStorage.setItem(
        LocalStorageVersion + 'achievementTipShownFinish',
        JSON.stringify(true)
      );
      this.loadingService.currentTip$.next({
        title: 'New Unlock',
        header: 'Congratulations!',
        text: 'You have 100% complete every achievement in the game!',
        img: 'achievementImg.png',
        tipRows: [
          '- Cheats can now be unlocked',
          '- Type iloveyou in the console',
          '- Unlocks all cheat codes',
        ],
      });
      this.loadingService.showTip$.next(true);
    } else {
      this.loadingService.showTip$.next(false);
    }
  }

  getReward(achievement: AchievementObject) {
    if (
      achievement.worldId !==
      this.localStorageService.getCurrentAchievementPage()
    ) {
      return;
    }

    this.playerService.playSound('buyItem.mp3');
    this.achievementsListClean = this.achievementsListClean.map((x) => {
      if (x.id === achievement.id) {
        return { ...x, gemsUnlocked: true };
      }
      return x;
    });
    this.pageAchievements(this.currentpage);
    this.playerService.gold$.next(this.gold + achievement.reward);
    this.localStorageService.setAchievements(this.achievementsListClean);
    // this.achievementService.allAchievements$.next(this.achievementsListClean);
    setTimeout(() => {
      this.checkTipFinish();
    }, 1);
  }

  pageAchievements(number: number) {
    this.playerService.playSound('button.mp3');
    const currentPage = number * 10;
    this.currentpage = number;
    this.achievementsList = this.achievementsListClean.filter(
      (x, i) => i < currentPage && i > currentPage - 11
    );
  }

  closeMenu() {
    this.playerService.playSound('close.mp3');
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: AchievementObject) => item.id;
}

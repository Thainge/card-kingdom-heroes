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
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';
import { AchievementsData } from 'src/assets/data/achievements';

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
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    if (x) {
      this.checkTip();
    }
  }
  achievementsList: AchievementObject[] = [];
  achievementsListClean: AchievementObject[] = [];
  currentpage: number = 1;
  pageNumbers: number[] = [1, 2, 3];
  gold: number = 0;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(
    private playerService: playerService,
    private achievementService: AchievementService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    this.achievementsListClean = this.localStorageService.getAchievements();
    if (this.achievementsListClean.length < 1) {
      this.achievementsListClean = AchievementsData;
    }
    this.pageAchievements(this.currentpage);
  }

  checkTip() {
    const deckTipShown = localStorage.getItem('achievementTipShown');
    if (!deckTipShown) {
      localStorage.setItem('achievementTipShown', JSON.stringify(true));
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Achievements',
        text: 'Unlock additonal rewards by completing achievements',
        img: 'wildImg.png',
        tipRows: [
          '- Unlock achievements to earn rewards',
          '- Unlock all achievements to unlock cheats',
        ],
      });
      this.loadingService.showTip$.next(true);
    }
  }

  getReward(achievement: AchievementObject) {
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
    this.achievementService.allAchievements$.next(this.achievementsListClean);
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

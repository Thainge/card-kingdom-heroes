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
  @Input('open') open: boolean = false;
  achievementsList: AchievementObject[] = [];
  achievementsListClean: AchievementObject[] = [];
  currentpage: number = 1;
  pageNumbers: number[] = [1, 2, 3];
  gold: number = 0;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(
    private playerService: playerService,
    private achievementService: AchievementService
  ) {}

  ngOnInit() {
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    this.achievementsListClean = JSON.parse(
      localStorage.getItem('achievements') ?? '[]'
    );
    if (this.achievementsListClean.length < 1) {
      this.achievementsListClean = AchievementsData;
    }
    this.pageAchievements(this.currentpage);
  }

  getReward(achievement: AchievementObject) {
    this.achievementsListClean = this.achievementsListClean.map((x) => {
      if (x.id === achievement.id) {
        return { ...x, gemsUnlocked: true };
      }
      return x;
    });
    this.pageAchievements(this.currentpage);
    this.playerService.gold$.next(this.gold + achievement.reward);
    localStorage.setItem(
      'achievements',
      JSON.stringify(this.achievementsListClean)
    );
    this.achievementService.allAchievements$.next(this.achievementsListClean);
  }

  pageAchievements(number: number) {
    const currentPage = number * 10;
    this.currentpage = number;
    this.achievementsList = this.achievementsListClean.filter(
      (x, i) => i < currentPage && i > currentPage - 11
    );
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: AchievementObject) => item.id;
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { AchievementObject } from 'src/app/models/achievement';
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
  @Input('open') open: boolean = false;
  achievementsList: AchievementObject[] = [];
  achievementsListClean: AchievementObject[] = [];
  currentpage: number = 1;
  pageNumbers: number[] = [1, 2, 3];
  gold: number = 0;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private playerService: playerService) {}

  ngOnInit() {
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    this.achievementsListClean = [
      {
        id: 1,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 2,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 3,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 4,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 5,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 6,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 7,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 8,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 9,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 10,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 11,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 12,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 13,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 14,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 15,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 16,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 17,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 18,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 19,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 20,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
      {
        id: 21,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
        gemsUnlocked: false,
        reward: 150,
      },
    ];

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

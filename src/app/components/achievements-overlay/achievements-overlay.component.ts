import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { AchievementObject } from 'src/app/models/achievement';

@Component({
  selector: 'app-achievements-overlay-overlay',
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

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {
    this.achievementsListClean = [
      {
        id: 1,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
      },
      {
        id: 2,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
      },
      {
        id: 3,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
      },
      {
        id: 4,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
      },
      {
        id: 5,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: true,
      },
      {
        id: 6,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 7,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 8,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 9,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 10,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 11,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 12,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 13,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 14,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 15,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 16,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 17,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 18,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 19,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 20,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
      {
        id: 21,
        title: 'First Blood',
        description: 'Beat the first level in the game.',
        image: 'gold.png',
        unlocked: false,
      },
    ];

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
}

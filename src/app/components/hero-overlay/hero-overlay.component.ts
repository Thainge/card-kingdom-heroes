import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';

interface HeroUpgrade {
  id: number;
  level: HeroUpgradeLevel;
}

type HeroUpgradeLevel = 0 | 1 | 2 | 3;

interface Hero {
  id: number;
  upgrades: HeroUpgrade[];
}

@Component({
  selector: 'app-hero-overlay-overlay',
  templateUrl: './hero-overlay.component.html',
  styleUrls: ['./hero-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class HeroOverlayComponent implements OnInit {
  @Input('open') open: boolean = false;

  heroes: Hero[] = [];
  currentHero?: Hero;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {
    const upgrades: HeroUpgrade[] = [
      {
        id: 1,
        level: 0,
      },
      {
        id: 2,
        level: 0,
      },
      {
        id: 3,
        level: 0,
      },
      {
        id: 4,
        level: 0,
      },
      {
        id: 5,
        level: 0,
      },
    ];
    const newHero: Hero = { id: 1, upgrades: upgrades };
    this.heroes.push({ ...newHero, id: 1 });
    this.heroes.push({ ...newHero, id: 2 });
    this.heroes.push({ ...newHero, id: 3 });
    this.heroes.push({ ...newHero, id: 4 });
    this.heroes.push({ ...newHero, id: 5 });
    this.heroes.push({ ...newHero, id: 6 });
    this.heroes.push({ ...newHero, id: 7 });
    this.heroes.push({ ...newHero, id: 8 });
    this.currentHero = this.heroes[0];
  }

  trackById = (index: number, item: HeroUpgrade) => item.id;

  upgradeHero(item: HeroUpgrade) {
    if (this.currentHero && this.currentHero.upgrades) {
      this.currentHero.upgrades = this.currentHero.upgrades.map((x) => {
        if (item.id === x.id) {
          if (x.level === 0) {
            return { ...x, level: 1 };
          }
          if (x.level === 1) {
            return { ...x, level: 2 };
          }
          if (x.level === 2) {
            return { ...x, level: 3 };
          }
        }
        return x;
      });
    }
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

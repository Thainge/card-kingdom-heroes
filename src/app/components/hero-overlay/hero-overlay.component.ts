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
  image: string;
}

type HeroUpgradeLevel = 0 | 1 | 2 | 3;

interface Hero {
  id: number;
  points: number;
  usedPoints: number;
  selected: boolean;
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
        image: 'greenUpgrade1.png',
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
      },
    ];
    const newHero: Hero = {
      id: 1,
      upgrades: upgrades,
      points: 5,
      selected: false,
      usedPoints: 0,
    };
    this.heroes.push({ ...newHero, id: 1 });
    this.heroes.push({ ...newHero, id: 2 });
    this.heroes.push({ ...newHero, id: 3 });
    this.heroes.push({ ...newHero, id: 4 });
    this.heroes.push({ ...newHero, id: 5 });
    this.heroes.push({ ...newHero, id: 6 });
    this.heroes.push({ ...newHero, id: 7 });
    this.heroes.push({ ...newHero, id: 8 });
    this.heroes[0].selected = true;
    this.currentHero = this.heroes[0];
  }

  trackById = (index: number, item: HeroUpgrade) => item.id;

  selectHero() {
    if (!this.currentHero) {
      return;
    }

    this.heroes = this.heroes.map((x) => {
      return { ...x, selected: false };
    });

    this.currentHero.selected = true;
  }

  upgradeHero(item: HeroUpgrade) {
    if (
      this.currentHero &&
      this.currentHero.upgrades &&
      this.currentHero.points > 0
    ) {
      this.currentHero.upgrades = this.currentHero.upgrades.map((x) => {
        if (item.id === x.id) {
          if (x.level === 0) {
            this.subtractUpgradePoints();
            return { ...x, level: 1 };
          }
          if (x.level === 1) {
            this.subtractUpgradePoints();
            return { ...x, level: 2 };
          }
          if (x.level === 2) {
            this.subtractUpgradePoints();
            return { ...x, level: 3 };
          }
        }
        return x;
      });
    }
  }

  resetUpgrades() {
    if (this.currentHero && this.currentHero.upgrades) {
      this.currentHero.upgrades = this.currentHero.upgrades.map((x) => {
        return { ...x, level: 0 };
      });
      this.currentHero.points =
        this.currentHero.points + this.currentHero.usedPoints;
      this.currentHero.usedPoints = 0;
    }
  }

  subtractUpgradePoints() {
    if (this.currentHero) {
      this.currentHero.points = this.currentHero.points - 1;
      this.currentHero.usedPoints++;
    }
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

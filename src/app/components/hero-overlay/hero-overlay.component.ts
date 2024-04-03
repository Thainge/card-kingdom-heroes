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
  title: string[];
  description: string[];
  cost: number[];
}

type HeroUpgradeLevel = 0 | 1 | 2 | 3;

interface Hero {
  id: number;
  level: number;
  points: number;
  health: number;
  defense: number;
  usedPoints: number;
  selected: boolean;
  unlocked: boolean;
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
  currentHero: Hero | undefined;
  currentHoveringUpgrade: HeroUpgrade | undefined;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {
    const upgrades: HeroUpgrade[] = [
      {
        id: 1,
        level: 0,
        image: 'greenUpgrade1.png',
        cost: [1, 2, 3],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 2,
        level: 0,
        image: 'greenUpgrade2.png',
        cost: [1, 2, 3],
        title: ['Life Crystal +1', 'Life Crystal +2', 'Life Crystal +3'],
        description: [
          'Increases health by 1',
          'Increases health by 2',
          'Increases health by 3',
        ],
      },
      {
        id: 3,
        level: 0,
        image: 'greenUpgrade3.png',
        cost: [1, 1, 1],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 4,
        level: 0,
        image: 'greenUpgrade4.png',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
      {
        id: 5,
        level: 0,
        image: 'greenUpgrade5.png',
        cost: [2, 4, 6],
        title: ['Hylian Shield +1', 'Hylian Shield +2', 'Hylian Shield +3'],
        description: [
          'Increases defense by 1',
          'Increases defense by 2',
          'Increases defense by 3',
        ],
      },
    ];
    const newHero: Hero = {
      id: 1,
      level: 1,
      health: 3,
      defense: 1,
      upgrades: upgrades,
      points: 5,
      selected: false,
      unlocked: false,
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
    this.heroes[0].unlocked = true;
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
            const canLevelUp = this.subtractUpgradePoints(item);
            return canLevelUp ? { ...x, level: 1 } : x;
          }
          if (x.level === 1) {
            const canLevelUp = this.subtractUpgradePoints(item);
            return canLevelUp ? { ...x, level: 2 } : x;
          }
          if (x.level === 2) {
            const canLevelUp = this.subtractUpgradePoints(item);
            return canLevelUp ? { ...x, level: 3 } : x;
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

  subtractUpgradePoints(item: HeroUpgrade): boolean {
    if (!this.currentHero) {
      return false;
    }
    const newPoints = this.currentHero.points - item.cost[item.level];

    if (newPoints >= 0) {
      this.currentHero.points = newPoints;
      this.currentHero.usedPoints += item.cost[item.level];
      return true;
    }
    return false;
  }

  isCurrentlyHovering(item: HeroUpgrade) {
    if (
      this.currentHoveringUpgrade &&
      this.currentHoveringUpgrade.id === item.id
    ) {
      return true;
    }

    return false;
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

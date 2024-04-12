import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { HeroUpgrade, PlayerDto } from 'src/app/models/player';
import { LoadingService } from 'src/app/services/loading.service';
import { playerService } from 'src/app/services/player.service';
import { HeroData } from 'src/assets/data/heroData/hero';

@Component({
  selector: 'app-hero-overlay',
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
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    if (x) {
      this.checkTip();
    }
  }

  heroes: PlayerDto[] = [];
  currentHero: PlayerDto | undefined;
  currentHoveringUpgrade: HeroUpgrade | undefined;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private playerService: playerService
  ) {}

  ngOnInit() {
    this.heroes = JSON.parse(localStorage.getItem('heroData') ?? '[]');
    if (this.heroes.length < 1) {
      this.heroes = HeroData;
      localStorage.setItem('heroData', JSON.stringify(this.heroes));
      this.playerService.currentHero$.next(this.heroes.find((x) => x.selected));
    }

    if (!this.heroes.find((x) => x.selected)) {
      this.heroes[0].disabled = false;
      this.heroes[0].selected = true;
      this.heroes[0].unlocked = true;
      this.currentHero = this.heroes[0];
      this.heroes[1].disabled = false;
      this.heroes[1].unlocked = true;
    }

    // if (this.router.url.includes('cardkingdom-map')) {
    //   this.heroes[0].disabled = false;
    //   this.heroes[0].selected = true;
    //   this.heroes[0].unlocked = true;
    //   this.currentHero = this.heroes[0];
    //   this.heroes[1].disabled = false;
    //   this.heroes[1].unlocked = true;
    // }

    // if (this.router.url.includes('zelda-map')) {
    //   this.heroes[2].disabled = false;
    //   this.heroes[2].selected = true;
    //   this.heroes[2].unlocked = true;
    //   this.currentHero = this.heroes[2];
    //   this.heroes[3].disabled = false;
    //   this.heroes[3].unlocked = true;
    // }

    this.currentHero = this.heroes.find((x) => x.selected);
    localStorage.setItem('heroData', JSON.stringify(this.heroes));
    this.playerService.currentHero$.next(this.heroes.find((x) => x.selected));
  }

  trackById = (index: number, item: HeroUpgrade) => item.id;

  checkTip() {
    const heroTipShown = localStorage.getItem('heroTipShown');
    if (!heroTipShown) {
      localStorage.setItem('heroTipShown', JSON.stringify(true));
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Hero Room',
        text: 'Upgrade and change active hero',
        img: 'wildImg.png',
        tipRows: ['- Upgrade heroes', '- Change heroes'],
      });
      this.loadingService.showTip$.next(true);
    }
  }

  selectHero() {
    if (!this.currentHero || !this.currentHero.unlocked) {
      return;
    }

    this.heroes = this.heroes.map((x) => {
      if (x.id === this.currentHero?.id) {
        return { ...x, selected: true };
      }
      return { ...x, selected: false };
    });

    this.currentHero.selected = true;
    localStorage.setItem('heroData', JSON.stringify(this.heroes));
    this.playerService.currentHero$.next(this.heroes.find((x) => x.selected));
  }

  upgradeHero(item: HeroUpgrade) {
    if (!this.currentHero?.unlocked) {
      return;
    }

    if (
      this.currentHero &&
      this.currentHero.upgrades &&
      this.currentHero.points &&
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
      localStorage.setItem('heroData', JSON.stringify(this.heroes));
      this.playerService.currentHero$.next(this.heroes.find((x) => x.selected));
    }
  }

  resetUpgrades() {
    if (
      this.currentHero &&
      this.currentHero.upgrades &&
      this.currentHero.points &&
      this.currentHero.usedPoints
    ) {
      this.currentHero.upgrades = this.currentHero.upgrades.map((x) => {
        return { ...x, level: 0 };
      });
      this.currentHero.points =
        this.currentHero.points + this.currentHero.usedPoints;
      this.currentHero.usedPoints = 0;
      localStorage.setItem('heroData', JSON.stringify(this.heroes));
      this.playerService.currentHero$.next(this.heroes.find((x) => x.selected));
    }
  }

  subtractUpgradePoints(item: HeroUpgrade): boolean {
    if (
      !this.currentHero ||
      !this.currentHero.points ||
      !this.currentHero.usedPoints
    ) {
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

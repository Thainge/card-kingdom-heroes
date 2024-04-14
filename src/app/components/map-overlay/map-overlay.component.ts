import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
  fadeInDownOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutDownOnLeaveAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
import { AchievementsOverlayComponent } from '../achievements-overlay/achievements-overlay.component';
import { ShopOverlayComponent } from '../shop-overlay/shop-overlay.component';
import { HeroOverlayComponent } from '../hero-overlay/hero-overlay.component';
import { DeckOverlayComponent } from '../deck-overlay/deck-overlay.component';
import { GalleryOverlayComponent } from '../gallery-overlay/gallery-overlay.component';
import { LoadingService } from 'src/app/services/loading.service';
import { DifficultyOverlayComponent } from '../choose-difficulty-overlay/choose-difficulty-overlay.component';
import { CampaignOverlayComponent } from '../campaign-overlay/campaign-overlay.component';
import { PremiumOverlayComponent } from '../premium-overlay/premium-overlay.component';
import { WheelOverlayComponent } from '../wheel-overlay/wheel-overlay.component';
import { ActivatedRoute, Router } from '@angular/router';
import { playerService } from 'src/app/services/player.service';
import { BoosterPack } from 'src/app/models/boosterPack';
import { AchievementService } from 'src/app/services/achievement.service';
import { AchievementObject } from 'src/app/models/achievement';
import { LevelDto } from 'src/app/models/level';
import { FlagDto } from 'src/app/models/flag';
import { AbilityCard } from 'src/app/models/abilityCard';

interface Tip {
  title: string;
  header: string;
  text: string;
  img: string;
  tipRows: string[];
}

type Theme = 'cardkingdom' | 'zelda';

@Component({
  selector: 'app-map-overlay',
  templateUrl: './map-overlay.component.html',
  styleUrls: ['./map-overlay.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AchievementsOverlayComponent,
    ShopOverlayComponent,
    HeroOverlayComponent,
    DeckOverlayComponent,
    GalleryOverlayComponent,
    DifficultyOverlayComponent,
    CampaignOverlayComponent,
    PremiumOverlayComponent,
    WheelOverlayComponent,
  ],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),

    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),

    fadeInDownOnEnterAnimation({ anchor: 'fadeDownEnter' }),
    fadeOutDownOnLeaveAnimation({ anchor: 'fadeDownLeave' }),
  ],
})
export class MapOverlayComponent implements OnInit {
  achievementsOpen: boolean = false;
  shopOpen: boolean = false;
  heroRoomOpen: boolean = false;
  deckOpen: boolean = false;
  galleryOpen: boolean = false;
  chooseDifficultyOpen: boolean = false;
  chooseCampaignOpen: boolean = false;
  premiumOpen: boolean = false;
  wheelOpen: boolean = false;
  currentTheme: Theme = 'cardkingdom';

  showInformation: boolean = false;
  display: boolean = false;

  showWildHintOverlay: boolean = false;
  currentTip: Tip = {
    title: 'New Tip',
    header: 'Wild Cards',
    text: 'Wild cards can be any value or suite',
    img: 'wildImg.png',
    tipRows: [
      '- Use mousewheel to change value',
      '- Click the suite icons to change suite',
    ],
  };
  gold: number = 0;
  stars: number = 0;
  boosterPacks: BoosterPack[] = [];
  currentHero: any | undefined;
  achievements: AchievementObject[] = [];
  flagsList: FlagDto[] = [];
  completedFlagsList: FlagDto[] = [];
  showDeckIcon: boolean = false;
  deckInterval: any;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private playerService: playerService,
    private achievementService: AchievementService
  ) {}

  ngOnInit() {
    this.flagsList =
      JSON.parse(localStorage.getItem('flagsData') ?? '[]') ?? [];
    this.completedFlagsList = this.flagsList.filter(
      (x) => x.levelStatus === 'finished' || x.levelStatus === 'justFinished'
    );
    this.achievementService.allAchievements$.subscribe((x) => {
      this.achievements = x;
    });
    this.playerService.currentHero$.subscribe((x) => {
      this.currentHero = x;
    });
    setInterval(() => {
      this.boosterPacks = JSON.parse(
        localStorage.getItem('boosterPacks') ?? '[]'
      );
    }, 1000);
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    this.playerService.stars$.subscribe((x) => {
      this.stars = x;
    });
    this.loadingService.displayOptions$.subscribe((x) => {
      this.display = x;
    });
    if (
      !this.completedFlagsList.find((x) => x.levelStatus === 'justFinished')
    ) {
      this.loadingService.displayOptions$.next(true);
      setTimeout(() => {
        this.loadingService.displayOptions$.next(true);
      }, 50);
    }
    this.loadingService.showWheel$.subscribe((x) => {
      this.wheelOpen = x;
    });
    this.loadingService.currentTip$.subscribe((x) => {
      this.currentTip = x;
    });
    this.loadingService.showTip$.subscribe((x) => {
      this.showWildHintOverlay = x;
    });
    this.loadingService.difficultyIsOpen$.subscribe((x) => {
      this.chooseDifficultyOpen = x;
      this.showInformation = false;
    });
    this.checkTip();
    this.setTheme();
    this.checkDeck();
    this.deckInterval = setInterval(() => {
      this.checkDeck();
    }, 1000);
  }

  checkDeck() {
    const cards: AbilityCard[] = JSON.parse(
      localStorage.getItem('abilityCards') ?? '[]'
    );
    const includesNew = cards.find((x) => x.isNew === true);
    if (includesNew) {
      this.showDeckIcon = true;
    } else {
      this.showDeckIcon = false;
    }
  }

  ngOnDestroy() {
    if (this.deckInterval) {
      clearInterval(this.deckInterval);
    }
  }

  achievementHasGems(): boolean {
    if (this.achievements.find((x) => x.unlocked && !x.gemsUnlocked)) {
      return true;
    }

    return false;
  }

  boostersIncludeUnopened(): boolean {
    let found = false;
    this.boosterPacks.forEach((x) => {
      if (x.cost <= this.gold) {
        found = true;
      }
    });
    return true;
  }

  setTheme() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('zelda-map')) {
      this.currentTheme = 'zelda';
    }
    if (currentRoute.includes('cardkingdom-map')) {
      this.currentTheme = 'cardkingdom';
    }
  }

  checkTip() {
    const mapTipShown = localStorage.getItem('mapTipShown');
    if (!mapTipShown) {
      localStorage.setItem('mapTipShown', JSON.stringify(true));
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Map',
        text: 'Select missions to progress campaign',
        img: 'wildImg.png',
        tipRows: ['- Select flags to start missions'],
      });
      this.loadingService.showTip$.next(true);
    }
  }
}

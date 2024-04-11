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
  display: boolean = true;

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

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private playerService: playerService
  ) {}

  ngOnInit() {
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    this.loadingService.displayOptions$.subscribe((x) => {
      // this.display = x;
    });
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

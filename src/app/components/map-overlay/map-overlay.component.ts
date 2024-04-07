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
  chooseCampaignOpen: boolean = true;

  display: boolean = true;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.displayOptions$.subscribe((x) => {
      // this.display = x;
    });
  }
}

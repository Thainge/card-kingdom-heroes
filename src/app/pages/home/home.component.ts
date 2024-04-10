import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  zoomInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { CampaignOverlayComponent } from 'src/app/components/campaign-overlay/campaign-overlay.component';
import { DifficultyOverlayComponent } from 'src/app/components/choose-difficulty-overlay/choose-difficulty-overlay.component';
import { CreditsOverlayComponent } from 'src/app/components/credits-overlay/credits-overlay.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DifficultyOverlayComponent,
    CampaignOverlayComponent,
    CreditsOverlayComponent,
  ],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class HomeComponent implements OnInit {
  creditsOpen: boolean = false;
  chooseDifficultyOpen: boolean = false;
  chooseCampaignOpen: boolean = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {}

  startGame() {
    this.chooseCampaignOpen = true;
  }

  chooseDifficulty() {
    this.chooseCampaignOpen = false;
    this.chooseDifficultyOpen = true;
  }

  endSelection() {
    this.chooseDifficultyOpen = false;
    this.loadingService.navigate('/', 'loadingBg.png');
  }
}

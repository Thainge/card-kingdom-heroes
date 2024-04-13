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
import { MapOverlayComponent } from 'src/app/components/map-overlay/map-overlay.component';
import { FlagDto } from 'src/app/models/flag';
import { LoadingService } from 'src/app/services/loading.service';
import { flagsData } from 'src/assets/data/flags';
import { LevelsData } from 'src/assets/data/level';

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
    MapOverlayComponent,
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
  flagsList: FlagDto[] = [];

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.flagsList = JSON.parse(localStorage.getItem('flagsData') ?? '[]');
    if (this.flagsList.length < 1) {
      localStorage.setItem('flagsData', JSON.stringify(flagsData));
    }
  }

  startGame() {
    if (
      this.flagsList &&
      this.flagsList.length > 0 &&
      (this.flagsList[0].levelStatus === 'finished' ||
        this.flagsList[0].levelStatus === 'justFinished')
    ) {
      this.loadingService.navigate(
        '/cardkingdom-map',
        'loadingBg.png',
        'Loading...'
      );
    } else {
      this.chooseCampaignOpen = true;
    }
  }

  chooseDifficulty() {
    this.chooseCampaignOpen = false;
    this.chooseDifficultyOpen = true;
  }

  endSelection() {
    this.chooseDifficultyOpen = false;
    const flag = flagsData[0];
    const battle = LevelsData[0];
    localStorage.setItem('currentLevel', JSON.stringify(battle));
    localStorage.setItem('currentDetails', JSON.stringify(flag.missionDetails));
    this.loadingService.navigate('/battle', 'loadingBg.png', 'Loading...');
  }
}

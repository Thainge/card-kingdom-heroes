import { playerService } from 'src/app/services/player.service';
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
import { LocalStorageService } from 'src/app/services/localstorage.service';

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

  constructor(
    private loadingService: LoadingService,
    private playerService: playerService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.localStorageService.getStarsData();
  }

  startGame() {
    if (
      this.flagsList &&
      this.flagsList.length > 0 &&
      (this.flagsList[0].levelStatus === 'finished' ||
        this.flagsList[0].levelStatus === 'justFinished')
    ) {
      this.loadingService.navigate(
        '/' + this.localStorageService.currentRoute(),
        'loadingBg.png',
        'Loading...'
      );
      this.playerService.playSound('start.wav');
    } else {
      this.playerService.playSound('open.mp3');
      this.chooseCampaignOpen = true;
    }
  }

  openCredits() {
    this.playerService.playSound('open.mp3');
    this.creditsOpen = true;
  }

  chooseDifficulty() {
    this.chooseCampaignOpen = false;
    this.chooseDifficultyOpen = true;
  }

  endSelection() {
    this.chooseDifficultyOpen = false;
    const flag = this.localStorageService.getFlagsData()[0];
    const battle = this.localStorageService.getLevelsData()[0];
    this.localStorageService.setCurrentBattle(battle);
    this.localStorageService.setCurrentDetails(flag.missionDetails);
    this.loadingService.navigate('/battle', 'loadingBg.png', 'Loading...');
    this.playerService.playSound('start.wav');
  }
}

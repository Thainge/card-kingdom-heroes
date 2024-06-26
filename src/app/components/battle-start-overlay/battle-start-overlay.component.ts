import { playerService } from 'src/app/services/player.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { FlagDto } from 'src/app/models/flag';
import { BackgroundDto } from 'src/app/models/backgrounds';
import { LocalStorageService } from 'src/app/services/localstorage.service';

interface MissionDetails {
  image: BackgroundDto;
  title: string;
  description: string;
  rewardMin: number;
  rewardMax: number;
}

@Component({
  selector: 'app-battle-start-overlay',
  templateUrl: './battle-start-overlay.component.html',
  styleUrls: ['./battle-start-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class BattleStartOverlayComponent implements OnInit {
  @Input('open') open: boolean = false;
  @Input('isSpecialBattle') isSpecialBattle: boolean = false;
  @Input('currentLevel') currentLevel: any | undefined;
  @Input('missionDetails') missionDetails: any | undefined;
  @Input('finished') finished: boolean = false;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);
  goldImage: string = './assets/gold.png';

  constructor(
    private loadingService: LoadingService,
    private playerService: playerService,
    private localStorageService: LocalStorageService
  ) {}

  startBattle() {
    this.playerService.playSound('battleStart.mp3');
    this.localStorageService.setCurrentBattle(this.currentLevel);
    this.localStorageService.setCurrentDetails(this.missionDetails);
    if (this.missionDetails?.image) {
      this.loadingService.navigate(
        '/battle',
        this.missionDetails.image,
        this.missionDetails.title
      );
    } else {
      this.loadingService.navigate('/battle', 'loadingBg.png', 'Loading...');
    }
  }

  ngOnInit() {
    this.goldImage = this.localStorageService.getCurrentGoldImage();
  }

  closeMenu() {
    this.playerService.playSound('close.mp3');
    this.onCloseMenu.emit(false);
  }
}

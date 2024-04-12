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

interface MissionDetails {
  image: string;
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
  @Input('missionDetails') missionDetails: MissionDetails | undefined;
  @Input('finished') finished: boolean = false;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private loadingService: LoadingService) {}

  startBattle() {
    localStorage.setItem('currentLevel', JSON.stringify(this.currentLevel));
    localStorage.setItem('currentDetails', JSON.stringify(this.missionDetails));
    this.loadingService.navigate('/battle', 'forest.png');
  }

  ngOnInit() {}

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

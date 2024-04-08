import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';

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

  missionDetails: MissionDetails = {
    image: 'forest.png',
    title: 'Skyloft',
    description: `General, a band of gnolls approaches! They are beasts who only
    think about looting and burning everything their wake, but they
    will be sorry they ever left their arid hills... For the queen!`,
    rewardMin: 100,
    rewardMax: 150,
  };

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {}

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

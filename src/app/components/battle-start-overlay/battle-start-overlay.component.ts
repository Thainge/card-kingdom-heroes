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
}

@Component({
  selector: 'app-battle-start-overlay-overlay',
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
  };

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {}

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

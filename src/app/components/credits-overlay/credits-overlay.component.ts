import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { playerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-credits-overlay',
  templateUrl: './credits-overlay.component.html',
  styleUrls: ['./credits-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    fadeInOnEnterAnimation({ anchor: 'fadeUpEnter' }),
  ],
})
export class CreditsOverlayComponent implements OnInit {
  @Input('open') open: boolean = false;
  credits: string[] = [
    'Tobey - Lead Developer',
    'Elizabeth - Art',
    'Alena - Art',
    'Elements Envato - Sound',
    'IronHide studios - Music & Art & Design',
  ];

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private playerService: playerService) {}

  ngOnInit() {}

  closeMenu() {
    this.playerService.playSound('close.mp3');
    this.onCloseMenu.emit(false);
  }
}

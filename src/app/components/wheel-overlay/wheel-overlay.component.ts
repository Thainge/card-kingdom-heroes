import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { Wheel } from 'spin-wheel';

interface WheelItem {
  backgroundColor?: string;
  image?: string;
  imageOpacity?: number;
  imageRadius?: number;
  imageRotation?: number;
  imageScale?: number;
  label?: string;
  labelColor?: string;
  value?: number;
  weight?: number;
}

@Component({
  selector: 'app-wheel-overlay',
  templateUrl: './wheel-overlay.component.html',
  styleUrls: ['./wheel-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class WheelOverlayComponent implements OnInit {
  @Input('open') open: boolean = false;
  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // 1. Configure the wheel's properties:
    const wheelItems: WheelItem[] = [
      {
        label: 'one',
      },
      {
        label: 'two',
      },
      {
        label: 'three',
      },
      {
        label: 'four',
      },
    ];
    const props = {
      items: wheelItems,
    };
    const container = document.querySelector('.wheel-container');
    const wheel = new Wheel(container, props);
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

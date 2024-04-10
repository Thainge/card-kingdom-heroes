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

interface WheelProps {
  borderColor?: string;
  borderWidth?: number;
  debug?: boolean;
  image?: string;
  isInteractive?: boolean;
  itemBackgroundColors?: string[];
  itemLabelAlign?: string;
  itemLabelBaselineOffset?: number;
  itemLabelColors?: string;
  itemLabelFont?: string;
  itemLabelFontSizeMax?: number;
  itemLabelRadius?: number;
  itemLabelRadiusMax?: number;
  itemLabelRotation?: number;
  itemLabelStrokeColor?: string;
  itemLabelStrokeWidth?: number;
  items?: WheelItem[];
  lineColor?: string;
  lineWidth?: number;
  pixelRatio?: number;
  radius?: number;
  rotation?: number;
  rotationResistance?: number;
  rotationSpeed?: number;
  rotationSpeedMax?: number;
  offset?: Offset;
  onCurrentIndexChange?: string;
  onRest?: any;
  onSpin?: any;
  overlayImage?: any;
  pointerAngle?: number;
}

interface Offset {
  w: number;
  h: number;
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
    const wheelItems: WheelItem[] = [
      {
        value: 4,
        label: '999x',
        image: './assets/wheelImages/gold.png',
        imageScale: 0.3,
        weight: 0.5,
        backgroundColor: '#ffd700',
      },
      {
        value: 1,
        label: '1x',
        image: './assets/wheelImages/boosterPack.png',
        imageScale: 0.15,
      },
      {
        value: 2,
        label: '150x',
        image: './assets/wheelImages/gold.png',
        imageScale: 0.5,
      },
      {
        value: 3,
        label: '1x',
        image: './assets/wheelImages/boosterPack.png',
        imageScale: 0.15,
      },
      {
        value: 4,
        label: '150x',
        image: './assets/wheelImages/gold.png',
        imageScale: 0.5,
      },
      {
        value: 4,
        label: '1x',
        image: './assets/wheelImages/boosterPack.png',
        imageScale: 0.15,
      },
      {
        value: 4,
        label: '150x',
        image: './assets/wheelImages/gold.png',
        imageScale: 0.5,
      },
      {
        value: 4,
        label: '1x',
        image: './assets/wheelImages/boosterPack.png',
        imageScale: 0.15,
      },

      {
        value: 4,
        label: '150x',
        image: './assets/wheelImages/gold.png',
        imageScale: 0.5,
      },
      {
        value: 4,
        label: '1x',
        image: './assets/wheelImages/boosterPack.png',
        imageScale: 0.15,
      },
    ];
    const props: WheelProps = {
      items: wheelItems,
      borderColor: '#FFDE00',
      borderWidth: 12,
      isInteractive: false,
      radius: 1,
      itemBackgroundColors: ['#ffffff', '#0082EE'],
      lineWidth: 2,
    };
    const container = document.querySelector('.wheel-container');
    const wheel = new Wheel(container, props);
  }

  OnSpin() {
    console.log('spin');
  }

  OnRest() {
    console.log('rest');
  }

  OnCurrentIndexChange() {
    console.log('index');
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

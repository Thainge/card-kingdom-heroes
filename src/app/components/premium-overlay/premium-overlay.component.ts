import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
import Swiper from 'swiper';

interface PremiumBox {
  id: number;
  image: string;
}

@Component({
  selector: 'app-premium-overlay-overlay',
  templateUrl: './premium-overlay.component.html',
  styleUrls: ['./premium-overlay.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
  ],
})
export class PremiumOverlayComponent implements OnInit {
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    this.currentIndex = 0;
    setTimeout(() => {
      this.swiper = this.swiperRef?.nativeElement.swiper;
    }, 0);
  }
  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentIndex: number = 0;
  campaigns: PremiumBox[] = [
    {
      id: 1,
      image: 'normalCampaign.png',
    },
    {
      id: 2,
      image: 'linkCampaign.png',
    },
    {
      id: 3,
      image: 'marioCampaign.png',
    },
    {
      id: 4,
      image: 'tf2Campaign.png',
    },
    {
      id: 5,
      image: 'kirbyCampaign.png',
    },
    {
      id: 6,
      image: 'donkeyKongCampaign.png',
    },
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  onActiveIndexChange() {
    this.currentIndex = this.swiper?.activeIndex ?? 0;
  }

  changeIndexLeft() {
    this.swiper?.slidePrev();
  }

  changeIndexRight() {
    this.swiper?.slideNext();
  }

  trackById = (index: number, item: any) => item.id;
}

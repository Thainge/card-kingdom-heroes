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
  bought: boolean;
  active: boolean;
  cost: number;
}

@Component({
  selector: 'app-premium-overlay',
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
  premiumItems: PremiumBox[] = [
    {
      id: 1,
      image: 'premium1.png',
      bought: false,
      active: false,
      cost: 1000,
    },
    {
      id: 2,
      image: 'premium2.png',
      bought: false,
      active: false,
      cost: 2500,
    },
    {
      id: 3,
      image: 'premium3.png',
      bought: false,
      active: false,
      cost: 5000,
    },
    {
      id: 4,
      image: 'premium4.png',
      bought: false,
      active: false,
      cost: 7500,
    },
    {
      id: 5,
      image: 'premium5.png',
      bought: false,
      active: false,
      cost: 9999,
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

  buyItem(item: PremiumBox) {
    if (item.bought) {
      this.toggleActive(item);
      return;
    }

    this.premiumItems = this.premiumItems.map((x) => {
      if (x.id === item.id) {
        return { ...x, bought: true, active: true };
      }

      return x;
    });
  }

  toggleActive(item: PremiumBox) {
    this.premiumItems = this.premiumItems.map((x) => {
      if (x.id === item.id) {
        return { ...x, active: !x.active };
      }

      return x;
    });
  }

  changeIndexLeft() {
    this.swiper?.slidePrev();
  }

  changeIndexRight() {
    this.swiper?.slideNext();
  }

  trackById = (index: number, item: any) => item.id;
}

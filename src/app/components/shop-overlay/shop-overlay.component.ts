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
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeOutRightOnLeaveAnimation,
} from 'angular-animations';
import { BoosterPack } from 'src/app/models/boosterPack';
import Swiper from 'swiper';

type ShopStep = 'picking' | 'shopping' | 'opening';

@Component({
  selector: 'app-shop-overlay-overlay',
  templateUrl: './shop-overlay.component.html',
  styleUrls: ['./shop-overlay.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),

    fadeOutLeftOnLeaveAnimation({ anchor: 'fadeLeftLeave' }),
    fadeInLeftOnEnterAnimation({ anchor: 'fadeLeftEnter' }),

    fadeOutRightOnLeaveAnimation({ anchor: 'fadeRightLeave' }),
    fadeInRightOnEnterAnimation({ anchor: 'fadeRightEnter' }),
  ],
})
export class ShopOverlayComponent implements OnInit {
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    this.currentIndex = 0;
  }
  currentStep: ShopStep = 'picking';
  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  boosterPacks: BoosterPack[] = [
    {
      id: 1,
      image: 'boosterPack.png',
      title: 'Zelda Booster Pack',
      count: 3,
      cost: 100,
      unlocked: true,
      showNew: true,
    },
    {
      id: 2,
      image: 'boosterPack.png',
      title: 'Mario Booster Pack',
      count: 0,
      cost: 125,
      unlocked: false,
      showNew: false,
    },
    {
      id: 3,
      image: 'boosterPack.png',
      title: 'Team Fortress 2 Booster Pack',
      count: 0,
      cost: 150,
      unlocked: false,
      showNew: false,
    },
    {
      id: 4,
      image: 'boosterPack.png',
      title: 'Sonic Booster Pack',
      count: 0,
      cost: 175,
      unlocked: false,
      showNew: false,
    },
    {
      id: 5,
      image: 'boosterPack.png',
      title: 'Kirby Booster Pack',
      count: 0,
      cost: 200,
      unlocked: false,
      showNew: false,
    },
  ];
  @ViewChild('swiper1') swiperRef1: ElementRef | undefined;
  @ViewChild('swiper2') swiperRef2: ElementRef | undefined;
  swiper1?: Swiper;
  swiper2?: Swiper;
  currentIndex: number = 0;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

  showNotificationIcon(): boolean {
    return this.boosterPacks.find((x) => x.count > 0) ? true : false;
  }

  showNewIcon(): boolean {
    return this.boosterPacks.find((x) => x.showNew) ? true : false;
  }

  hideNew(item: BoosterPack) {
    this.boosterPacks = this.boosterPacks.map((x) => {
      if (item.id === x.id) {
        return { ...x, showNew: false };
      }
      return x;
    });
  }

  setCurrentStep(step: ShopStep) {
    this.currentStep = step;
    this.currentIndex = 0;
    setTimeout(() => {
      if (step === 'shopping') {
        this.swiper1 = this.swiperRef1?.nativeElement.swiper;
      }
      if (step === 'opening') {
        this.swiper2 = this.swiperRef2?.nativeElement.swiper;
      }
    }, 1);
  }

  onActiveIndexChange() {
    if (this.currentStep === 'shopping') {
      this.currentIndex = this.swiper1?.activeIndex ?? 0;
    } else {
      this.currentIndex = this.swiper2?.activeIndex ?? 0;
    }
  }

  buyBoosterPack(item: BoosterPack) {
    this.boosterPacks = this.boosterPacks.map((x) => {
      if (x.id === item.id) {
        return { ...x, count: item.count + 1, showNew: false };
      }
      return x;
    });
  }

  openBoosterPack(item: BoosterPack) {
    this.boosterPacks = this.boosterPacks.map((x) => {
      if (x.id === item.id) {
        return { ...x, count: item.count - 1 };
      }
      return x;
    });
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: BoosterPack) => item.id;
}

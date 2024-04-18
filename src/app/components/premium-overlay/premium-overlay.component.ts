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
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';
import Swiper from 'swiper';

interface PremiumBox {
  id: number;
  image: string;
  bought: boolean;
  active: boolean;
  cost: number;
  type: PremiumType;
}

type PremiumType = 'quadrupleGold' | 'wheelCostsLess' | 'abilitiesCostLess';

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
    if (x) {
      this.checkTip();
    }
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
      cost: 2500,
      type: 'wheelCostsLess',
    },
    {
      id: 2,
      image: 'premium2.png',
      bought: false,
      active: false,
      cost: 5000,
      type: 'quadrupleGold',
    },
    {
      id: 3,
      image: 'premium3.png',
      bought: false,
      active: false,
      cost: 7500,
      type: 'abilitiesCostLess',
    },
  ];
  gold: number = 0;
  goldImage: string = './assets/gold.png';

  constructor(
    private loadingService: LoadingService,
    private playerService: playerService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.goldImage = this.localStorageService.getCurrentGoldImage();
    const localPremium = JSON.parse(
      localStorage.getItem('premiumData') ?? '[]'
    );
    if (localPremium.length > 0) {
      this.premiumItems = localPremium;
    }
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
  }

  ngAfterViewInit() {}

  checkTip() {
    const premiumTipShown = localStorage.getItem('premiumTipShown');
    if (!premiumTipShown) {
      localStorage.setItem('premiumTipShown', JSON.stringify(true));
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Premium',
        text: 'Access exclusive premium upgrades to provide advantages in combat',
        img: 'wildImg.png',
        tipRows: ['- Expensive'],
      });
      this.loadingService.showTip$.next(true);
    }
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
    this.playerService.playSound('close.mp3');
  }

  onActiveIndexChange() {
    this.currentIndex = this.swiper?.activeIndex ?? 0;
  }

  buyItem(item: PremiumBox) {
    if (item.bought) {
      this.toggleActive(item);
      return;
    }

    if (item.cost > this.gold) {
      return;
    }

    this.playerService.playSound('buyItem.mp3');

    this.playerService.gold$.next(this.gold - item.cost);
    this.premiumItems = this.premiumItems.map((x) => {
      if (x.id === item.id) {
        return { ...x, bought: true, active: true };
      }

      return x;
    });

    localStorage.setItem('premiumData', JSON.stringify(this.premiumItems));
  }

  toggleActive(item: PremiumBox) {
    this.playerService.playSound('button.mp3');
    this.premiumItems = this.premiumItems.map((x) => {
      if (x.id === item.id) {
        return { ...x, active: !x.active };
      }

      return x;
    });
    localStorage.setItem('premiumData', JSON.stringify(this.premiumItems));
  }

  changeIndexLeft() {
    this.playerService.playSound('button.mp3');
    this.swiper?.slidePrev();
  }

  changeIndexRight() {
    this.playerService.playSound('button.mp3');
    this.swiper?.slideNext();
  }

  trackById = (index: number, item: any) => item.id;
}

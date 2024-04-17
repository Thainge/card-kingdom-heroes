import { playerService } from 'src/app/services/player.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import {
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
import { FlagDto } from 'src/app/models/flag';
import { LoadingService } from 'src/app/services/loading.service';
import Swiper from 'swiper';
import { LocalStorageService } from 'src/app/services/localstorage.service';

interface CampaignBox {
  id: number;
  image: string;
  url: MapRoute;
  locked: boolean;
  stars: number;
  total: number;
}

type MapRoute =
  | 'cardkingdom-map'
  | 'zelda-map'
  | 'mario-map'
  | 'tf2-map'
  | 'kirby-map'
  | 'donkeykong-map';

@Component({
  selector: 'app-campaign-overlay',
  templateUrl: './campaign-overlay.component.html',
  styleUrls: ['./campaign-overlay.component.scss'],
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
export class CampaignOverlayComponent implements OnInit {
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    this.currentIndex = 0;
    setTimeout(() => {
      this.swiper = this.swiperRef?.nativeElement.swiper;
    }, 0);
  }
  @Output() onCloseMenu = new EventEmitter<boolean>(false);
  @Input('navigate') navigate: boolean = true;

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentIndex: number = 0;
  campaigns: CampaignBox[] = [
    {
      id: 1,
      image: 'normalCampaign.png',
      url: 'cardkingdom-map',
      locked: false,
      stars: 0,
      total: 0,
    },
    {
      id: 2,
      image: 'linkCampaign.png',
      url: 'zelda-map',
      locked: true,
      stars: 0,
      total: 0,
    },
    // {
    //   id: 3,
    //   image: 'marioCampaign.png',
    //   url: 'mario-map',
    // },
    // {
    //   id: 4,
    //   image: 'tf2Campaign.png',
    //   url: 'tf2-map',
    // },
    // {
    //   id: 5,
    //   image: 'kirbyCampaign.png',
    //   url: 'kirby-map',
    // },
    // {
    //   id: 6,
    //   image: 'donkeyKongCampaign.png',
    //   url: 'donkeykong-map',
    // },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private playerService: playerService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.setStars();
  }

  ngAfterViewInit() {}

  setStars() {
    const starsData = this.localStorageService.getStarsData();
    this.campaigns = this.campaigns.map((x) => {
      if (x.id === 1) {
        return {
          ...x,
          stars: starsData.cardKingdomStars,
          total: starsData.cardKingdomTotal,
        };
      }

      if (x.id === 2) {
        return {
          ...x,
          stars: starsData.zeldaStars,
          total: starsData.zeldaTotal,
        };
      }

      return x;
    });
  }

  routeIsMap(): boolean {
    return this.route.toString().includes('map');
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  chooseCampaign(campaign: CampaignBox) {
    const route = '/' + campaign.url;
    localStorage.setItem('currentRoute', campaign.url);
    const localGold = this.localStorageService.getPlayerGold();
    this.playerService.gold$.next(localGold);
    this.playerService.playSound('open.mp3');
    this.closeMenu();

    if (this.navigate) {
      this.loadingService.isRefreshing$.next(true);
      this.loadingService.navigate(route, 'loadingBg.png', 'Loading..');
    }
  }

  onActiveIndexChange() {
    this.currentIndex = this.swiper?.activeIndex ?? 0;
  }

  changeIndexLeft() {
    this.swiper?.slidePrev();
    this.playerService.playSound('button.mp3');
  }

  changeIndexRight() {
    this.swiper?.slideNext();
    this.playerService.playSound('button.mp3');
  }

  trackById = (index: number, item: any) => item.id;
}

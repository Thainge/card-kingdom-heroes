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
import { LoadingService } from 'src/app/services/loading.service';
import Swiper from 'swiper';

interface CampaignBox {
  id: number;
  image: string;
  url: MapRoute;
}

type MapRoute =
  | 'cardkingdom'
  | 'zelda'
  | 'mario'
  | 'tf2'
  | 'kirby'
  | 'donkeykong';

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

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentIndex: number = 0;
  campaigns: CampaignBox[] = [
    {
      id: 1,
      image: 'normalCampaign.png',
      url: 'cardkingdom',
    },
    {
      id: 2,
      image: 'linkCampaign.png',
      url: 'zelda',
    },
    {
      id: 3,
      image: 'marioCampaign.png',
      url: 'mario',
    },
    {
      id: 4,
      image: 'tf2Campaign.png',
      url: 'tf2',
    },
    {
      id: 5,
      image: 'kirbyCampaign.png',
      url: 'kirby',
    },
    {
      id: 6,
      image: 'donkeyKongCampaign.png',
      url: 'donkeykong',
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  routeIsMap(): boolean {
    return this.route.toString().includes('map');
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  chooseCampaign(campaign: CampaignBox) {
    const route = '/map/' + campaign.url;
    this.router.navigate([route]);
    this.closeMenu();
    this.loadingService.isRefreshing$.next(true);
    this.loadingService.navigate(route, 'loadingBg.png');
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

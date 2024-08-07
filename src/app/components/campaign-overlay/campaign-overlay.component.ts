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
import { ActivatedRoute } from '@angular/router';
import {
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
} from 'angular-animations';
import { LoadingService } from 'src/app/services/loading.service';
import Swiper from 'swiper';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { gameTheme } from 'src/app/models/theme';
import { MapRoute } from 'src/app/models/mapRoute';

interface CampaignBox {
  id: number;
  image: string;
  url: MapRoute;
  locked: boolean;
  stars: number;
  total: number;
  theme: gameTheme;
}

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
      this.swiper?.slideTo(this.localStorageService.getCurrentSlide());
    }, 0);
    setTimeout(() => {
      this.setStars();
    }, 1);
  }
  @Output() onCloseMenu = new EventEmitter<boolean>(false);
  @Input('navigate') navigate: boolean = true;

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  currentIndex: number = 0;
  campaigns: CampaignBox[] = [];

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private playerService: playerService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.setStars();
    }, 1);
  }

  ngAfterViewInit() {}

  setStars() {
    this.campaigns = this.localStorageService.getCampaignStarsData();
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
    const gameTheme = campaign.theme;
    this.playerService.gameTheme$.next(gameTheme);
    localStorage.setItem('gameThemePath', gameTheme);
    const localGold = this.localStorageService.getPlayerGold();
    this.playerService.gold$.next(localGold);
    this.playerService.playSound('open.mp3');
    this.closeMenu();

    if (this.navigate) {
      this.loadingService.navigate(route, 'loadingBg.png', 'Loading...');
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

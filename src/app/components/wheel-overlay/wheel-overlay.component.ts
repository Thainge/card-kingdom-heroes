import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { Wheel } from 'spin-wheel';
import { BoosterPack } from 'src/app/models/boosterPack';
import { AchievementService } from 'src/app/services/achievement.service';
import { CardService } from 'src/app/services/card.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';

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

  text: string;
  textAmount: string;
  rewardImage: string;
  rewardType: RewardType;
  boosterPackId?: number;
  goldAmount: number;
}

type RewardType = 'gold' | 'booster';

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
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;

    if (x) {
      this.initWheel();
    }
  }
  @Output() onCloseMenu = new EventEmitter<boolean>(false);
  spinCost: number = 50;

  spinning: boolean = false;
  wheel: any;
  prizes: WheelItem[] = [];
  wonPrize: WheelItem | undefined;
  showPrize: boolean = false;
  gold: number = 0;
  costLess: boolean = false;

  constructor(
    private cardService: CardService,
    private playerService: playerService,
    private achievementService: AchievementService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    try {
      const localPremium = JSON.parse(
        localStorage.getItem('premiumData') ?? '[]'
      );

      if (localPremium && localPremium.length > 0) {
        console.log(localPremium);
        this.costLess = localPremium[0].bought && localPremium[0].active;
      }
    } catch (err) {}
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    const wheelItems: WheelItem[] = this.localStorageService.getWheelItems();
    this.prizes = wheelItems;
  }

  ngAfterViewInit() {}

  initWheel() {
    setTimeout(() => {
      const props: WheelProps = {
        items: this.prizes,
        borderColor: '#FFDE00',
        borderWidth: 12,
        isInteractive: false,
        radius: 1,
        itemBackgroundColors: ['#ffffff', '#0082EE'],
        lineWidth: 2,
      };
      const container = document.querySelector('.wheel-container');
      const wheel = new Wheel(container, props);
      this.wheel = wheel;
    }, 1);
  }

  spinWheel() {
    if (this.spinning) {
      return;
    }

    if (this.spinCost > this.gold) {
      return;
    }

    this.achievementService.unlockNewAchievement(4);

    this.playerService.playSound('buyItem.mp3');

    const goldCost = this.costLess ? this.spinCost / 4 : this.spinCost;
    this.playerService.gold$.next(this.gold - goldCost);

    if (this.wheel) {
      this.spinning = true;
      // Randomly spin to index
      const shuffledArray = this.cardService.shuffle(this.prizes);
      const winningIndex = this.prizes.findIndex(
        (x: WheelItem) => x.value === shuffledArray[0].value
      );
      const duration = 3000;
      this.wheel.spinToItem(winningIndex, duration, true, 2, 1);
      setTimeout(() => {
        // Show won prize like at end of combat
        this.wonPrize = this.prizes[winningIndex];
        this.showPrize = true;
      }, 3300);
    }
  }

  endSpin() {
    if (this.wonPrize?.rewardType === 'gold') {
      this.playerService.gold$.next(this.gold + this.wonPrize?.goldAmount!);
    }
    this.playerService.playSound('cardOpen.mp3');

    if (this.wonPrize?.rewardType === 'booster') {
      // Add booster pack prize
      let boosterPacks: BoosterPack[] =
        this.localStorageService.getBoosterPacks();
      boosterPacks = boosterPacks.map((x) => {
        if (x.id === this.wonPrize?.boosterPackId!) {
          return { ...x, count: x.count + 1, showNew: false };
        }
        return x;
      });
      this.localStorageService.setBoosterPacks(boosterPacks);
    }

    this.showPrize = false;
    this.wonPrize = undefined;
    this.spinning = false;
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

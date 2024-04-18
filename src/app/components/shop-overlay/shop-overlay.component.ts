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
import { Router } from '@angular/router';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeOutRightOnLeaveAnimation,
  tadaOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
  flipOnEnterAnimation,
} from 'angular-animations';
import { AbilityCard } from 'src/app/models/abilityCard';
import { BoosterPack } from 'src/app/models/boosterPack';
import { AchievementService } from 'src/app/services/achievement.service';
import { CardService } from 'src/app/services/card.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';
import Swiper from 'swiper';

type ShopStep = 'picking' | 'shopping' | 'opening';
type OpeningCardsStep = 'initial' | 'openingCards';

interface AbilityDeckCard extends AbilityCard {
  owned: boolean;
  inHand: boolean;
  index: number;
}

interface ExtendedAbilityCard extends AbilityCard {
  rarityImage: string;
  special: boolean;
}

@Component({
  selector: 'app-shop-overlay',
  templateUrl: './shop-overlay.component.html',
  styleUrls: ['./shop-overlay.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  animations: [
    tadaOnEnterAnimation({ anchor: 'tadaOnEnter' }),
    flipOnEnterAnimation({ anchor: 'flipOnEnter' }),

    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),

    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),

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
    this.initBoosters();
    this.setCurrentStep('picking');
    if (x) {
      this.checkShopTip();
    }
  }
  currentStep: ShopStep = 'picking';
  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  boosterPacks: BoosterPack[] = [];
  @ViewChild('swiper1') swiperRef1: ElementRef | undefined;
  @ViewChild('swiper2') swiperRef2: ElementRef | undefined;
  swiper1?: Swiper;
  swiper2?: Swiper;
  currentIndex: number = 0;
  openBooster: BoosterPack | undefined;

  openingCards: boolean = false;
  openStep: OpeningCardsStep = 'initial';
  openCards: ExtendedAbilityCard[] = [];
  showCardsList: ExtendedAbilityCard[] = [];
  showCardAnimation: boolean = false;
  canClickFinish: boolean = false;
  specialList: number[] = [];
  canClickNext: boolean = false;
  goldImage: string = './assets/gold.png';

  allCards: AbilityCard[] = [];
  gold: number = 0;

  constructor(
    private loadingService: LoadingService,
    private cardService: CardService,
    private playerService: playerService,
    private achievementService: AchievementService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.goldImage = this.localStorageService.getCurrentGoldImage();
    this.allCards = this.localStorageService.getAbilityData();
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
  }

  ngAfterViewInit() {}

  boostersIncludeUnopened(): boolean {
    let found = false;
    this.boosterPacks.forEach((x) => {
      if (x.cost <= this.gold) {
        found = true;
      }
    });
    return true;
  }

  initBoosters() {
    this.boosterPacks = this.localStorageService.getBoosterPacks();
  }

  checkShopTip() {
    const shopTipShown = localStorage.getItem('shopTipShown');
    if (!shopTipShown) {
      localStorage.setItem('shopTipShown', JSON.stringify(true));
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Shop',
        text: 'Buy and open booster packs to unlock new cards',
        img: 'shopImg.png',
        tipRows: ['- Buy booster packs', '- Open booster packs'],
      });
      this.loadingService.showTip$.next(true);
    }
  }

  startPhase(booster: BoosterPack) {
    this.openingCards = true;

    const cardsForBooster = this.allCards.filter(
      (x) => x.boosterId === booster.id
    );
    this.playerService.playSound('button.mp3');
    let shuffled1: ExtendedAbilityCard[] = this.cardService
      .shuffle(cardsForBooster)
      .map((x, i) => {
        if (i < 1) {
          return { ...x, special: true, rarityImage: 'epic.png', level: 2 };
        }

        return { ...x, special: false, rarityImage: 'rare.png' };
      });
    const shuffled: ExtendedAbilityCard[] = this.cardService.shuffle(shuffled1);
    this.openCards = [shuffled[0], shuffled[1], shuffled[2]].map((x) => {
      return { ...x, id: x.id + x.level - 1 };
    });
    const currentCards: AbilityDeckCard[] =
      this.localStorageService.getAbilityCards();

    let returnCards: ExtendedAbilityCard[] = JSON.parse(
      JSON.stringify(currentCards)
    );

    this.openCards.forEach((x: ExtendedAbilityCard) => {
      const exists = currentCards.find((a) => a.id === x.id);

      if (exists) {
        // If card ID exists, increase owned count
        returnCards = returnCards.map((a) => {
          if (a.id === x.id) {
            return {
              ...a,
              trueNumberOwned: a.trueNumberOwned + 1,
              numberOwned: a.numberOwned + 1,
            };
          }
          return a;
        });
      } else {
        // If card ID does not exist, add card to deck
        const newCard: ExtendedAbilityCard = {
          ...x,
        };
        returnCards.push(newCard);
      }
    });
    const returnData: AbilityDeckCard[] = returnCards.map((x) => {
      return { ...x, index: 0, inHand: false, owned: true };
    });
    this.localStorageService.setAbilityCards(returnData);
    setTimeout(() => {
      this.canClickNext = true;
    }, 800);
  }

  nextPhase() {
    if (!this.canClickNext) {
      return;
    }

    this.canClickNext = false;

    this.openStep = 'openingCards';
    setTimeout(() => {
      this.showCardsList = this.openCards;
      this.showCardAnimation = true;
      setTimeout(() => {
        this.playerService.playSound('cardOpen.mp3');
      }, 500);
    }, 800);
    setTimeout(() => {
      this.canClickFinish = true;
    }, 2500);
  }

  async finishPhase() {
    if (!this.canClickFinish) {
      return;
    }
    this.playerService.playSound('button.mp3');

    this.canClickFinish = false;

    let i = 0;
    for await (let x of this.showCardsList) {
      this.showCardsList = this.showCardsList.filter((a) => x.id !== a.id);
      i++;
      await this.timeout(200);
    }
    this.openingCards = false;
    this.openStep = 'initial';
    this.showCardsList = [];
    this.showCardAnimation = false;
    this.canClickFinish = false;
    this.specialList = [];
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  showCardsIncludes(item: any): boolean {
    if (this.showCardsList.find((x) => x.id === item.id)) {
      return true;
    }

    return false;
  }

  determineDelayCard(i: number): number {
    return (i + 1) * 300;
  }

  showCardSpecialAnimation(item: any): boolean {
    const foundSpecial = this.specialList.includes(item.id);
    setTimeout(() => {
      if (!foundSpecial) {
        this.specialList.push(item.id);
      }
    }, 500);
    if (item.special && foundSpecial) {
      return true;
    } else {
      return false;
    }
  }

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

  changeIndexLeft(playSound: boolean = true) {
    if (this.currentStep === 'shopping') {
      this.swiper1?.slidePrev();
    }
    if (this.currentStep === 'opening') {
      this.swiper2?.slidePrev();
    }

    if (playSound) {
      this.playerService.playSound('button.mp3');
    }
  }

  changeIndexRight() {
    if (this.currentStep === 'shopping') {
      this.swiper1?.slideNext();
    }
    if (this.currentStep === 'opening') {
      this.swiper2?.slideNext();
    }
    this.playerService.playSound('button.mp3');
  }

  setCurrentStep(step: ShopStep) {
    this.currentStep = step;
    this.currentIndex = 0;
    this.playerService.playSound('open.mp3');
    this.changeIndexLeft(false);
    this.changeIndexLeft(false);
    this.changeIndexLeft(false);
    this.changeIndexLeft(false);
    this.changeIndexLeft(false);
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
    if (item.cost > this.gold) {
      return;
    }

    this.playerService.playSound('buyItem.mp3');

    this.playerService.gold$.next(this.gold - item.cost);

    this.boosterPacks = this.boosterPacks.map((x) => {
      if (x.id === item.id) {
        return { ...x, count: item.count + 1, showNew: false };
      }
      return x;
    });
    this.localStorageService.setBoosterPacks(this.boosterPacks);
  }

  openBoosterPack(item: BoosterPack) {
    this.startPhase(item);
    this.achievementService.unlockNewAchievement(2);
    this.openBooster = item;
    this.playerService.playSound('button.mp3');
    this.boosterPacks = this.boosterPacks.map((x) => {
      if (x.id === item.id) {
        return { ...x, count: item.count - 1 };
      }
      return x;
    });
    this.localStorageService.setBoosterPacks(this.boosterPacks);
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: any) => item.id;
}

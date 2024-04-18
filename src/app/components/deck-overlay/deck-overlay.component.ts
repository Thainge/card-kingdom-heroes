import { CommonModule } from '@angular/common';
import {
  Component,
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
} from 'angular-animations';
import { AbilityCard } from 'src/app/models/abilityCard';
import { AchievementService } from 'src/app/services/achievement.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { playerService } from 'src/app/services/player.service';

interface AbilityDeckCard extends AbilityCard {
  owned: boolean;
  inHand: boolean;
  index: number;
}

type SortValue = 'Color' | 'Upgrade' | 'Level' | 'Cost' | 'Card' | 'New';

@Component({
  selector: 'app-deck-overlay',
  templateUrl: './deck-overlay.component.html',
  styleUrls: ['./deck-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class DeckOverlayComponent implements OnInit {
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    this.abilityHand = this.localStorageService.getPlayerDeck();
    this.abilityCards = this.localStorageService.getAbilityCards();
    this.abilityCards = this.abilityCards.map((x) => {
      return { ...x, owned: true };
    });
    this.initialAbilityHand = JSON.parse(JSON.stringify(this.abilityHand));
    // this.abilityCards = this.userService.getAbilityCards().map((x, i) => {
    //   if (i < 5) {
    //     return {
    //       ...x,
    //       owned: true,
    //       inHand: false,
    //       isNew: true,
    //       numberOwned: 4,
    //       trueNumberOwned: 4,
    //       index: i,
    //       level: 1,
    //       goldCost: [500, 1000, 1500],
    //     };
    //   }
    //   if (i < 11) {
    //     return {
    //       ...x,
    //       owned: true,
    //       inHand: false,
    //       isNew: false,
    //       numberOwned: 2,
    //       trueNumberOwned: 2,
    //       index: i,
    //       level: 2,
    //       goldCost: [150, 500, 1000],
    //     };
    //   }
    //   return {
    //     ...x,
    //     owned: true,
    //     inHand: false,
    //     isNew: false,
    //     numberOwned: 1,
    //     trueNumberOwned: 1,
    //     index: i,
    //     level: 3,
    //     goldCost: [500, 1000, 1500],
    //   };
    // });
    // this.initialAbilityHand = JSON.parse(JSON.stringify(this.abilityHand));
    this.sortCards();
    if (x) {
      this.checkTip();
    }
  }
  abilityCards: AbilityDeckCard[] = [];
  abilityHand: AbilityDeckCard[] = [];
  initialAbilityHand: AbilityDeckCard[] = [];
  currentHoveringCard: AbilityDeckCard | undefined;
  currentUpgradeHover: AbilityDeckCard | undefined;
  currentIndex: number = -10;
  currentSort: SortValue = 'Level';
  errorList: any[] = [];
  errorListInactive: any[] = [];
  areYouSurePopup: boolean = false;

  leftUpgradeCard: AbilityDeckCard | undefined;
  rightUpgradeCard: AbilityDeckCard | undefined;
  showingUpgradeCard: boolean = false;
  showingUpgradeAnimation: boolean = false;
  canClickEnd: boolean = false;
  gold: number = 0;
  goldImage: string = './assets/gold.png';

  @ViewChild('container') container: any;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(
    private userService: playerService,
    private loadingService: LoadingService,
    private playerService: playerService,
    private achievementService: AchievementService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.goldImage = this.localStorageService.getCurrentGoldImage();
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
  }

  checkTip() {
    const deckTipShown = localStorage.getItem('deckTipShown');
    if (!deckTipShown) {
      localStorage.setItem('deckTipShown', JSON.stringify(true));
      this.loadingService.currentTip$.next({
        title: 'New Tip',
        header: 'Deck',
        text: 'Upgrade cards and change your deck',
        img: 'deckImg.png',
        tipRows: [
          '- Create your own ability deck',
          '- Combine 3 cards to upgrade them',
          '- Upgrades cost gold',
        ],
      });
      this.loadingService.showTip$.next(true);
    }
  }

  addCardToHand(card: AbilityDeckCard) {
    if (this.abilityHand.length === 16 || card.inHand) {
      return;
    }
    this.currentHoveringCard = undefined;
    this.playerService.playSound('button.mp3');

    const totalCountIdsInHand = this.abilityHand.filter(
      (x) => x.id === card.id
    );

    // disable card if count = 1
    if (card.numberOwned === 1 || totalCountIdsInHand.length === 2) {
      this.abilityHand.push(card);
      this.abilityCards = this.abilityCards.map((x) => {
        if (x.id === card.id) {
          return { ...x, inHand: true, numberOwned: x.numberOwned - 1 };
        }

        return x;
      });
      this.localStorageService.setPlayerDeck(this.abilityHand);
      this.localStorageService.setAbilityCards(this.abilityCards);
    } else if (card.numberOwned !== 1) {
      this.abilityHand.push(card);
      this.abilityCards = this.abilityCards.map((x) => {
        if (x.id === card.id) {
          return { ...x, inHand: false, numberOwned: x.numberOwned - 1 };
        }

        return x;
      });
      this.localStorageService.setPlayerDeck(this.abilityHand);
      this.localStorageService.setAbilityCards(this.abilityCards);
    }
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  hideUpgrade() {
    if (!this.canClickEnd) {
      return;
    }

    this.showingUpgradeAnimation = false;
    this.showingUpgradeCard = false;
    this.rightUpgradeCard = undefined;
    this.leftUpgradeCard = undefined;
  }

  pushError(message: string) {
    const ID = this.errorList.length + 1;
    this.errorList.push({ id: ID, message: message });
    const currentListLength = this.errorList.length;

    setTimeout(() => {
      this.errorListInactive.push(ID);
    }, 1100);

    setTimeout(() => {
      if (currentListLength === this.errorList.length) {
        this.errorList = [];
        this.errorListInactive = [];
      }
    }, 2500);
  }

  setIsNewFalseCard(card: AbilityDeckCard) {
    this.currentUpgradeHover = card;
    this.abilityCards = this.abilityCards.map((x) => {
      if (x.id === card.id) {
        return { ...x, isNew: false };
      }
      return x;
    });
    this.localStorageService.setAbilityCards(this.abilityCards);
  }

  determineWidth(card: AbilityDeckCard): string {
    if (card.trueNumberOwned === 0) {
      return '0';
    }

    if (card.trueNumberOwned === 1) {
      return '33%';
    }

    if (card.trueNumberOwned === 2) {
      return '66%';
    }

    return '91.5%';
  }

  cancelUpgrade() {
    this.playerService.playSound('button.mp3');
    this.leftUpgradeCard = undefined;
    this.rightUpgradeCard = undefined;
    this.showingUpgradeCard = false;
  }

  startUpgradeCard(card: AbilityDeckCard) {
    if (card.level === 3 || card.trueNumberOwned <= 2) {
      return;
    }

    this.playerService.playSound('button.mp3');

    this.leftUpgradeCard = card;
    const newCard = { ...card, level: card.level + 1 };
    this.rightUpgradeCard = newCard;
    this.showingUpgradeCard = true;
  }

  async upgradeCard() {
    if (
      (this.leftUpgradeCard?.goldCost ?? [])[
        (this.leftUpgradeCard?.level ?? 1) - 1
      ] > this.gold
    ) {
      return;
    }

    this.achievementService.unlockNewAchievement(1);
    this.playerService.gold$.next(
      this.gold -
        (this.leftUpgradeCard?.goldCost ?? [])[
          (this.leftUpgradeCard?.level ?? 1) - 1
        ]
    );
    this.playerService.playSound('buyItem.mp3');

    const card = this.leftUpgradeCard;

    // Show animation for upgrading card
    this.showingUpgradeCard = false;
    this.showingUpgradeAnimation = true;
    this.timeout(1000);
    this.canClickEnd = true;

    // If card was in hand, add to hand again
    const currentLength = this.abilityHand.length; // 2
    this.abilityHand = this.abilityHand.filter((x) => x.id !== card?.id);
    const newLength = this.abilityHand.length; // 0

    // Upgrade card

    // If 3/3 remove previous ID and add new id
    let added = false;
    this.abilityCards = this.abilityCards.map((x) => {
      // Reduce number owned
      if (x.id === card?.id) {
        return {
          ...x,
          trueNumberOwned: x.trueNumberOwned - 3,
          numberOwned: x.trueNumberOwned - 3,
          owned: true,
          inHand: false,
        };
      }

      // Check if needs to add to existing ID
      if (x.id === card?.id! + 1) {
        added = true;
        this.abilityHand = this.abilityHand.filter(
          (x) => x.id !== card?.id! + 1
        );
        return {
          ...x,
          trueNumberOwned: x.trueNumberOwned + 1,
          numberOwned: x.trueNumberOwned + 1,
          owned: true,
          inHand: false,
          isNew: true,
        };
      }
      return x;
    });

    this.abilityCards = this.abilityCards.filter((x) => {
      if (x.id === card?.id && x.trueNumberOwned < 1) {
        return false;
      }

      return true;
    });

    if (!added && card) {
      console.log('added');
      this.abilityCards.push({
        ...card,
        numberOwned: 1,
        trueNumberOwned: 1,
        id: card.id + 1,
        level: card.level + 1,
        owned: true,
        inHand: false,
        isNew: true,
      });
    }
    setTimeout(() => {
      this.playerService.playSound('cardOpen.mp3');
    }, 400);
    this.currentSort = 'New';
    this.sortCards();
    this.container.nativeElement.scrollTop = 0;
    this.localStorageService.setPlayerDeck(this.abilityHand);
    this.localStorageService.setAbilityCards(this.abilityCards);
  }

  removeCardFromHand(card: AbilityDeckCard) {
    this.playerService.playSound('button.mp3');
    let found = false;
    this.abilityHand = this.abilityHand.filter((x) => {
      if (x.id === card.id && !found) {
        found = true;
        return null;
      }

      return x;
    });
    this.abilityCards = this.abilityCards.map((x) => {
      if (x.id === card.id) {
        return { ...x, inHand: false, numberOwned: x.numberOwned + 1 };
      }

      return x;
    });
    this.localStorageService.setPlayerDeck(this.abilityHand);
    this.localStorageService.setAbilityCards(this.abilityCards);
  }

  resetDeck() {
    this.playerService.playSound('button.mp3');
    this.abilityHand = [];
    this.abilityCards = this.abilityCards.map((x) => {
      return { ...x, inHand: false };
    });
    this.localStorageService.setPlayerDeck(this.abilityHand);
    this.localStorageService.setAbilityCards(this.abilityCards);
  }

  nextSort() {
    this.playerService.playSound('button.mp3');
    if (this.currentSort === 'Card') {
      this.currentSort = 'Color';
    } else if (this.currentSort === 'Color') {
      this.currentSort = 'Upgrade';
    } else if (this.currentSort === 'Upgrade') {
      this.currentSort = 'Cost';
    } else if (this.currentSort === 'Cost') {
      this.currentSort = 'New';
    } else if (this.currentSort === 'New') {
      this.currentSort = 'Level';
    } else if (this.currentSort === 'Level') {
      this.currentSort = 'Card';
    }

    this.sortCards();
  }

  sortCards() {
    try {
      // Sort by card
      if (this.currentSort === 'Card') {
        this.abilityCards = this.abilityCards.sort((a, b) => b.id - a.id);
      }

      // Sort by new
      if (this.currentSort === 'New') {
        this.abilityCards = this.abilityCards.sort(
          (a, b) => Number(b.isNew) - Number(a.isNew)
        );
      }

      // Sort by cost
      if (this.currentSort === 'Color') {
        let onlyRedArray: AbilityDeckCard[] = [];
        let onlyBlackArray: AbilityDeckCard[] = [];
        let bothArray: AbilityDeckCard[] = [];

        // First sort by cost
        this.abilityCards = this.abilityCards.sort((a, b) => {
          if (
            a.cost[a.level] &&
            b.cost[b.level] &&
            a.cost[a.level].length < b.cost[b.level].length
          ) {
            return -1;
          }
          if (
            a.cost[a.level] &&
            b.cost[b.level] &&
            a.cost[a.level].length > b.cost[b.level].length
          ) {
            return 1;
          }
          return 0;
        });

        // Manually sort
        this.abilityCards.forEach((x) => {
          const includesHearts =
            x.cost[x.level] && x.cost[x.level].includes('hearts');
          const includesDiamonds =
            x.cost[x.level] && x.cost[x.level].includes('diamonds');
          const includesRed =
            x.cost[x.level] && x.cost[x.level].includes('red');
          const includesSpades =
            x.cost[x.level] && x.cost[x.level].includes('spades');
          const includesClubs =
            x.cost[x.level] && x.cost[x.level].includes('clubs');
          const includesBlack =
            x.cost[x.level] && x.cost[x.level].includes('black');
          const onlyRed =
            (includesHearts || includesDiamonds || includesRed) &&
            !includesSpades &&
            !includesClubs &&
            !includesBlack;
          const onlyBlack =
            (includesSpades || includesClubs || includesBlack) &&
            !includesHearts &&
            !includesDiamonds &&
            !includesRed;

          if (onlyRed || (x.cost[x.level] && x.cost[x.level].length === 0)) {
            onlyRedArray.push(x);
          } else if (onlyBlack) {
            onlyBlackArray.push(x);
          } else {
            bothArray.push(x);
          }
        });

        // Combine arrays
        this.abilityCards = [...onlyRedArray, ...onlyBlackArray, ...bothArray];
      }

      // Sort by levelup
      if (this.currentSort === 'Upgrade') {
        this.abilityCards = this.abilityCards.sort((a, b) => {
          if (a.trueNumberOwned > b.trueNumberOwned) {
            return -1;
          }
          if (a.trueNumberOwned < b.trueNumberOwned) {
            return 1;
          }
          return 0;
        });
      }

      // Sort by cost
      if (this.currentSort === 'Cost') {
        this.abilityCards = this.abilityCards.sort((a, b) => {
          if (
            a.cost[a.level] &&
            b.cost[b.level] &&
            a.cost[a.level].length < b.cost[b.level].length
          ) {
            return -1;
          }
          if (
            a.cost[a.level] &&
            b.cost[b.level] &&
            a.cost[a.level].length > b.cost[b.level].length
          ) {
            return 1;
          }
          return 0;
        });
      }

      // Sort by Level
      if (this.currentSort === 'Level') {
        this.abilityCards = this.abilityCards.sort((a, b) => {
          if (a.level > b.level) {
            return -1;
          }
          if (a.level < b.level) {
            return 1;
          }
          return 0;
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  checkCloseMenu() {
    const deckIsSame = this.deckIsSame();
    if (!deckIsSame) {
      this.playerService.playSound('button.mp3');
      this.areYouSurePopup = true;
    } else {
      this.playerService.playSound('close.mp3');
      this.onCloseMenu.emit(false);
    }
  }

  deckIsSame(): boolean {
    const initialHand = this.initialAbilityHand;
    const currentHand = this.abilityHand;

    let isSame = true;
    currentHand.forEach((x) => {
      const found = currentHand.find((a) => a.id === x.id);
      if (!found) {
        isSame = false;
      }
    });

    if (initialHand.length !== currentHand.length) {
      isSame = false;
    }

    return isSame;
  }

  saveDeck() {
    const maxHandSize = 6;
    if (
      this.abilityHand.length < maxHandSize &&
      this.abilityCards.length >= maxHandSize
    ) {
      this.pushError('Must have at least 6 cards');
      this.playerService.playSound('button.mp3');
      return;
    } else {
      this.localStorageService.setPlayerDeck(this.abilityHand);
      this.localStorageService.setAbilityCards(this.abilityCards);
      this.closeMenu();
    }
  }

  closeMenu() {
    this.initialAbilityHand = [];
    this.areYouSurePopup = false;
    this.playerService.playSound('close.mp3');
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: AbilityCard) => item.id;
}

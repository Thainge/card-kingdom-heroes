import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { AbilityCard } from 'src/app/models/abilityCard';
import { playerService } from 'src/app/services/player.service';

interface AbilityDeckCard extends AbilityCard {
  owned: boolean;
  inHand: boolean;
  isNew: boolean;
  numberOwned: number;
  trueNumberOwned: number;
  index: number;
  goldCost: number[];
}

type SortValue = 'Color' | 'Upgrade' | 'Level' | 'Cost';

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
    this.abilityCards = this.userService.getAbilityCards().map((x, i) => {
      if (i < 5) {
        return {
          ...x,
          owned: true,
          inHand: false,
          isNew: true,
          numberOwned: 4,
          trueNumberOwned: 4,
          index: i,
          level: 1,
          goldCost: [500, 1000, 1500],
        };
      }
      if (i < 11) {
        return {
          ...x,
          owned: true,
          inHand: false,
          isNew: false,
          numberOwned: 2,
          trueNumberOwned: 2,
          index: i,
          level: 2,
          goldCost: [150, 500, 1000],
        };
      }
      return {
        ...x,
        owned: true,
        inHand: false,
        isNew: false,
        numberOwned: 1,
        trueNumberOwned: 1,
        index: i,
        level: 3,
        goldCost: [500, 1000, 1500],
      };
    });
    this.initialAbilityHand = JSON.parse(JSON.stringify(this.abilityHand));
    this.sortCards();
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

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private userService: playerService) {}

  ngOnInit() {}

  addCardToHand(card: AbilityDeckCard) {
    if (this.abilityHand.length === 16 || card.inHand) {
      return;
    }

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
    } else if (card.numberOwned !== 1) {
      this.abilityHand.push(card);
      this.abilityCards = this.abilityCards.map((x) => {
        if (x.id === card.id) {
          return { ...x, inHand: false, numberOwned: x.numberOwned - 1 };
        }

        return x;
      });
    }
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

    return '91%';
  }

  upgradeCard(card: AbilityDeckCard) {
    if (card.level === 3 || card.trueNumberOwned <= 2) {
      return;
    }

    this.abilityHand = this.abilityHand.filter((x) => x.id !== card.id);
    this.abilityCards = this.abilityCards.map((x) => {
      if (x.id === card.id) {
        return {
          ...x,
          level: x.level + 1,
          trueNumberOwned: x.trueNumberOwned - 3,
          numberOwned: x.trueNumberOwned - 3,
          owned: true,
          inHand: false,
        };
      }

      return x;
    });
  }

  removeCardFromHand(card: AbilityDeckCard) {
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
  }

  resetDeck() {
    this.abilityHand = [];
    this.abilityCards = this.abilityCards.map((x) => {
      return { ...x, inHand: false };
    });
  }

  nextSort() {
    if (this.currentSort === 'Color') {
      this.currentSort = 'Upgrade';
    } else if (this.currentSort === 'Upgrade') {
      this.currentSort = 'Cost';
    } else if (this.currentSort === 'Cost') {
      this.currentSort = 'Level';
    } else if (this.currentSort === 'Level') {
      this.currentSort = 'Color';
    }

    this.sortCards();
  }

  sortCards() {
    // Sort by cost
    if (this.currentSort === 'Color') {
      let onlyRedArray: AbilityDeckCard[] = [];
      let onlyBlackArray: AbilityDeckCard[] = [];
      let bothArray: AbilityDeckCard[] = [];

      // First sort by cost
      this.abilityCards = this.abilityCards.sort((a, b) => {
        if (a.cost.length < b.cost.length) {
          return -1;
        }
        if (a.cost.length > b.cost.length) {
          return 1;
        }
        return 0;
      });

      // Manually sort
      this.abilityCards.forEach((x) => {
        const includesHearts = x.cost.includes('hearts');
        const includesDiamonds = x.cost.includes('diamonds');
        const includesRed = x.cost.includes('red');
        const includesSpades = x.cost.includes('spades');
        const includesClubs = x.cost.includes('clubs');
        const includesBlack = x.cost.includes('black');
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

        if (onlyRed || x.cost.length === 0) {
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
        if (a.cost.length < b.cost.length) {
          return -1;
        }
        if (a.cost.length > b.cost.length) {
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
  }

  checkCloseMenu() {
    const deckIsSame = this.deckIsSame();
    if (!deckIsSame) {
      this.areYouSurePopup = true;
    } else {
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
    const maxHandSize = 1;
    if (
      this.abilityHand.length < maxHandSize &&
      this.abilityCards.length >= maxHandSize
    ) {
      this.pushError('Invalid deck length');
      return;
    } else {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.initialAbilityHand = [];
    this.areYouSurePopup = false;
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: AbilityCard) => item.id;
}

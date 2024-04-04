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
}

type SortValue = 'Level' | 'Cost' | 'Color';

@Component({
  selector: 'app-deck-overlay-overlay',
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
  @Input('open') open: boolean = false;
  abilityCards: AbilityDeckCard[] = [];
  abilityHand: AbilityDeckCard[] = [];
  currentHoveringCard: AbilityDeckCard | undefined;
  currentSort: SortValue = 'Color';

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor(private userService: playerService) {}

  ngOnInit() {
    this.abilityCards = this.userService.getAbilityCards().map((x, i) => {
      if (i < 16) {
        return { ...x, owned: true, inHand: false };
      }
      return { ...x, owned: false, inHand: false };
    });
  }

  addCardToHand(card: AbilityDeckCard) {
    if (this.abilityHand.length === 16) {
      return;
    }

    this.abilityHand.push(card);
    this.abilityCards = this.abilityCards.map((x) => {
      if (x.id === card.id) {
        return { ...x, inHand: true };
      }

      return x;
    });
  }

  removeCardFromHand(card: AbilityDeckCard) {
    this.abilityHand = this.abilityHand.filter((x) => x.id !== card.id);
    this.abilityCards = this.abilityCards.map((x) => {
      if (x.id === card.id) {
        return { ...x, inHand: false };
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

  sortBy() {
    // this.currentSort
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }

  trackById = (index: number, item: AbilityCard) => item.id;
}

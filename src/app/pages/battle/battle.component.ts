import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardDto } from 'src/app/models/card';
import { CardService } from 'src/app/services/cardService';
import { Cards } from 'src/assets/data/cards';
import {
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),
  ],
})
export class BattleComponent implements OnInit {
  player1Deck: CardDto[] = [];
  player1Hand: CardDto[] = [];
  player1Defense: CardDto[] = [];
  player: Player = { image: './assets/cards/' + 'king_of_hearts2.png' };
  player1Health: number = 10;

  player2Deck: CardDto[] = [];
  player2Hand: CardDto[] = [];
  player2Defense: CardDto[] = [];
  enemyPlayers: Player[] = [
    { id: 1, image: './assets/cards/' + 'jack_of_spades.png' },
    { id: 2, image: './assets/cards/' + 'queen_of_spades.png' },
    { id: 3, image: './assets/cards/' + 'king_of_spades2.png' },
  ];
  enemyTarget: number = 0;
  player2Health: number = 10;

  selectedCards: CardDto[] = [];
  canSelectCards: boolean = true;

  redrawCards: CardDto[] = [];
  redrawSelectedCards: CardDto[] = [];
  redrawing: boolean = true;
  redrawHide: boolean = false;

  validCards: CardDto[] = [];
  errorList: any[] = [];
  errorListInactive: any[] = [];

  attackStarted: boolean = false;

  constructor(private cardService: CardService) {}

  ngOnInit() {
    // Shuffle player decks
    this.player1Deck = this.cardService.shuffle(Cards);
    this.player2Deck = this.cardService.shuffle(Cards);

    // Both players draw 5 cards
    for (const num of [0, 0, 0, 0, 0]) {
      // Add to player 1 hand and remove player 1 deck
      // this.player1Hand.push(this.player1Deck[num]);
      // this.player1Deck.push(this.player1Deck[num]);
      // this.player1Deck.shift();
      this.redrawCards.push(this.player1Deck[num]);
      this.player1Deck.push(this.player1Deck[num]);
      this.player1Deck.shift();

      // Add to player 2 hand and remove player 2 deck
      this.player2Hand.push(this.player2Deck[num]);
      this.player2Deck.push(this.player2Deck[num]);
      this.player2Deck.shift();
    }

    // Testing attack
    this.attackStarted = true;
    this.redrawHide = true;
    this.redrawing = false;
    this.player2Hand = [
      {
        suit: 'hearts',
        value: '2',
        image: '2_of_spades.png',
      },
      {
        suit: 'diamonds',
        value: '5',
        image: '5_of_diamonds.png',
      },
      {
        suit: 'spades',
        value: '5',
        image: '5_of_diamonds.png',
      },
      {
        suit: 'clubs',
        value: '6',
        image: '6_of_diamonds.png',
      },
      {
        suit: 'clubs',
        value: '6',
        image: '6_of_diamonds.png',
      },
    ];
    this.selectedCards = [
      {
        suit: 'spades',
        value: '10',
        image: '10_of_spades.png',
      },
      {
        suit: 'diamonds',
        value: '10',
        image: '10_of_diamonds.png',
      },
      {
        suit: 'diamonds',
        value: '7',
        image: '7_of_diamonds.png',
      },
      {
        suit: 'diamonds',
        value: '7',
        image: '7_of_diamonds.png',
      },
    ];
    this.attack();
  }

  cardIsSelected(card: CardDto): boolean {
    const includesCard = this.selectedCards.find(
      (x: CardDto) => x.value === card.value && x.suit === card.suit
    );
    if (includesCard) {
      return true;
    }
    return false;
  }

  setEnemyPlayerHover(card: Player) {
    if (card.id === this.enemyTarget) {
      this.enemyTarget = 0;
    } else {
      this.enemyTarget = card.id ?? 0;
    }
  }

  redrawCardIsSelected(card: CardDto): boolean {
    const includesCard = this.redrawSelectedCards.find(
      (x: CardDto) => x.value === card.value && x.suit === card.suit
    );
    if (includesCard) {
      return true;
    }
    return false;
  }

  finishedRedraw() {
    this.redrawing = false;
    setTimeout(() => {
      this.redrawHide = true;
    }, 1000);

    this.redrawCards = this.redrawCards.filter((x) => {
      const foundCard = this.redrawSelectedCards.find(
        (a) => a.suit === x.suit && a.value === x.value
      );
      if (!foundCard) {
        return true;
      }

      return false;
    });

    setTimeout(() => {
      // Remove selected redraw cards
      this.redrawSelectedCards.forEach((x, i) => {
        this.redrawCards.push(this.player1Deck[0]);
        this.player1Deck.push(this.player1Deck[0]);
        this.player1Deck.shift();
      });

      this.player1Hand = this.redrawCards;
    }, 900);
  }

  selectRedrawCard(card: CardDto) {
    const includesCard = this.redrawSelectedCards.find(
      (x: CardDto) => x.value === card.value && x.suit === card.suit
    );

    // Add card to selectedCards
    if (!includesCard && this.redrawSelectedCards.length < 2) {
      this.redrawSelectedCards.push(card);
    }
    // Remove card from selectedCards
    if (includesCard) {
      this.redrawSelectedCards = this.redrawSelectedCards.filter(
        (x: CardDto) => {
          const foundItem = x.value === card.value && x.suit === card.suit;
          if (foundItem) {
            return false;
          }
          return true;
        }
      );
    }
  }

  cardIsValid(card: CardDto): boolean {
    const includesCard = this.validCards.find(
      (x: CardDto) => x.value === card.value && x.suit === card.suit
    );
    if (includesCard) {
      return true;
    }
    return false;
  }

  selectCard(card: CardDto) {
    if (this.canSelectCards) {
      const includesCard = this.selectedCards.find(
        (x: CardDto) => x.value === card.value && x.suit === card.suit
      );

      // Add card to selectedCards
      if (!includesCard) {
        this.selectedCards.push(card);
      }
      // Remove card from selectedCards
      if (includesCard) {
        this.selectedCards = this.selectedCards.filter((x: CardDto) => {
          const foundItem = x.value === card.value && x.suit === card.suit;
          if (foundItem) {
            return false;
          }
          return true;
        });
      }
    }

    // Check if valid
    const hand = this.cardService.determineHand(this.selectedCards);
    if (hand.valid) {
      this.validCards = this.selectedCards;
    } else {
      this.validCards = [];
    }
  }

  attackButtonEnabled(): boolean {
    const validAttackHand =
      this.cardService.determineHand(this.selectedCards).valid ?? false;
    return validAttackHand && this.canSelectCards;
  }

  attack() {
    const hand = this.cardService.determineHand(this.selectedCards);

    if (!hand.valid) {
      this.canSelectCards = true;
      this.pushError('Invalid Attack Hand!');
      return;
    }

    if (!this.enemyTarget) {
      this.setEnemyPlayerHover(this.enemyPlayers[0]);
    }

    this.canSelectCards = false;
    this.attackStarted = true;
    // Valid attack hand, commence battle
    this.initiateBotDefense();
  }

  initiateBotDefense() {
    const botHand: CardDto[] = this.cardService.generateBotDefenseHand(
      this.player2Hand,
      this.selectedCards.length
    );

    setTimeout(() => {
      this.player2Defense = botHand;
      // Play animations for attacking cards
      // Determine winner
    }, 1000);
  }

  pushError(message: string) {
    const ID = this.errorList.length + 1;
    this.errorList.push({ id: ID, message: message });

    setTimeout(() => {
      this.errorListInactive.push(ID);
    }, 1100);
  }
}

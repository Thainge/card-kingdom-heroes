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
import { HandDto } from 'src/app/models/hand';
import {
  DetermineObject,
  DetermineWinnerObject,
} from 'src/app/models/determine';

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
  playerDeck: CardDto[] = [];
  playerHand: CardDto[] = [];
  playerDefense: CardDto[] = [];
  player: Player = { image: './assets/cards/' + 'king_of_hearts2.png' };
  playerTarget: number = 0;
  playerHealth: number = 10;
  playerAttackHand!: DetermineObject;
  playerWinner: boolean = false;
  playerLoser: boolean = false;
  finishedChoosingDefensePlayer: boolean = false;

  selectedEnemyCards: CardDto[] = [];
  enemyDeck: CardDto[] = [];
  enemyHand: CardDto[] = [];
  enemyDefense: CardDto[] = [];
  enemyPlayers: Player[] = [
    { id: 1, image: './assets/cards/' + 'jack_of_spades.png' },
    { id: 2, image: './assets/cards/' + 'queen_of_spades.png' },
    { id: 3, image: './assets/cards/' + 'king_of_spades2.png' },
  ];
  enemyTarget: number = 0;
  enemyHealth: number = 10;
  enemyAttackHand!: DetermineObject;
  enemyWinner: boolean = false;
  enemyLoser: boolean = false;
  enemyAttackStarted: boolean = false;
  showBotCards: boolean = false;
  tie: boolean = false;

  attackEnding: boolean = false;
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
    this.playerDeck = this.cardService.shuffle(Cards);
    this.enemyDeck = this.cardService.shuffle(Cards);

    // Both players draw 5 cards
    for (const num of [0, 0, 0, 0, 0]) {
      // Add to player 1 hand and remove player 1 deck
      // this.player1Hand.push(this.playerDeck[num]);
      // this.playerDeck.push(this.playerDeck[num]);
      // this.playerDeck.shift();
      this.redrawCards.push(this.playerDeck[num]);
      this.playerDeck.push(this.playerDeck[num]);
      this.playerDeck.shift();

      // Add to player 2 hand and remove player 2 deck
      this.enemyHand.push(this.enemyDeck[num]);
      this.enemyDeck.push(this.enemyDeck[num]);
      this.enemyDeck.shift();
    }
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

  enemyCardIsSelected(card: CardDto): boolean {
    const includesCard = this.selectedEnemyCards.find(
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
        this.redrawCards.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
      });

      this.playerHand = this.redrawCards;
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
    const hand: DetermineObject = this.cardService.determineHand(
      this.selectedCards
    );

    if (!hand.valid) {
      this.canSelectCards = true;
      this.pushError('Invalid Attack Hand!');
      return;
    }

    if (!this.enemyTarget) {
      this.setEnemyPlayerHover(this.enemyPlayers[0]);
    }

    this.playerHand = this.playerHand.filter((x) => {
      const includes = this.selectedCards.find(
        (a) => a.suit === x.suit && a.value === x.value
      );
      if (includes) {
        return false;
      }
      return true;
    });

    this.canSelectCards = false;
    this.attackStarted = true;
    // Valid attack hand, commence battle
    this.playerAttackHand = hand;
    this.initiateBotDefense(hand);
  }

  initiateBotDefense(playerHand: DetermineObject) {
    const botHand: DetermineObject = this.cardService.generateBotDefenseHand(
      this.enemyHand,
      this.selectedCards.length
    );

    this.enemyHand = this.enemyHand.filter((x) => {
      const includes = botHand.cards.find(
        (a) => a.suit === x.suit && a.value === x.value
      );
      if (includes) {
        return false;
      }
      return true;
    });

    setTimeout(() => {
      this.enemyAttackHand = botHand;
      this.enemyDefense = botHand.cards;

      // Play animations for attacking cards
      // Determine winner
      const result = this.cardService.determineWinner(playerHand, botHand);
      this.setWinner(result, true);
    }, 1000);
  }

  setWinner(result: DetermineWinnerObject, playerTurn: boolean) {
    // Play confeti on winner
    // Show god rays on winner
    setTimeout(() => {
      // Success!
      if (result.player1Winner) {
        this.playerWinner = true;
        this.enemyLoser = true;
      }

      // Fail
      if (result.player2Winner) {
        this.enemyWinner = true;
        this.playerLoser = true;
      }

      // Tie
      if (result.tie) {
        this.tie = true;
      }
    }, 1500);
    setTimeout(() => {
      this.attackEnding = true;
      setTimeout(() => {
        this.attackStarted = false;
        this.newTurn();
        if (playerTurn) {
          this.startBotTurn();
        }
      }, 1000);
    }, 2500);
  }

  startBotTurn() {
    this.showBotCards = true;
    this.canSelectCards = false;
    // Determine attack hand
    const botHand: DetermineObject = this.cardService.generateBotOffenseHand(
      this.enemyHand
    );

    setTimeout(() => {
      // Select player target
      this.playerTarget = this.player.id!;
    }, 500);

    setTimeout(() => {
      // Select enemy cards
      this.selectedEnemyCards = botHand.cards;
    }, 1500);
    setTimeout(() => {
      // Attack
      this.showBotCards = false;
      this.enemyAttackStarted = true;
      this.canSelectCards = true;
      // Valid attack hand, commence battle
      this.enemyAttackHand = botHand;
      this.enemyDefense = botHand.cards;
    }, 2500);
  }

  chooseDefensePlayerCards() {
    if (this.selectedCards.length !== this.enemyAttackHand.cards.length) {
      this.canSelectCards = true;
      this.pushError(
        'Please Select ' + this.enemyAttackHand.cards.length + ' Cards'
      );
      return;
    }

    this.canSelectCards = false;
    const hand: DetermineObject = this.cardService.determineHand(
      this.selectedCards
    );
    this.playerAttackHand = hand;

    this.playerHand = this.playerHand.filter((x) => {
      const includes = hand.cards.find(
        (a) => a.suit === x.suit && a.value === x.value
      );
      if (includes) {
        return false;
      }
      return true;
    });

    this.finishedChoosingDefensePlayer = true;
    const result = this.cardService.determineWinner(hand, this.enemyAttackHand);
    this.setWinner(result, false);
  }

  newTurn() {
    this.finishedChoosingDefensePlayer = false;
    this.enemyTarget = 0;
    this.playerTarget = 0;
    this.canSelectCards = true;
    this.selectedCards = [];
    this.selectedEnemyCards = [];
    this.attackEnding = false;
    this.playerWinner = false;
    this.playerLoser = false;
    this.enemyLoser = false;
    this.enemyWinner = false;
    this.enemyAttackStarted = false;
    this.tie = false;
    this.enemyDefense = [];
    this.playerAttackHand = { cards: [], highCard: 0, valid: false };
    this.enemyAttackHand = { cards: [], highCard: 0, valid: false };

    const addLength = 5 - this.playerHand.length;
    const addArr = Array.from(Array(addLength).keys());
    addArr.forEach((x, i) => {
      this.playerHand.push(this.playerDeck[0]);
      this.playerDeck.push(this.playerDeck[0]);
      this.playerDeck.shift();
    });

    const addLengthEnemy = 5 - this.enemyHand.length;
    const addArrEnemy = Array.from(Array(addLengthEnemy).keys());
    addArrEnemy.forEach((x, i) => {
      this.enemyHand.push(this.enemyDeck[0]);
      this.enemyDeck.push(this.enemyDeck[0]);
      this.enemyDeck.shift();
    });
  }

  pushError(message: string) {
    const ID = this.errorList.length + 1;
    this.errorList.push({ id: ID, message: message });

    setTimeout(() => {
      this.errorListInactive.push(ID);
    }, 1100);
  }
}

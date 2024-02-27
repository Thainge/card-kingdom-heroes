import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { CardDto } from 'src/app/models/card';
import { CardService } from 'src/app/services/cardService';
import { Cards } from 'src/assets/data/cards';
import {
  fadeInUpOnEnterAnimation,
  fadeOutUpOnLeaveAnimation,
  zoomInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
  flipInYOnEnterAnimation,
  fadeOutDownOnLeaveAnimation,
  fadeInDownOnEnterAnimation,
  fadeInLeftOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeOutLeftOnLeaveAnimation,
  fadeOutRightOnLeaveAnimation,
} from 'angular-animations';
import { PlayerDto } from 'src/app/models/player';
import {
  DetermineObject,
  DetermineWinnerObject,
} from 'src/app/models/determine';
import { DOCUMENT } from '@angular/common';
import 'leader-line';
import { CharacterCardComponent } from 'src/app/components/character-card/character-card.component';
declare let LeaderLine: any;

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  animations: [
    fadeOutUpOnLeaveAnimation({ anchor: 'fadeUpLeave' }),
    fadeInUpOnEnterAnimation({ anchor: 'fadeUpEnter' }),

    fadeOutLeftOnLeaveAnimation({ anchor: 'fadeLeftLeave' }),
    fadeInLeftOnEnterAnimation({ anchor: 'fadeLeftEnter' }),

    fadeOutRightOnLeaveAnimation({ anchor: 'fadeRightLeave' }),
    fadeInRightOnEnterAnimation({ anchor: 'fadeRightEnter' }),

    fadeInDownOnEnterAnimation({ anchor: 'fadeDownEnter' }),
    fadeOutDownOnLeaveAnimation({ anchor: 'fadeDownLeave' }),

    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    flipInYOnEnterAnimation({ anchor: 'flipInYonEnter' }),
  ],
})
export class BattleComponent implements OnInit {
  playerDeck: CardDto[] = [];
  playerHand: CardDto[] = [];
  playerDefense: CardDto[] = [];
  player: PlayerDto = {
    id: 5,
    image: './assets/' + 'link.png',
    name: 'Link',
    attack: 2,
    health: 9,
    baseHealth: 9,
  };
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
  enemyPlayers: PlayerDto[] = [
    {
      id: 1,
      image: './assets/' + 'link.png',
      name: 'Link',
      attack: 2,
      health: 4,
      baseHealth: 4,
    },
    {
      id: 2,
      image: './assets/' + 'link.png',
      name: 'Link',
      attack: 4,
      health: 2,
      baseHealth: 2,
    },
    {
      id: 3,
      image: './assets/' + 'link.png',
      name: 'Link',
      attack: 1,
      health: 7,
      baseHealth: 7,
    },
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

  canDefendWithMultipleCards: boolean = false;
  hasWildCards: boolean = true;
  wildCards: CardDto[] = [];
  alwaysWinTies: boolean = false;
  canSeeTopCard: boolean = false;
  topRedrawCard: number = 0;

  constructor(
    private cardService: CardService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.enemyDeck = this.cardService.shuffle(Cards);
    // Wild cards
    const redWildCard: CardDto = {
      id: 53,
      wild: true,
      suit: 'hearts',
      value: '2',
      image: 'red_joker.png',
    };
    const blackWildCard: CardDto = {
      id: 54,
      wild: true,
      suit: 'spades',
      value: '2',
      image: 'black_joker.png',
    };
    this.wildCards = [redWildCard, blackWildCard];

    let playerCards = Cards;
    this.wildCards.forEach((x) => {
      playerCards.push(x);
    });

    // Shuffle player decks
    this.playerDeck = this.cardService.shuffle(Cards);

    // Both players draw 5 cards
    for (const num of [0, 1, 2, 3, 4]) {
      // Add to player 1 hand and remove player 1 deck
      this.redrawCards.push(this.playerDeck[0]);
      this.playerDeck.push(this.playerDeck[0]);
      this.playerDeck.shift();

      // Add to player 2 hand and remove player 2 deck
      this.enemyHand.push(this.enemyDeck[0]);
      this.enemyDeck.push(this.enemyDeck[0]);
      this.enemyDeck.shift();
    }
    this.topRedrawCard = 0;
    setTimeout(() => {
      this.topRedrawCard = this.playerDeck[0].id!;
    }, 400);

    // this.enemyHand = [this.redrawCards[1]];
    // this.selectedCards = [this.redrawCards[0]];
    // this.redrawHide = true;
    // this.redrawing = false;
    // this.attack();

    this.canDefendWithMultipleCards = true;
    // this.alwaysWinTies = true;
    // this.canSeeTopCard = true;
  }

  ngAfterViewInit() {
    // const cards = this.document.getElementsByClassName(
    //   'playerBottomCard'
    // ) as HTMLCollection;
    // console.log(cards);
    // new LeaderLine(
    //   LeaderLine.mouseHoverAnchor(),
    //   this.document.getElementById('toptest')
    // ),
    //   {
    //     startPlugColor: '#1a6be0',
    //     endPlugColor: '#1efdaa',
    //     gradient: true,
    //     dropShadow: true,
    //     dash: { animation: true },
    //     hide: true,
    //     duration: 300,
    //     timing: 'linear',
    //     endPlug: 'arrow3',
    //   };
  }

  cardIsSelected(card: CardDto): boolean {
    const includesCard = this.selectedCards.find(
      (x: CardDto) => x.id === card.id
    );

    if (includesCard) {
      // Test lines
      return true;
    }
    return false;
  }

  wildCardChange(scroll: any, card: CardDto) {
    if (scroll.deltaY === -100 && card.wild) {
      // scroll up
      const value = Number(card.value) + 1;
      if (value < 15) {
        const newCard: CardDto = {
          ...Cards.find(
            (a) => a.suit === card.suit && a.value === value.toString()
          ),
          id: card.id,
          wild: true,
        };
        this.playerHand = this.playerHand.map((x) => {
          if (x.suit === card.suit && x.value === card.value && x.wild) {
            return newCard;
          }

          return x;
        });
      }
    } else if (card.wild) {
      // scroll down
      const value = Number(card.value) - 1;
      if (value > 1) {
        const newCard: CardDto = {
          ...Cards.find(
            (a) => a.suit === card.suit && a.value === value.toString()
          ),
          id: card.id,
          wild: true,
        };
        this.playerHand = this.playerHand.map((x) => {
          if (x.suit === card.suit && x.value === card.value && x.wild) {
            return newCard;
          }

          return x;
        });
      }
    }

    // Check if valid
    this.selectedCards = this.selectedCards.map((x) => {
      const foundCard = this.playerHand.find((a) => a.id === x.id);

      if (foundCard) {
        return foundCard;
      }

      return x;
    });
    const hand = this.cardService.determineHand(this.selectedCards);
    if (hand.valid) {
      this.validCards = this.selectedCards;
    } else {
      this.validCards = [];
    }
  }

  enemyCardIsSelected(card: CardDto): boolean {
    const includesCard = this.selectedEnemyCards.find(
      (x: CardDto) => x.id === card.id
    );
    if (includesCard) {
      return true;
    }
    return false;
  }

  setEnemyPlayerHover(card: PlayerDto) {
    if (card.id === this.enemyTarget) {
      this.enemyTarget = 0;
    } else {
      this.enemyTarget = card.id ?? 0;
    }
  }

  findEnemyPlayer(): PlayerDto {
    return this.enemyPlayers.find((x) => x.id === this.enemyTarget)!;
  }

  findEnemyPlayerAttack(): PlayerDto {
    return this.enemyPlayers.find((x) => x.health > 0)!;
  }

  redrawCardIsSelected(card: CardDto): boolean {
    const includesCard = this.redrawSelectedCards.find(
      (x: CardDto) => x.id === card.id
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
      const foundCard = this.redrawSelectedCards.find((a) => a.id === x.id);
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
      this.topRedrawCard = 0;
      setTimeout(() => {
        this.topRedrawCard = this.playerDeck[0].id!;
      }, 400);

      this.playerHand = this.redrawCards;
    }, 900);
  }

  selectRedrawCard(card: CardDto) {
    const includesCard = this.redrawSelectedCards.find(
      (x: CardDto) => x.id === card.id
    );

    // Add card to selectedCards
    if (!includesCard && this.redrawSelectedCards.length < 2) {
      this.redrawSelectedCards.push(card);
    }
    // Remove card from selectedCards
    if (includesCard) {
      this.redrawSelectedCards = this.redrawSelectedCards.filter(
        (x: CardDto) => {
          const foundItem = x.id === card.id;
          if (foundItem) {
            return false;
          }
          return true;
        }
      );
    }
  }

  cardIsValid(card: CardDto): boolean {
    const includesCard = this.validCards.find((x: CardDto) => x.id === card.id);
    if (includesCard) {
      return true;
    }
    return false;
  }

  trackById = (index: number, item: CardDto) => item.id;

  selectCard(card: CardDto) {
    if (this.canSelectCards) {
      const includesCard = this.selectedCards.find(
        (x: CardDto) => x.id === card.id
      );

      // Add card to selectedCards
      if (!includesCard) {
        this.selectedCards.push(card);
      }
      // Remove card from selectedCards
      if (includesCard) {
        this.selectedCards = this.selectedCards.filter((x: CardDto) => {
          const foundItem = x.id === card.id;
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
      const includes = this.selectedCards.find((a) => a.id === x.id);
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
      const includes = botHand.cards.find((a) => a.id === x.id);
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

  async numbersGoDownIncrementally(
    currentHealth: number,
    newHealth: number,
    isAttackingPlayer: boolean = false
  ) {
    await this.timeout(2500);
    if (isAttackingPlayer) {
      // Player goes down
      const difference = currentHealth - newHealth;
      const differentArr = Array.from(Array(difference).keys());

      for await (const i of differentArr) {
        const updateHealth = currentHealth - (i + 1);
        await this.timeout(100 * i);
        this.player.health = updateHealth;
      }
    } else {
      const difference = currentHealth - newHealth;
      const foundIndex = this.enemyPlayers.findIndex(
        (x) => x.id === this.enemyTarget
      );

      const differentArr = Array.from(Array(difference).keys());

      for await (const i of differentArr) {
        const updateHealth = currentHealth - (i + 1);
        await this.timeout(100 * i);
        this.enemyPlayers[foundIndex] = {
          ...this.enemyPlayers[foundIndex],
          health: updateHealth,
        };
      }
    }
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async setWinner(result: DetermineWinnerObject, playerTurn: boolean) {
    setTimeout(() => {
      if (playerTurn) {
        this.combatFinishPlayer(result);
      } else {
        this.combatFinishBot(result);
      }
    }, 1500);
  }

  async combatFinishPlayer(result: DetermineWinnerObject) {
    // Player finishes combat

    // If player won combat, attack selected opponent
    if (result.player1Winner) {
      this.playerWinner = true;
      this.enemyLoser = true;
      for await (const x of this.enemyPlayers) {
        if (x.id === this.enemyTarget) {
          const incomingAttackPower =
            result.player1Determine.power! + this.player.attack;
          const newHealth = x.health - incomingAttackPower;
          await this.numbersGoDownIncrementally(x.health, newHealth);
        }
      }
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

    await this.timeout(1000);
    this.attackEnding = true;
    await this.timeout(1000);
    this.attackStarted = false;
    this.newTurn();
    this.startBotTurn();
  }

  async combatFinishBot(result: DetermineWinnerObject) {
    // Bot finishes combat

    // If bot won combat, attack player
    if (result.player1Winner) {
      this.playerWinner = true;
      this.enemyLoser = true;
    }

    // Fail
    if (result.player2Winner) {
      this.enemyWinner = true;
      this.playerLoser = true;
      this.player.health = this.player.health - result.player2Determine.power!;
      const foundAttacker = this.enemyPlayers.find((x) => x.health > 0)!;

      const incomingAttackPower =
        result.player2Determine.power! + foundAttacker.attack;
      const newHealth = this.player.health - incomingAttackPower;
      await this.numbersGoDownIncrementally(
        this.player.health,
        newHealth,
        true
      );
      // this.player = { ...this.player, health: newHealth };
    }

    // Tie
    if (result.tie) {
      this.tie = true;
    }

    console.log('finishing');
    await this.timeout(1000);
    this.attackEnding = true;
    await this.timeout(1000);
    this.attackStarted = false;
    this.newTurn();
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
    if (
      this.selectedCards.length !== this.enemyAttackHand.cards.length &&
      !this.canDefendWithMultipleCards
    ) {
      this.canSelectCards = true;
      this.pushError(
        'Please Select ' + this.enemyAttackHand.cards.length + ' Cards'
      );
      return;
    }

    if (
      this.canDefendWithMultipleCards &&
      this.selectedCards.length < this.enemyAttackHand.cards.length
    ) {
      this.canSelectCards = true;
      this.pushError(
        'Please Select At Least ' + this.enemyAttackHand.cards.length + ' Cards'
      );
      return;
    }

    this.canSelectCards = false;
    const hand: DetermineObject = this.cardService.determineHand(
      this.selectedCards
    );
    this.playerAttackHand = hand;

    this.enemyHand = this.enemyHand.filter((x) => {
      const includes = this.enemyHand.find((a) => a.id === x.id);
      if (includes) {
        return false;
      }
      return true;
    });
    this.playerHand = this.playerHand.filter((x) => {
      const includes = hand.cards.find((a) => a.id === x.id);
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
    this.topRedrawCard = 0;
    setTimeout(() => {
      this.topRedrawCard = this.playerDeck[0].id!;
    }, 400);

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

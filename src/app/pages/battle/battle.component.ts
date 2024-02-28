import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
      health: 0,
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

  activeLeaderLines: any[] = [];
  wrappingTurn: boolean = false;

  @ViewChildren('myActiveCards')
  myActiveCards: QueryList<ElementRef> | undefined;

  @ViewChildren('activeEnemyCards') activeEnemyCards:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren('enemyPlayerRef') enemyPlayerRef:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren('playerRef') playerRef: QueryList<ElementRef> | undefined;
  @ViewChild('enemyAttackCardsRef') enemyAttackCardsRef: ElementRef | undefined;

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
      wildRange: 1,
      wildSuit: false,
      suit: 'hearts',
      value: '10',
      wildInitial: '10',
      image: '10_of_hearts.png',
    };

    // Wild Suit && wild range 2
    const blackWildCard: CardDto = {
      id: 54,
      wild: true,
      wildRange: 2,
      wildSuit: true,
      suit: 'spades',
      value: '10',
      wildInitial: '10',
      image: '10_of_spades.png',
    };

    // Everything
    const blackWildCard2: CardDto = {
      id: 55,
      wild: true,
      wildRange: 14,
      wildSuit: true,
      suit: 'spades',
      value: '5',
      wildInitial: '5',
      image: '5_of_spades.png',
    };
    // this.wildCards = [redWildCard, blackWildCard];

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
    this.redrawHide = true;
    this.redrawing = false;
    this.playerHand = this.redrawCards;
    // this.attack();

    this.canDefendWithMultipleCards = true;
    this.alwaysWinTies = true;
    this.canSeeTopCard = true;

    this.redrawCards[0] = redWildCard;
    this.redrawCards[1] = blackWildCard;
    this.redrawCards[2] = blackWildCard2;
    // this.attackStarted = false;
    // this.enemyAttackStarted = false;
    // this.playerHand = this.enemyHand;
    // this.selectedEnemyCards = [this.enemyHand[0]];
    // this.redrawHide = true;
    // this.redrawing = false;
    // this.canSelectCards = false;
    // this.startBotTurn();

    setTimeout(() => {
      this.player.health = 0;
    }, 1500);
  }

  ngAfterViewInit() {}

  @HostListener('document:keypress', ['$event'])
  giveHint(event: KeyboardEvent) {
    // this.key = event.key;
    if (event.key && event.key.toLowerCase() === 'h') {
      const playerBestHand: DetermineObject =
        this.cardService.generateBotOffenseHand(this.playerHand);
      this.validCards = playerBestHand.cards;
    }
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

  chooseWildSuit(event: any, card: CardDto, suit: string) {
    event.stopPropagation();
    event.preventDefault();

    // Find card with same value and different suit
    const newCard = {
      ...card,
      suit: suit,
      image: card.value + '_of_' + suit + '.png',
    };
    this.playerHand = this.playerHand.map((x) => {
      if (x.id === card.id) {
        return newCard;
      }

      return x;
    });
  }

  wildCardScrollChange(scroll: any, card: CardDto) {
    // wild?: boolean; true || false
    // wildRange?: number; 1 || 2 || 14
    // wildSuit?: boolean; true || false

    // Wild, ability to scroll card with limited range
    if (scroll.deltaY === -100 && card.wild) {
      // scroll up
      const value = Number(card.value) + 1;
      const initialValue = Math.abs(Number(card.wildInitial) - value) - 1;

      if (value < 15 && initialValue < Number(card.wildRange)) {
        const newCard: CardDto = {
          ...Cards.find(
            (a) => a.suit === card.suit && a.value === value.toString()
          ),
          wildInitial: card.wildInitial,
          wildRange: card.wildRange,
          wildSuit: card.wildSuit,
          id: card.id,
          wild: true,
        };
        this.playerHand = this.playerHand.map((x) => {
          if (x.id === card.id) {
            return newCard;
          }

          return x;
        });
      }
    } else if (card.wild) {
      // scroll down
      const value = Number(card.value) - 1;
      const initialValue = Math.abs(Number(card.wildInitial) - value) - 1;

      if (value > 1 && initialValue < Number(card.wildRange)) {
        const newCard: CardDto = {
          ...Cards.find(
            (a) => a.suit === card.suit && a.value === value.toString()
          ),
          wildInitial: card.wildInitial,
          wildRange: card.wildRange,
          wildSuit: card.wildSuit,
          id: card.id,
          wild: true,
        };
        this.playerHand = this.playerHand.map((x) => {
          if (x.id === card.id) {
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

  setEnemyPlayerHoverTarget(card: PlayerDto) {
    if (card && card.id !== this.enemyTarget && this.canSelectCards) {
      this.enemyTarget = card.id;
      const hand = this.cardService.determineHand(this.selectedCards);
      this.setAttackArrowsPlayer(hand.valid);
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
        if (this.selectedCards.length === 5) {
          this.pushError('Max 5 cards');
          return;
        }
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

    if (this.enemyAttackStarted && hand.valid) {
      this.validCards = this.selectedCards;
    } else if (this.enemyAttackStarted) {
      this.validCards = [];
    }

    if (hand.valid && !this.enemyAttackStarted) {
      this.validCards = this.selectedCards;
      this.setAttackArrowsPlayer(true);
    } else if (!this.enemyAttackStarted) {
      this.setAttackArrowsPlayer(false);
      this.validCards = [];
    }
  }

  setAttackArrowsPlayer(valid: boolean) {
    if (this.enemyTarget === 0) {
      const foundValidEnemy = this.findEnemyPlayerAttack();
      this.enemyTarget = foundValidEnemy.id;
    }

    setTimeout(() => {
      let foundTarget: ElementRef | null;
      this.enemyPlayerRef?.forEach((x) => {
        if (x.nativeElement.className.includes('errorEnemyBorder')) {
          foundTarget = x.nativeElement;
        }
      });
      const myNewActiveLines: any[] = [];
      this.myActiveCards?.forEach((x) => {
        if (x.nativeElement.className.includes('activeCard')) {
          const myLineOptions: any = {
            dash: { animation: true },
            endSocket: 'bottom',
            startSocket: 'top',
            dropShadow: true,
            gradient: {
              startColor: valid
                ? 'rgba(0, 255, 0, 0.281)'
                : 'rgba(255, 0, 0, 0.281)',
              endColor: valid ? 'rgb(0, 255, 0)' : 'rgb(228, 35, 35)',
            },
            animOptions: {
              duration: 30,
              timing: 'linear',
            },
            hide: true,
            endPlug: 'arrow3',
            endPlugColor: valid ? 'rgb(0, 255, 0)' : 'rgb(228, 35, 35)',
          };
          let myNewLine: any = new LeaderLine(
            x.nativeElement,
            foundTarget,
            myLineOptions
          );
          myNewLine.show('draw', { duration: 200, timing: 'linear' });
          myNewActiveLines.push(myNewLine);
        }
      });
      this.activeLeaderLines.forEach((x) => {
        x.hide('fade', { duration: 100, timing: 'linear' });
        setTimeout(() => {
          x.remove();
        }, 100);
      });
      this.activeLeaderLines = myNewActiveLines;
    }, 150);
  }

  setAttackArrowsEnemy() {
    this.playerTarget = this.player.id;

    setTimeout(() => {
      let foundTarget: ElementRef | null;
      this.playerRef?.forEach((x) => {
        if (x.nativeElement.className.includes('errorEnemyBorder')) {
          foundTarget = x.nativeElement;
        }
      });
      const myNewActiveLines: any[] = [];
      this.activeEnemyCards?.forEach((x) => {
        if (x.nativeElement.className.includes('activeEnemyCard')) {
          const myLineOptions: any = {
            dash: { animation: true },
            endSocket: 'top',
            startSocket: 'bottom',
            dropShadow: true,
            gradient: {
              startColor: 'rgba(0, 255, 0, 0.281)',
              endColor: 'rgb(0, 255, 0)',
            },
            animOptions: {
              duration: 30,
              timing: 'linear',
            },
            hide: true,
            endPlug: 'arrow3',
            endPlugColor: 'rgb(0, 255, 0)',
          };
          let myNewLine: any = new LeaderLine(
            x.nativeElement,
            foundTarget,
            myLineOptions
          );
          myNewLine.show('draw', { duration: 200, timing: 'linear' });
          myNewActiveLines.push(myNewLine);
        }
      });
      this.activeLeaderLines.forEach((x) => {
        x.hide('fade', { duration: 100, timing: 'linear' });
        setTimeout(() => {
          x.remove();
        }, 100);
      });
      this.activeLeaderLines = myNewActiveLines;
    }, 150);
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

    this.playerHand = this.playerHand.filter((x) => {
      const includes = this.selectedCards.find((a) => a.id === x.id);
      if (includes) {
        return false;
      }
      return true;
    });

    this.canSelectCards = false;
    this.attackStarted = true;
    this.activeLeaderLines.forEach((x) => {
      x.hide('fade', { duration: 100, timing: 'linear' });
      setTimeout(() => {
        x.remove();
      }, 100);
    });
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
    const enemyTarget = this.enemyTarget;
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
        (x) => x.id === enemyTarget
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
    this.wrappingTurn = true;
    return await this.timeout(1000);
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
          const incomingAttackPower = result.player1Determine.power!;
          const newHealth = x.health - incomingAttackPower;
          console.log(
            'Player Wins Attack: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          await this.numbersGoDownIncrementally(x.health, newHealth);
        }
      }
    }

    // Fail
    if (result.player2Winner) {
      this.enemyWinner = true;
      this.playerLoser = true;

      const incomingAttackPower = this.enemyDefense.length;
      const newHealth = this.player.health - incomingAttackPower;
      console.log(
        'Bot Defended: Attacking player for ' + incomingAttackPower + ' damage'
      );
      await this.numbersGoDownIncrementally(
        this.player.health,
        newHealth,
        true
      );
    }

    // Tie
    if (result.tie) {
      this.tie = true;
    }

    // Always win ties enabled? win
    if (result.tie && this.alwaysWinTies) {
      this.tie = false;
      this.playerWinner = true;
      this.enemyLoser = true;
      for await (const x of this.enemyPlayers) {
        if (x.id === this.enemyTarget) {
          const incomingAttackPower = result.player1Determine.power!;
          const newHealth = x.health - incomingAttackPower;
          console.log(
            'Player Wins Attack: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          await this.numbersGoDownIncrementally(x.health, newHealth);
        }
      }
    }

    this.attackEnding = true;
    await this.timeout(1000);
    this.attackStarted = false;
    this.newTurn();
    this.startBotTurn();
  }

  async combatFinishBot(result: DetermineWinnerObject) {
    // Bot finishes combat

    // Success, player defended
    if (result.player1Winner) {
      this.playerWinner = true;
      this.enemyLoser = true;
      // Attack bot for 1 damage
      this.enemyTarget = this.findEnemyPlayerAttack().id;
      for await (const x of this.enemyPlayers) {
        if (x.id === this.enemyTarget) {
          const incomingAttackPower = this.selectedCards.length;
          console.log(
            'Player Defended: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          const newHealth = x.health - incomingAttackPower;
          await this.numbersGoDownIncrementally(x.health, newHealth);
        }
      }
    }

    // Fail, bot wins
    if (result.player2Winner) {
      this.enemyWinner = true;
      this.playerLoser = true;

      const incomingAttackPower = result.player2Determine.power!;
      const newHealth = this.player.health - incomingAttackPower;
      console.log(
        'Bot Wins Attack: Attacking player for ' +
          incomingAttackPower +
          ' damage'
      );
      await this.numbersGoDownIncrementally(
        this.player.health,
        newHealth,
        true
      );
    }

    // Tie
    if (result.tie) {
      this.tie = true;
    }

    // Always win ties enabled? win
    if (result.tie && this.alwaysWinTies) {
      this.tie = false;
      this.playerWinner = true;
      this.enemyLoser = true;
      // Attack bot for 1 damage
      this.enemyTarget = this.findEnemyPlayerAttack().id;
      for await (const x of this.enemyPlayers) {
        if (x.id === this.enemyTarget) {
          const incomingAttackPower = this.selectedCards.length;
          console.log(
            'Player Defended: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          const newHealth = x.health - incomingAttackPower;
          await this.numbersGoDownIncrementally(x.health, newHealth);
        }
      }
    }

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
      this.playerTarget = this.player.id;
      this.selectedEnemyCards = botHand.cards;
      this.setAttackArrowsEnemy();
    }, 1500);

    setTimeout(() => {
      // Attack
      this.showBotCards = false;
      this.enemyAttackStarted = true;
      this.canSelectCards = true;
      this.activeLeaderLines.forEach((x) => {
        x.hide('fade', { duration: 100, timing: 'linear' });
        setTimeout(() => {
          x.remove();
        }, 100);
      });
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
    this.activeLeaderLines = [];
    this.playerAttackHand = { cards: [], highCard: 0, valid: false };
    this.enemyAttackHand = { cards: [], highCard: 0, valid: false };

    setTimeout(() => {
      this.wrappingTurn = false;
    }, 1000);

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

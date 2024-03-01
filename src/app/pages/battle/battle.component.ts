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
import { CardService } from 'src/app/services/card.service';
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
import 'leader-line';
import { playerService } from 'src/app/services/player.service';
import { gameTheme } from 'src/app/models/theme';
import { CheatDto } from 'src/app/models/cheat';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
declare let LeaderLine: any;

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('cardLeaving', [
      transition(':leave', [
        style({ width: '12%' }),
        animate('.5s ease-in', style({ width: '0%' })),
      ]),
    ]),

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
    id: 0,
    health: 1,
    attack: 1,
    image: '',
    name: '',
    baseHealth: 1,
  };
  playerTarget: number = 0;
  playerHealth: number = 10;
  playerAttackHand: DetermineObject = {
    valid: false,
    highCard: 0,
    cards: [],
  };
  playerWinner: boolean = false;
  playerLoser: boolean = false;
  finishedChoosingDefensePlayer: boolean = false;

  selectedEnemyCards: CardDto[] = [];
  enemyDeck: CardDto[] = [];
  enemyHand: CardDto[] = [];
  enemyDefense: CardDto[] = [];
  enemyPlayers: PlayerDto[] = [];
  enemyTarget: number = 0;
  enemyHealth: number = 10;
  enemyAttackHand: DetermineObject = {
    valid: false,
    highCard: 0,
    cards: [],
  };
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
  specialAbilityList: any[] = [];
  specialAbilityListInactive: any[] = [];
  messageList: any[] = [];
  messageListInactive: any[] = [];

  attackStarted: boolean = false;

  canDefendWithMultipleCards: boolean = false;
  hasWildCards: boolean = true;
  wildCards: CardDto[] = [];
  alwaysWinTies: boolean = false;
  canSeeTopCard: boolean = false;
  topRedrawCard: number = 0;

  activeLeaderLines: any[] = [];
  staticEnemyTarget: number = 0;
  wrappingTurn: boolean = false;
  doingWildCardChange: boolean = false;

  usedSpecialCardThisTurn: boolean = false;

  gameThemePath: gameTheme = 'default';
  Cards: CardDto[] = [];
  completedEnemyTurns: number[] = [];
  currentEnemyTurn: PlayerDto = {
    id: 0,
    health: 1,
    attack: 1,
    image: '',
    name: '',
    baseHealth: 1,
  };

  @ViewChildren('myActiveCards')
  myActiveCards: QueryList<ElementRef> | undefined;

  @ViewChildren('activeEnemyCards') activeEnemyCards:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren('enemyPlayerRef') enemyPlayerRef:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren('playerRef') playerRef: QueryList<ElementRef> | undefined;
  @ViewChild('enemyDefenseRef') enemyDefenseRef: ElementRef | undefined;

  constructor(
    private cardService: CardService,
    private userService: playerService
  ) {}

  ngOnInit() {
    // Get game theme
    this.userService.gameTheme$.subscribe((x) => {
      this.gameThemePath = x;
      this.player = {
        id: 5,
        image: './assets/' + this.gameThemePath + '/' + 'link.png',
        name: 'Link',
        attack: 2,
        health: 9,
        baseHealth: 9,
      };
      this.enemyPlayers = [
        {
          id: 1,
          image: './assets/' + this.gameThemePath + '/' + 'link.png',
          name: 'Link',
          attack: 2,
          health: 4,
          baseHealth: 4,
        },
        {
          id: 2,
          image: './assets/' + this.gameThemePath + '/' + 'link.png',
          name: 'Link',
          attack: 1,
          health: 2,
          baseHealth: 2,
        },
        {
          id: 3,
          image: './assets/' + this.gameThemePath + '/' + 'link.png',
          name: 'Link',
          attack: 0,
          health: 3,
          baseHealth: 3,
        },
      ];

      if (this.Cards.length < 1) {
        this.importCardsData();
      }
    });

    // this.wildCards = [redWildCard, blackWildCard];

    // this.enemyHand = [this.redrawCards[1]];
    // this.selectedCards = [this.redrawCards[0]];
    // this.redrawHide = true;
    // this.redrawing = false;
    // this.redrawCards[0] = redWildCard;
    // this.redrawCards[1] = blackWildCard;
    // this.redrawCards[2] = blackWildCard2;
    // this.redrawCards[3] = blackWildCard2;
    // this.redrawCards[4] = blackWildCard2;
    // this.playerHand = this.redrawCards;
    // this.selectedCards = this.redrawCards;
    // this.enemyTarget = this.enemyPlayers[0].id;
    // this.attack();

    // this.attackStarted = false;
    // this.enemyAttackStarted = false;
    // this.playerHand = this.enemyHand;
    // this.selectedEnemyCards = [this.enemyHand[0]];
    // this.redrawHide = true;
    // this.redrawing = false;
    // this.canSelectCards = false;
    // this.startBotTurn();
  }

  gameInit() {
    // Cheats
    const cheats: CheatDto = this.userService.getPlayerCheats();
    this.canDefendWithMultipleCards = cheats.canDefendWithMultipleCards;
    this.alwaysWinTies = cheats.alwaysWinTies;
    this.canSeeTopCard = cheats.canSeeTopCard;

    // Add wildcards to deck
    let playerCards = this.Cards;
    const wildCards: CardDto[] = this.userService.getPlayerWildCards();
    wildCards.forEach((x) => {
      playerCards.push(x);
    });

    // Shuffle player decks
    this.playerDeck = this.cardService.shuffle(this.Cards);
    this.enemyDeck = this.cardService.shuffle(this.Cards);

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
      if (this.playerDeck[0] && this.playerDeck[0].id) {
        this.topRedrawCard = this.playerDeck[0].id;
      }
    }, 400);

    // this.redrawing = false;
    // this.redrawHide = true;
    // this.playerHand = this.redrawCards;
  }

  @HostListener('document:keypress', ['$event'])
  giveHint(event: KeyboardEvent) {
    if (event.key && event.key.toLowerCase() === 'h') {
      const playerBestHand: DetermineObject =
        this.cardService.generateBotOffenseHand(this.playerHand);
      this.validCards = playerBestHand.cards;
    }
  }

  async importCardsData() {
    import(`src/assets/${this.gameThemePath}/data/cards.ts`).then((data) => {
      this.Cards = data.Cards;
      this.gameInit();
    });
  }

  useSpecialAbilityCard() {
    this.usedSpecialCardThisTurn = true;
    this.pushSpecialAbilityImage('Test test test');
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
    if (this.doingWildCardChange || !card.wild) {
      return;
    }

    // Wild, ability to scroll card with limited range
    this.doingWildCardChange = true;
    if (scroll.deltaY === -100 && card.wild) {
      // scroll up
      const value = Number(card.value) + 1;
      const initialValue = Math.abs(Number(card.wildInitial) - value) - 1;

      if (value < 15 && initialValue < Number(card.wildRange)) {
        const newCard: CardDto = {
          ...this.Cards.find(
            (a: CardDto) => a.suit === card.suit && a.value === value.toString()
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
          ...this.Cards.find(
            (a: CardDto) => a.suit === card.suit && a.value === value.toString()
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
    this.doingWildCardChange = false;
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
      this.staticEnemyTarget = this.enemyTarget;
      const hand = this.cardService.determineHand(this.selectedCards);
      this.setAttackArrowsPlayer(hand.valid);
    }
  }

  findEnemyPlayer(): PlayerDto {
    const enemyPlayer = this.enemyPlayers.find(
      (x) => x.id === this.enemyTarget
    );
    return (
      enemyPlayer ?? {
        id: 0,
        health: 1,
        attack: 1,
        image: '',
        name: '',
        baseHealth: 1,
      }
    );
  }

  findEnemyPlayerAttack(): PlayerDto {
    const enemyPlayer = this.currentEnemyTurn;
    return (
      enemyPlayer ?? {
        id: 0,
        health: 1,
        attack: 1,
        image: '',
        name: '',
        baseHealth: 1,
      }
    );
  }

  findStaticEnemyPlayer(): PlayerDto {
    const enemyPlayer = this.enemyPlayers.find(
      (x) => x.id === this.staticEnemyTarget
    );
    return (
      enemyPlayer ?? {
        id: 0,
        health: 1,
        attack: 1,
        image: '',
        name: '',
        baseHealth: 1,
      }
    );
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
      this.pushMessage('Player Turn');
    }, 2500);

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
        if (this.playerDeck[0] && this.playerDeck[0].id) {
          this.topRedrawCard = this.playerDeck[0].id;
        }
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

    // if (this.enemyAttackStarted && hand.valid) {
    //   this.validCards = this.selectedCards;
    //   this.setDefendArrowsPlayer(true);
    // } else if (this.enemyAttackStarted) {
    //   this.validCards = [];
    //   this.setDefendArrowsPlayer(false);
    // }

    if (hand.valid && !this.enemyAttackStarted) {
      this.validCards = this.selectedCards;
      this.setAttackArrowsPlayer(true);
    } else if (!this.enemyAttackStarted) {
      this.setAttackArrowsPlayer(false);
      this.validCards = [];
    }
  }

  async setDefendArrowsPlayer(valid: boolean) {
    // this.activeLeaderLines = [];
    // const foundTarget: ElementRef = this.enemyDefenseRef?.nativeElement;
    // const myNewActiveLines: any[] = [];
    // this.myActiveCards?.forEach((x) => {
    //   if (x.nativeElement.className.includes('activeCard')) {
    //     const myLineOptions: any = {
    //       dash: { animation: true },
    //       endSocket: 'bottom',
    //       startSocket: 'top',
    //       dropShadow: true,
    //       gradient: {
    //         startColor: valid
    //           ? 'rgba(0, 255, 0, 0.281)'
    //           : 'rgba(255, 0, 0, 0.281)',
    //         endColor: valid ? 'rgb(0, 255, 0)' : 'rgb(228, 35, 35)',
    //       },
    //       animOptions: {
    //         duration: 30,
    //         timing: 'linear',
    //       },
    //       hide: true,
    //       endPlug: 'arrow3',
    //       endPlugColor: valid ? 'rgb(0, 255, 0)' : 'rgb(228, 35, 35)',
    //     };
    //     let myNewLine: any = new LeaderLine(
    //       x.nativeElement,
    //       foundTarget,
    //       myLineOptions
    //     );
    //     myNewLine.show('draw', { duration: 200, timing: 'linear' });
    //     myNewActiveLines.push(myNewLine);
    //   }
    // });
    // for await (const x of this.activeLeaderLines) {
    //   x.hide('fade', { duration: 100, timing: 'linear' });
    //   setTimeout(() => {
    //     x.remove();
    //   }, 100);
    // }
    // await this.timeout(300);
    // this.activeLeaderLines = myNewActiveLines;
  }

  setAttackArrowsPlayer(valid: boolean) {
    const foundValidEnemy = this.enemyPlayers.find((x) => x.health > 1);
    if (this.enemyTarget === 0 && foundValidEnemy) {
      this.enemyTarget = foundValidEnemy.id;
      this.staticEnemyTarget = this.enemyTarget;
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
    const addLengthEnemy = this.enemyPlayers.find(
      (x) => x.id === this.currentEnemyTurn.id
    )?.attack;
    const addArrEnemy = Array.from(Array(addLengthEnemy).keys());
    addArrEnemy.forEach((x, i) => {
      this.enemyHand.push(this.enemyDeck[0]);
      this.enemyDeck.push(this.enemyDeck[0]);
      this.enemyDeck.shift();
    });

    setTimeout(() => {
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
      }, 500);
    }, 1500);
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
        if (x.id === this.enemyTarget && result.player1Determine.power) {
          const incomingAttackPower = result.player1Determine.power;
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
        if (x.id === this.enemyTarget && result.player1Determine.power) {
          const incomingAttackPower = result.player1Determine.power;
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
    const addLength = 5 - this.playerHand.length;
    const addArr = Array.from(Array(addLength).keys());
    addArr.forEach((x, i) => {
      this.playerHand.push(this.playerDeck[0]);
      this.playerDeck.push(this.playerDeck[0]);
      this.playerDeck.shift();
    });
    this.topRedrawCard = 0;
    setTimeout(() => {
      if (this.playerDeck[0] && this.playerDeck[0].id) {
        this.topRedrawCard = this.playerDeck[0].id;
      }
    }, 400);

    const addLengthEnemy = 5 - this.enemyHand.length;
    const addArrEnemy = Array.from(Array(addLengthEnemy).keys());
    addArrEnemy.forEach((x, i) => {
      this.enemyHand.push(this.enemyDeck[0]);
      this.enemyDeck.push(this.enemyDeck[0]);
      this.enemyDeck.shift();
    });
    this.startBotTurnsLoop();
    this.pushError('Enemy Turn');
    this.usedSpecialCardThisTurn = false;
  }

  startBotTurnsLoop() {
    // Bot turns that have been finished

    // Find next valid attack enemy
    const nextEnemy = this.enemyPlayers.find((x: PlayerDto) => {
      // Turn already done? return
      if (this.completedEnemyTurns.includes(x.id)) {
        return;
      }

      // Health is 0 or lower? return
      if (x.health < 1) {
        return;
      }

      if (!this.completedEnemyTurns.includes(x.id)) {
        this.completedEnemyTurns.push(x.id);
        this.currentEnemyTurn = x;
        this.startBotTurn();
        return true;
      }

      return;
    });

    if (!nextEnemy) {
      this.pushMessage('Player Turn');
      this.completedEnemyTurns = [];
      this.newTurn();
      const addLength = 5 - this.playerHand.length;
      const addArr = Array.from(Array(addLength).keys());
      addArr.forEach((x, i) => {
        this.playerHand.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
      });
      this.topRedrawCard = 0;
      setTimeout(() => {
        if (this.playerDeck[0] && this.playerDeck[0].id) {
          this.topRedrawCard = this.playerDeck[0].id;
        }
      }, 400);

      const addLengthEnemy = 5 - this.enemyHand.length;
      const addArrEnemy = Array.from(Array(addLengthEnemy).keys());
      addArrEnemy.forEach((x, i) => {
        this.enemyHand.push(this.enemyDeck[0]);
        this.enemyDeck.push(this.enemyDeck[0]);
        this.enemyDeck.shift();
      });
    }

    // Loop through bot turns
    // Check through bot code to make sure target is set correctly for bot
    // Show bot cards when bot is defending
  }

  isFinishedWithTurn(player: PlayerDto): boolean {
    const isFinished = this.completedEnemyTurns.includes(player.id);
    return isFinished ? true : false;
  }

  async combatFinishBot(result: DetermineWinnerObject) {
    // Bot finishes combat

    // Success, player defended
    if (result.player1Winner) {
      this.playerWinner = true;
      this.enemyLoser = true;
      // Attack bot for 1 damage
      this.enemyTarget = this.findStaticEnemyPlayer().id;
      this.staticEnemyTarget = this.findStaticEnemyPlayer().id;
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
    if (result.player2Winner && result.player2Determine.power) {
      this.enemyWinner = true;
      this.playerLoser = true;

      const incomingAttackPower = result.player2Determine.power;
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
      this.enemyTarget = this.findStaticEnemyPlayer().id;
      this.staticEnemyTarget = this.enemyTarget;
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
    this.startBotTurnsLoop();
  }

  startBotTurn() {
    this.showBotCards = true;
    this.canSelectCards = false;
    // option #1
    // draw additionally cards based on his attack value

    // Draw cards for bot based on attack value

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
      const attackPlayer = this.findEnemyPlayerAttack();
      this.staticEnemyTarget = attackPlayer.id;
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

      const addLength = this.player.attack;
      const addArr = Array.from(Array(addLength).keys());
      addArr.forEach((x, i) => {
        this.playerHand.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
      });
      this.topRedrawCard = 0;
      setTimeout(() => {
        if (this.playerDeck[0] && this.playerDeck[0].id) {
          this.topRedrawCard = this.playerDeck[0].id;
        }
      }, 400);
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
      const includes = this.enemyDefense.find((a) => a.id === x.id);
      if (includes) {
        return false;
      }
      return true;
    });
    this.playerHand = this.playerHand.filter((x) => {
      const includes = this.selectedCards.find((a) => a.id === x.id);
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
    this.currentEnemyTurn = {
      id: 0,
      health: 1,
      attack: 1,
      image: '',
      name: '',
      baseHealth: 1,
    };
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
    this.staticEnemyTarget = 0;
    this.tie = false;
    this.enemyDefense = [];
    this.activeLeaderLines = [];
    this.playerAttackHand = { cards: [], highCard: 0, valid: false };
    this.enemyAttackHand = { cards: [], highCard: 0, valid: false };

    setTimeout(() => {
      this.wrappingTurn = false;
    }, 1000);
  }

  pushError(message: string) {
    const ID = this.errorList.length + 1;
    this.errorList.push({ id: ID, message: message });

    setTimeout(() => {
      this.errorListInactive.push(ID);
    }, 1100);
  }

  pushMessage(message: string) {
    const ID = this.messageList.length + 1;
    this.messageList.push({ id: ID, message: message });

    setTimeout(() => {
      this.messageListInactive.push(ID);
    }, 1100);
  }

  pushSpecialAbilityImage(message: string) {
    const ID = this.specialAbilityList.length + 1;
    this.specialAbilityList.push({ id: ID, message: message });

    setTimeout(() => {
      this.specialAbilityListInactive.push(ID);
    }, 1100);
  }
}

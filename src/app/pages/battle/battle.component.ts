import { gameTheme } from './../../models/theme';
import { LoadingService } from './../../services/loading.service';
import { CheatsService } from './../../services/cheats.service';
import { AbilityCard, CostValue } from './../../models/abilityCard';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
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
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { PlayerDto } from 'src/app/models/player';
import {
  DetermineObject,
  DetermineWinnerObject,
} from 'src/app/models/determine';
import 'leader-line';
import { playerService } from 'src/app/services/player.service';
import { trigger, style, transition, animate } from '@angular/animations';
declare let LeaderLine: any;
import { AbilityService } from 'src/app/services/ability.service';
import { Comic, EnemyLevelDto, LevelDto } from 'src/app/models/level';
import { DialogComponent } from 'src/app/components/dialogComponent/dialog.component';
import { DialogDto } from 'src/app/models/dialog';
import { BackgroundDto } from 'src/app/models/backgrounds';
import { FlagDto } from 'src/app/models/flag';
import { ComicComponent } from 'src/app/components/comic/comic.component';
import { AchievementService } from 'src/app/services/achievement.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Cards } from 'src/assets/data/cards';

interface MissionDetails {
  image: string;
  title: string;
  description: string;
  rewardMin: number;
  rewardMax: number;
}

const defaultAbilityCard: AbilityCard = {
  id: 0,
  boosterId: 0,
  abilityFunction: 'damage',
  targetAll: false,
  abilityValue: [1, 2, 3],
  cost: [['hearts'], ['hearts'], ['hearts']],
  description: ['', '', ''],
  image: 'sliceAbility.png',
  level: 1,
  name: '',
  hitAnimation: 'heal',
  isNew: false,
  numberOwned: 1,
  trueNumberOwned: 1,
  goldCost: [0, 0, 0],
  alliesCalled: [],
};

const defaultPlayer: PlayerDto = {
  id: 0,
  health: 1,
  attack: 1,
  heroSelectSound: 'mario.mp3',
  image: 'link.png',
  name: '',
  baseHealth: 1,
  baseAttack: 1,
  level: 1,
  color: 'green',
  disabled: false,
  points: 0,
  selected: true,
  unlocked: true,
  canDefendWithMultipleCards: false,
  alwaysWinTies: false,
  canSeeTopCard: false,
  canSeeTopCardAbilities: false,
  upgrades: [
    {
      cost: [0],
      description: [''],
      id: 0,
      image: '',
      level: 0,
      title: [''],
      type: [],
    },
  ],
  usedPoints: 0,
};

interface ComboObject {
  id: number;
  cards: any[];
  shuffledCards: any[];
  currentIndex: number;
}

interface RewardItem {
  id: number;
  text: string;
  textAmount: string;
  image: string;
  color: RewardColor;
  value: number;
}

interface CombatImages {
  id: number;
  image: BackgroundDto;
  display: boolean;
}

interface Tip {
  title: string;
  header: string;
  text: string;
  img: string;
  tipRows: string[];
}

type RewardColor = 'blue' | 'gold' | 'purple' | 'green';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogComponent, ComicComponent],
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
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
    flipInYOnEnterAnimation({ anchor: 'flipInYonEnter' }),
  ],
})
export class BattleComponent implements OnInit {
  playerDeck: CardDto[] = [];
  playerHand: CardDto[] = [];
  playerDefense: CardDto[] = [];
  player: PlayerDto = defaultPlayer;
  playerTarget: number = 0;
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
  canClickGuide: boolean = false;
  currentGuideStep: number = 0;

  redrawCards: CardDto[] = [];
  redrawSelectedCards: CardDto[] = [];
  redrawing: boolean = true;
  redrawHide: boolean = false;
  disableAttackBtn: boolean = true;

  validCards: CardDto[] = [];
  errorList: any[] = [];
  errorListInactive: any[] = [];
  messageList: any[] = [];
  messageListInactive: any[] = [];
  displayMessageList: any[] = [];
  displayMessageListInactive: any[] = [];
  drawOutMessageList: any[] = [];
  drawOutMessageListInactive: any[] = [];

  attackStarted: boolean = false;

  canDefendWithMultipleCards: boolean = false;
  hasWildCards: boolean = true;
  wildCards: CardDto[] = [];
  alwaysWinTies: boolean = false;
  canSeeTopCard: boolean = false;
  canSeeTopCardAbilities: boolean = false;
  topRedrawCard: number = 0;
  topRedrawCardEnemy: number = 0;

  activeLeaderLines: any[] = [];
  staticEnemyTarget: number = 0;
  wrappingTurn: boolean = false;
  doingWildCardChange: boolean = false;

  usedSpecialCardThisTurn: boolean = false;

  Cards: CardDto[] = [];
  completedEnemyTurns: number[] = [];
  currentEnemyTurn: PlayerDto = defaultPlayer;

  discardCards: CardDto[] = [];
  discardSelectedCards: CardDto[] = [];
  discarding: boolean = false;
  discardHide: boolean = true;
  enemyNextTurn: boolean = false;
  duringBotTurnDiscard: boolean = false;

  currentExtraDmg: number = 0;

  abilityCardsHand: AbilityCard[] = [];
  abilityDeck: AbilityCard[] = [];
  hoveringAbilityCard: AbilityCard = defaultAbilityCard;
  hoveringAbilityHand: CardDto[] = [];
  activeAbilityLeaderLines: any[] = [];
  currentlyRunning: boolean = false;
  usedAbilityCard: boolean = false;
  errorAbilityCard: AbilityCard = defaultAbilityCard;
  topAbilityCard: AbilityCard = defaultAbilityCard;
  currentAbility: AbilityCard = defaultAbilityCard;
  startedAbilityTurn: boolean = false;

  flamesOnEnemies: PlayerDto[] = [];
  healOnEnemies: PlayerDto[] = [];
  addDefenseOnEnemies: PlayerDto[] = [];
  supportOnEnemies: PlayerDto[] = [];
  shieldOnEnemies: PlayerDto[] = [];
  leachOnEnemies: PlayerDto[] = [];
  healOnPlayer: boolean = false;
  fireOnPlayer: boolean = false;
  shieldOnPlayer: boolean = false;
  increaseOffenseOnPlayer: boolean = false;
  abilityEnemyTarget: number = 0;
  playerUsingAbilityCard: boolean = false;

  usedAbilityCardBot: boolean = false;
  startedAbilityTurnBot: boolean = false;
  currentlyRunningBot: boolean = false;
  abilityCardsHandBot: AbilityCard[] = [];
  abilityDeckBot: AbilityCard[] = [];
  hoveringAbilityCardBot: AbilityCard = defaultAbilityCard;
  topAbilityCardBot: AbilityCard = defaultAbilityCard;
  currentAbilityBot: AbilityCard = defaultAbilityCard;

  gameLoserPlayer: boolean = false;
  gameWinnerPlayer: boolean = false;
  shownRewardItem: RewardItem = {
    id: 0,
    color: 'gold',
    image: '',
    text: '',
    textAmount: '',
    value: 0,
  };
  rewardItemsClean: RewardItem[] = [
    {
      id: 1,
      color: 'gold',
      image: 'goldReward.png',
      text: 'Gold',
      textAmount: 'x100',
      value: 100,
    },
  ];
  rewardItems: RewardItem[] = [
    {
      id: 1,
      color: 'gold',
      image: 'goldReward.png',
      text: 'Gold',
      textAmount: 'x100',
      value: 100,
    },
  ];
  canClickNextReward: boolean = false;
  finishedRewards: boolean = false;
  showHeroLevelUp: boolean = false;

  battleRewardXp: number = 70;
  leveledUp: boolean = false;

  snowFlakesArray: any[] = [];
  showSnowEffect: boolean = false;
  showBubblesEffect: boolean = false;
  showLeavesEffect: boolean = false;
  showSunFlareEffect: boolean = false;
  showCloudsEffect: boolean = false;
  showNightEffect: boolean = false;
  showFireEffect: boolean = false;
  showAshesEffect: boolean = false;

  abilityCardCombos: ComboObject[] = [];
  currentlyShuffling: boolean = false;

  gameThemePath: gameTheme = 'default';
  gameThemePathEnemy: gameTheme = 'default';
  easyMode: boolean = false;
  showGuide: boolean = false;
  hideGuideNow: boolean = false;
  showAbilityGuide: boolean = false;

  checkSurrender: boolean = false;
  hideDialog: boolean = false;
  dialogArray: DialogDto[] = [];
  displayDialog: boolean = false;
  dialogArrayCombat: DialogDto[] = [];
  displayDialogCombat: boolean = false;
  dialogArrayGameEnd: DialogDto[] = [];
  displayDialogGameEnd: boolean = false;
  hoveringAbilityDescription: AbilityCard | undefined;
  showPokerHandsChart: boolean = false;

  firstLevel: EnemyLevelDto | undefined;
  currentLevel: LevelDto | undefined;
  allCombatPhases: EnemyLevelDto[] | undefined;
  currentCombatPhase: EnemyLevelDto | undefined;
  combatImages: CombatImages[] = [];
  playerLevelUpEnabled: boolean = true;
  allCardsWild: boolean = false;
  skippingGuide: boolean = false;
  endGuide: boolean = false;

  showWildHintOverlay: boolean = false;
  currentTip: Tip = {
    title: 'New Tip',
    header: 'Wild Cards',
    text: 'Wild cards can be any value or suite',
    img: 'wildImg.png',
    tipRows: [
      '- Use mousewheel to change value',
      '- Click the suite icons to change suite',
    ],
  };

  @ViewChildren('myActiveCards')
  myActiveCards: QueryList<ElementRef> | undefined;

  @ViewChildren('activeAbilityCards')
  activeAbilityCards: QueryList<ElementRef> | undefined;
  @ViewChildren('activeAbilityCardsBot')
  activeAbilityCardsBot: QueryList<ElementRef> | undefined;

  @ViewChildren('activeEnemyCards') activeEnemyCards:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren('enemyPlayerRef') enemyPlayerRef:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren('playerRef') playerRef: QueryList<ElementRef> | undefined;
  @ViewChild('enemyDefenseRef') enemyDefenseRef: ElementRef | undefined;
  gold: number = 0;
  doubleGold: boolean = false;
  abilitiesCostLess: boolean = false;
  comicData: Comic = { id: 0, comics: [], display: false };
  showComic: boolean = false;

  // Speed and delays
  TwoTimesSpeed: boolean = false;
  Delay500Variable: number = 500; // 300
  Delay2000Variable: number = 2000; // 1000
  Delay1000Variable: number = 1000; // 500
  Delay2400Variable: number = 2400; // 1400
  Delay1500WildTextVariable: number = 1500; // 700

  AbilityDelay: number = 0; // 400
  AbilityDelayLonger: number = 0; // 800
  BattleDelay: number = 0; // 300
  DefaultTimeoutDelay: number = 2500; // 1000
  DefaultNumbersDelay: number = 400; // 0
  TotalWaitDelay: number = 3500; // 2000
  TotalMiniWaitDelay: number = 500; // 300
  EndGameDelay: number = 2000; // 800
  AbilityDelaySmall: number = 0; // 100

  VictoryEnd1000: number = 1000; // 500
  VictoryEnd4300: number = 4300; // 3300
  VictoryEnd3500: number = 3500; // 2500

  tempHideComic: boolean = false;

  constructor(
    private cardService: CardService,
    private userService: playerService,
    private abilityService: AbilityService,
    private cheatsService: CheatsService,
    private loadingService: LoadingService,
    private playerService: playerService,
    private achievementService: AchievementService,
    private localStorageService: LocalStorageService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    try {
      const localBattleSpeed = localStorage.getItem('battleSpeed2x');
      if (localBattleSpeed === 'true') {
        this.setSpeedToDouble();
        this.TwoTimesSpeed = true;
      } else {
        this.setSpeedToNormal();
        this.TwoTimesSpeed = false;
      }
    } catch (err) {
      this.setSpeedToNormal();
      this.TwoTimesSpeed = false;
    }
    try {
      const localPremium = JSON.parse(
        localStorage.getItem('premiumData') ?? '[]'
      );

      if (localPremium && localPremium.length > 0) {
        this.doubleGold = localPremium[1].bought && localPremium[1].active;
        this.abilitiesCostLess =
          localPremium[2].bought && localPremium[2].active;
      }
    } catch (err) {}
    this.playerService.gold$.subscribe((x) => {
      this.gold = x;
    });
    // Player game theme
    this.userService.gameTheme$.subscribe((x) => {
      // this.gameThemePath = x;
    });
    // Update theme
    this.gameThemePath =
      (localStorage.getItem('gameThemePath') as gameTheme) ?? 'default';
    // Cheats
    this.cheatsService.cheats$.subscribe((x) => {
      console.log(x);
      if (x === 'wildHand') {
        this.playerHand = this.playerHand.map((x) => {
          const newCard: CardDto = {
            ...x,
            wild: true,
            wildRange: 14,
            wildSuit: true,
            wildSuits: [1, 1, 1, 1],
          };
          return newCard;
        });
      }

      if (x === 'infiniteHealth') {
        this.player.health = 99;
      }

      if (x === 'defeatEnemy') {
        this.enemyPlayers = this.enemyPlayers.map((x) => {
          return { ...x, health: 1, baseHealth: 1, attack: 1, baseAttack: 1 };
        });
      }
    });

    // Game init
    if (this.Cards.length < 1) {
      this.gameInit();
    }

    this.loadingService.isRefreshing$.subscribe((x) => {
      if (x === true) {
        this.loadingService.isRefreshing$.next(false);
        this.retry();
      }
    });
    this.loadingService.isSurrendering$.subscribe((x) => {
      if (x === true) {
        this.loadingService.isSurrendering$.next(false);
        this.surrender();
      }
    });
  }

  ngAfterViewInit() {
    this.snowFlakesArray = Array.from(Array(50).keys());
  }

  ngAfterContentInit() {
    setTimeout(() => {
      const loadingLocal = localStorage.getItem('showLoading');
      if (loadingLocal) {
        const showLoading = JSON.parse(loadingLocal);
        if (showLoading) {
          this.activeLeaderLines.forEach((x) => {
            x.hide();
            x.remove();
          });
          if (this.currentCombatPhase?.background) {
            this.loadingService.navigate(
              '/battle',
              this.currentCombatPhase.background,
              'Loading...'
            );
          } else {
            this.loadingService.navigate(
              '/battle',
              'loadingBg.png',
              'Loading...'
            );
          }
          localStorage.setItem('showLoading', JSON.stringify(false));
        }
      }
    }, 50);
  }

  ToggleSpeed() {
    if (this.TwoTimesSpeed) {
      // Normal speed
      this.setSpeedToNormal();
    } else {
      // 2x speed
      this.setSpeedToDouble();
    }
    localStorage.setItem('battleSpeed2x', JSON.stringify(this.TwoTimesSpeed));
  }

  setSpeedToDouble() {
    this.TwoTimesSpeed = true;
    this.elementRef.nativeElement.style.setProperty(
      '--animation-speed-1',
      '2s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-speed-2',
      '400ms'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-combat-1',
      '1.5s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-combat-delay-1',
      '2.5s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-shake-1',
      '1.4s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-shake-delay-1',
      '1s'
    );
    this.elementRef.nativeElement.style.setProperty('--animation-chop-1', '1s');
    this.elementRef.nativeElement.style.setProperty(
      '--animation-chop-delay-1',
      '500ms'
    );
    this.Delay500Variable = 300;
    this.Delay2000Variable = 1000;
    this.Delay1000Variable = 500;
    this.Delay2400Variable = 1400;
    this.Delay1500WildTextVariable = 700;

    this.AbilityDelay = 400;
    this.AbilityDelayLonger = 800;
    this.BattleDelay = 300;
    this.DefaultTimeoutDelay = 1000;
    this.DefaultNumbersDelay = 0;
    this.TotalWaitDelay = 2000;
    this.TotalMiniWaitDelay = 300;
    this.EndGameDelay = 800;
    this.AbilityDelaySmall = 100;

    this.VictoryEnd1000 = 500;
    this.VictoryEnd4300 = 3300;
    this.VictoryEnd3500 = 2500;
  }

  setSpeedToNormal() {
    this.TwoTimesSpeed = false;
    this.elementRef.nativeElement.style.setProperty(
      '--animation-speed-1',
      '3s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-speed-2',
      '1s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-combat-1',
      '2s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-combat-delay-1',
      '3s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-shake-1',
      '2.7s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-shake-delay-1',
      '2.4s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-chop-1',
      '1.3s'
    );
    this.elementRef.nativeElement.style.setProperty(
      '--animation-chop-delay-1',
      '2s'
    );
    this.Delay500Variable = 500;
    this.Delay2000Variable = 2000;
    this.Delay1000Variable = 1000;
    this.Delay2400Variable = 2400;
    this.Delay1500WildTextVariable = 1500;

    this.AbilityDelay = 0;
    this.AbilityDelayLonger = 0;
    this.BattleDelay = 0;
    this.DefaultTimeoutDelay = 2500;
    this.DefaultNumbersDelay = 400;
    this.TotalWaitDelay = 3500;
    this.TotalMiniWaitDelay = 500;
    this.EndGameDelay = 2000;
    this.AbilityDelaySmall = 0;

    this.VictoryEnd1000 = 1000;
    this.VictoryEnd4300 = 4300;
    this.VictoryEnd3500 = 3500;
  }

  checkShowWildCardHint(card: CardDto) {
    // Show wild card hint
    const wildTipShown = localStorage.getItem('wildTipShown');
    if (!wildTipShown && (card.wildRange ?? 0) >= 13) {
      localStorage.setItem('wildTipShown', JSON.stringify(true));
      this.showWildHintOverlay = true;
      this.currentTip = {
        title: 'New Tip',
        header: 'Wild Cards',
        text: 'Wild cards can be any value or suite',
        img: 'wildImg.png',
        tipRows: [
          '- Use mousewheel to change value',
          '- Click the suite icons to change suite',
        ],
      };
    }
  }

  hoveringAbilityCardCss(abilityCard: AbilityCard) {
    this.hoveringAbilityDescription = abilityCard;
  }

  hoveringAbilityCardLeaveCss() {
    this.hoveringAbilityDescription = undefined;
  }

  showHoveringAbilityDescription(abilityCard: AbilityCard): boolean {
    const foundCard = this.hoveringAbilityDescription?.id === abilityCard.id;
    if (foundCard) {
      return true;
    }

    return false;
  }

  async nextReward(rewardItem: any) {
    if (this.canClickNextReward && this.rewardItems.length > 0) {
      this.playerService.playSound('cardFlip.mp3');
      // no more clicks
      this.canClickNextReward = false;
      this.rewardItems = this.rewardItems.filter((x) => x.id !== rewardItem.id);
      // Hide current reward
      this.shownRewardItem = {
        id: 0,
        color: 'gold',
        image: '',
        text: '',
        textAmount: '',
        value: 0,
      };
      await this.timeout(750);
      // show new reward
      this.shownRewardItem = this.rewardItems[0];
      if (this.rewardItems.length === 0) {
        this.finishedRewards = true;
        this.updateFlag();
      }
      await this.timeout(500);
      // Can click again
      this.canClickNextReward = true;
    }
  }

  updateFlag() {
    const flagsList: FlagDto[] = this.localStorageService.getFlagsData();
    const currentLevel: LevelDto | any =
      this.localStorageService.getCurrentBattle();

    let foundIndex = -10;
    const newFlagsList: FlagDto[] = flagsList.map((x, i) => {
      if (x.id === currentLevel.id) {
        foundIndex = i + 1;
        return { ...x, levelStatus: 'justFinished' };
      }

      if (foundIndex === i && x.levelStatus !== 'finished') {
        foundIndex = -10;
        return { ...x, levelStatus: 'nextLevel' };
      }
      return x;
    });
    this.localStorageService.setFlagsData(newFlagsList);

    // set gold
    const newGold = this.gold + this.rewardItemsClean[0].value;
    this.playerService.gold$.next(newGold);

    // set player xp
    const heroes: PlayerDto[] = JSON.parse(
      localStorage.getItem('heroData') ?? '[]'
    );
    const newHeroes = heroes.map((x) => {
      if (x.id === this.player.id) {
        const newPoints = this.leveledUp ? (x.points ?? 0) + 6 : x.points;
        return {
          ...x,
          xp: this.player.xp,
          level: this.player.level,
          isMaxLevel: this.player.isMaxLevel,
          points: newPoints,
        };
      }

      return x;
    });
    this.playerService.currentHero$.next(newHeroes.find((x) => x.selected));
    localStorage.setItem('heroData', JSON.stringify(newHeroes));
  }

  isActiveReward(rewardItem: any) {
    return this.shownRewardItem.id === rewardItem.id;
  }

  drawAbilityCard(amount: number) {
    if (this.abilityDeck.length < 1) {
      return;
    }

    if (!this.easyMode) {
      const abilityCardAddArr = Array.from(Array(amount).keys());
      for (const x of abilityCardAddArr) {
        this.abilityCardsHand.push(this.abilityDeck[0]);
        this.abilityDeck.push(this.abilityDeck[0]);
        this.abilityDeck.shift();
      }

      setTimeout(() => {
        this.topAbilityCard = this.abilityDeck[0];
      }, 400);
    }
  }

  drawAbilityCardBot(amount: number) {
    if (this.abilityDeckBot.length < 1) {
      return;
    }

    if (!this.easyMode) {
      const abilityCardAddArr = Array.from(Array(amount).keys());
      for (const x of abilityCardAddArr) {
        this.abilityCardsHandBot.push(this.abilityDeckBot[0]);
        this.abilityDeckBot.push(this.abilityDeckBot[0]);
        this.abilityDeckBot.shift();
      }

      setTimeout(() => {
        this.topAbilityCardBot = this.abilityDeckBot[0];
      }, 400);
    }
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async gameInit() {
    const passedObj: LevelDto | any =
      this.localStorageService.getCurrentBattle();

    if (!passedObj) {
      this.activeLeaderLines.forEach((x) => {
        x.hide();
        x.remove();
      });
      this.activeAbilityLeaderLines.forEach((x) => {
        x.hide();
        x.remove();
      });
    }

    // Passed object for battle
    const currentLevel: LevelDto = JSON.parse(JSON.stringify(passedObj));
    this.Cards = currentLevel.cards ? currentLevel.cards : Cards;
    this.currentLevel = currentLevel;
    this.firstLevel = passedObj.combatPhases[0];
    this.allCombatPhases = this.currentLevel.combatPhases;
    this.combatImages = this.currentLevel.combatPhases.map((x) => {
      return { id: x.id, image: x.background, display: false };
    });

    const missionDetails: MissionDetails | any =
      this.localStorageService.getCurrentDetails();

    if (missionDetails) {
      const randomValue = this.randomIntFromInterval(
        missionDetails.rewardMin,
        missionDetails.rewardMax
      );
      const randomAmount = this.doubleGold ? randomValue * 4 : randomValue;
      const localRewardItem = this.localStorageService.getRewardItem();
      this.rewardItemsClean = [
        {
          ...localRewardItem,
          textAmount: 'x' + randomAmount,
          value: randomAmount,
        },
      ];
      this.rewardItems = this.rewardItemsClean;
    } else {
      const localRewardItem = this.localStorageService.getRewardItem();
      this.rewardItemsClean = [
        {
          ...localRewardItem,
          textAmount: 'x' + 100,
          value: 100,
        },
      ];
      this.rewardItems = this.rewardItemsClean;
    }

    // Easy mode
    const localEasyMode = localStorage.getItem('easymode');
    if (localEasyMode) {
      this.easyMode = JSON.parse(localEasyMode);
    }
    this.hideDialog = passedObj.hideDialog ?? false;
    this.allCardsWild = this.currentLevel.allCardsWild ?? false;

    // Hero abilities
    // this.canDefendWithMultipleCards =
    //   this.currentLevel.canDefendWithMultipleCards;
    // this.alwaysWinTies = this.currentLevel.alwaysWinTies;
    // this.canSeeTopCard = this.currentLevel.canSeeTopCard;
    // this.canSeeTopCardAbilities = this.currentLevel.canSeeTopCardAbilities;
    // this.battleRewardXp = this.currentLevel.battleRewardXp;
    // this.playerLevelUpEnabled = this.currentLevel.playerLevelUpEnabled;

    // Start bot phase
    this.nextCombatPhaseBot();

    // Player init
    this.player = this.userService.getPlayer();
    if (this.player.name.toLowerCase() === 'mario') {
      this.gameThemePath = 'mario';
    }
    if (!this.easyMode) {
      this.abilityDeck = this.userService.getAbilityCards();
      this.abilityDeck = this.abilityDeck.map((x, i) => {
        return { ...x, id: i + 1 };
      });

      if (
        this.currentLevel.shuffleAbilityCards &&
        this.abilityDeck.length > 0
      ) {
        this.abilityDeck = this.cardService.shuffle(this.abilityDeck);
      }
    }
    if (this.abilitiesCostLess) {
      this.abilityDeck = this.abilityDeck.map((x) => {
        const newCosts = x.cost.map((a) => {
          return a.slice(1) ?? [];
        });
        return { ...x, cost: newCosts };
      });
    }
    this.updateDeckBasedOnPlayerSkills();

    this.canDefendWithMultipleCards =
      this.player.canDefendWithMultipleCards ?? false;
    this.alwaysWinTies = this.player.alwaysWinTies ?? false;
    this.canSeeTopCard = this.player.canSeeTopCard ?? false;
    this.canSeeTopCardAbilities = this.player.canSeeTopCardAbilities ?? false;

    // Add wildcards to player deck
    let playerCards: CardDto[] = this.Cards.map((x) => {
      return { ...x, wildInitial: x.value, wildCurrent: '0' };
    });
    const wildCards = Array.from(
      Array(this.player.skills?.wildCardsCount).keys()
    );
    if (wildCards.length > 0) {
      wildCards.forEach((x) => {
        const newWildCard = this.userService.generateWildCard(playerCards);
        playerCards.push(newWildCard);
      });
    }
    this.playerDeck = playerCards;
    if (this.currentLevel.shuffleCards) {
      this.playerDeck = this.cardService.shuffle(playerCards);
    }

    this.showGuide = currentLevel.showGuide ?? false;
    this.showAbilityGuide = currentLevel.showAbilityGuide ?? false;

    const localShownGuideAlready = localStorage.getItem(
      'localShownGuideAlready'
    );

    // Guide is initially false, hide guide
    if (this.showGuide === false || localShownGuideAlready || this.easyMode) {
      this.comicData = this.currentLevel?.comicData ?? {
        comics: [],
        display: false,
        id: 0,
      };
      this.showComic = this.currentLevel?.showComicStart ?? false;
      this.showGuide = false;
      this.showAbilityGuide = false;
      this.hideGuideNow = true;
      for (const num of [0, 1, 2, 3, 4]) {
        // Add to player 1 hand and remove player 1 deck
        this.redrawCards.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
      }
      // Skip redraw phase
      if (this.currentLevel.skipRedrawPhase) {
        this.redrawing = false;
        this.redrawHide = true;
        this.hideRedrawPanel();
      }
      return;
    }

    // Guide is true, show guide
    if (this.showGuide === true && this.hideGuideNow) {
      this.comicData = this.currentLevel?.comicData ?? {
        comics: [],
        display: false,
        id: 0,
      };
      this.showComic = this.currentLevel?.showComicStart ?? false;
      this.showGuide = false;
      for (const num of [0, 1, 2, 3, 4]) {
        // Add to player 1 hand and remove player 1 deck
        this.redrawCards.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
      }
      // Skip redraw phase
      if (this.currentLevel.skipRedrawPhase) {
        this.redrawing = false;
        this.redrawHide = true;
        this.hideRedrawPanel();
      }
      return;
    }

    if (this.showGuide === true) {
      this.combatImages = [{ id: 99, image: 'loadingBg.png', display: true }];
      this.redrawing = false;
      this.currentLevel.battleRewardXp = 0;
      this.enemyPlayers = [
        {
          ...defaultPlayer,
          id: 1,
          image: 'dummy.png',
          name: 'Dummy',
          attack: 1,
          baseAttack: 1,
          health: 2,
          baseHealth: 2,
          level: 1,
        },
        {
          ...defaultPlayer,
          id: 2,
          image: 'dummy.png',
          name: 'Dummy',
          attack: 3,
          baseAttack: 3,
          health: 5,
          baseHealth: 5,
          level: 2,
        },
      ];
      this.gameThemePathEnemy = 'default';
      this.showSnowEffect = false;
      this.showBubblesEffect = false;
      this.showLeavesEffect = false;
      this.showSunFlareEffect = false;
      this.showCloudsEffect = true;
      this.showNightEffect = true;
      this.showFireEffect = false;
      this.showAshesEffect = false;

      await this.timeout(1000);
      this.redrawHide = true;
      this.redrawing = false;
      if (this.skippingGuide) {
        return;
      }
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }

      await this.pushDrawOutTextMessage('Welcome to Card Kingdom Combat!');
      this.nextGuideStep();
      return;
    }

    // --- Bot Turn --- //
    // this.canSelectCards = false;
    // this.startBotTurnsLoop();
  }

  async hidePreviousGuideMessages() {
    this.drawOutMessageList.forEach((x) => {
      this.drawOutMessageListInactive.push(x.id);
    });
    await this.timeout(500);
  }

  async setGuideHands() {
    this.playerDeck = this.playerDeck.map((x) => {
      return { ...x, wild: false, wildSuit: false };
    });
    this.playerHand[0] = {
      ...this.playerDeck[0],
      value: '5',
      image: '5_of_hearts.png',
      suit: 'hearts',
    };
    this.playerHand[1] = {
      ...this.playerDeck[1],
      value: '7',
      image: '7_of_hearts.png',
      suit: 'diamonds',
    };
    this.playerHand[2] = {
      ...this.playerDeck[2],
      value: '9',
      image: '9_of_hearts.png',
      suit: 'clubs',
    };
    this.playerHand[3] = {
      ...this.playerDeck[3],
      value: '12',
      image: '12_of_hearts.png',
      suit: 'spades',
    };
    this.playerHand[4] = {
      ...this.playerDeck[4],
      value: '12',
      image: '12_of_hearts.png',
      suit: 'diamonds',
    };
    // Player deck fill
    this.playerDeck[0] = {
      ...this.playerDeck[5],
      image: '3_of_hearts.png',
      value: '3',
      suit: 'diamonds',
    };
    this.playerDeck[1] = {
      ...this.playerDeck[6],
      image: '6_of_hearts.png',
      value: '6',
      suit: 'diamonds',
    };
    this.playerDeck[2] = {
      ...this.playerDeck[7],
      image: '11_of_diamonds.png',
      value: '11',
      suit: 'diamonds',
    };
    this.playerDeck[3] = {
      ...this.playerDeck[8],
      image: '7_of_clubs.png',
      value: '7',
      suit: 'diamonds',
    };
    this.playerDeck[4] = {
      ...this.playerDeck[9],
      image: '12_of_spades.png',
      value: '12',
      suit: 'diamonds',
    };

    // Enemy hand fill
    this.enemyHand[0] = {
      ...this.enemyDeck[0],
      value: '4',
      image: '4_of_hearts.png',
      suit: 'hearts',
    };
    this.enemyHand[1] = {
      ...this.enemyDeck[1],
      value: '5',
      image: '5_of_hearts.png',
      suit: 'diamonds',
    };
    this.enemyHand[2] = {
      ...this.enemyDeck[2],
      value: '8',
      image: '8_of_hearts.png',
      suit: 'clubs',
    };
    this.enemyHand[3] = {
      ...this.enemyDeck[3],
      value: '9',
      image: '9_of_hearts.png',
      suit: 'spades',
    };
    this.enemyHand[4] = {
      ...this.enemyDeck[4],
      image: '2_of_hearts.png',
      value: '2',
      suit: 'diamonds',
    };
    this.enemyDeck[0] = {
      ...this.enemyDeck[5],
      image: '3_of_hearts.png',
      value: '3',
      suit: 'diamonds',
    };
    this.enemyDeck[1] = {
      ...this.enemyDeck[6],
      image: '6_of_spades.png',
      value: '6',
      suit: 'diamonds',
    };
    this.enemyDeck[2] = {
      ...this.enemyDeck[7],
      image: '11_of_diamonds.png',
      value: '11',
      suit: 'diamonds',
    };
    this.enemyDeck[3] = {
      ...this.enemyDeck[8],
      image: '7_of_clubs.png',
      value: '7',
      suit: 'diamonds',
    };
    this.enemyDeck[4] = {
      ...this.enemyDeck[9],
      image: '12_of_hearts.png',
      value: '12',
      suit: 'diamonds',
    };
  }

  hidePokerHands() {
    this.showPokerHandsChart = false;
    this.playerService.playSound('close.mp3');
  }

  openPokerHands() {
    this.showPokerHandsChart = true;
    this.playerService.playSound('open.mp3');
  }

  hideWildHint() {
    this.playerService.playSound('close.mp3');
    this.showWildHintOverlay = false;
  }

  async skipGuide() {
    this.playerService.playSound('button.mp3');
    if (!this.skippingGuide) {
      localStorage.setItem('localShownGuideAlready', JSON.stringify(true));
      this.skippingGuide = true;

      await this.hidePreviousGuideMessages();
      await this.pushDrawOutTextMessage(
        "That's it for now! Good luck soldier."
      );
      await this.timeout(2000);
      await this.hidePreviousGuideMessages();
      await this.timeout(1000);
      this.hideGuideNow = true;
      this.activeLeaderLines.forEach((x) => {
        x.hide();
        x.remove();
      });
      this.activeAbilityLeaderLines.forEach((x) => {
        x.hide();
        x.remove();
      });
      if (this.currentCombatPhase?.background) {
        this.loadingService.navigate(
          '/battle',
          this.currentCombatPhase.background,
          'Loading...'
        );
      } else {
        this.loadingService.navigate('/battle', 'loadingBg.png', 'Loading...');
      }
      this.resetGame();
      this.Cards = this.currentLevel?.cards ? this.currentLevel.cards : Cards;
      this.gameInit();
    }
  }

  async nextGuideStep() {
    if (this.skippingGuide || this.endGuide) {
      return;
    }

    this.currentGuideStep = this.currentGuideStep + 1;
    const step = this.currentGuideStep;

    if (step === 1) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage('Lets go over the basics of combat');
      if (this.skippingGuide) {
        return;
      }
      this.nextGuideStep();
    } else if (step === 2) {
      // Draw cards
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        'Both players draw until they have 5 cards'
      );
      if (this.skippingGuide) {
        return;
      }
      await this.setGuideHands();
      if (this.skippingGuide) {
        return;
      }
      this.nextGuideStep();
    } else if (step === 3) {
      // Select cards
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage('Find the best hand to attack with');
      if (this.skippingGuide) {
        return;
      }
      this.nextGuideStep();
    } else if (step === 4) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage('Click cards to select them');
      if (this.skippingGuide) {
        return;
      }
      this.selectCard(this.playerHand[3]);
      this.selectCard(this.playerHand[4]);
      this.nextGuideStep();
    } else if (step === 5) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        'Select enemy target by clicking enemies'
      );
      if (this.skippingGuide) {
        return;
      }
      this.setEnemyPlayerHoverTarget(this.enemyPlayers[1]);
      this.nextGuideStep();
    } else if (step === 6) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      this.selectCard(this.playerHand[3]);
      this.selectCard(this.playerHand[4]);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        'Draw 2 ability cards at the start of your turn'
      );
      if (this.skippingGuide) {
        return;
      }
      this.abilityDeck[0] = {
        id: 98,
        boosterId: 88,
        abilityFunction: 'damage',
        abilityValue: [1, 2, 3],
        cost: [
          ['diamonds', 'hearts'],
          ['diamonds', 'hearts'],
          ['diamonds', 'hearts'],
        ],
        description: [
          'Deal 1 damage to every enemy',
          'Deal 2 damage to every enemy',
          'Deal 3 damage to every enemy',
        ],
        hitAnimation: 'fire',
        image: 'sliceAbility.png',
        level: 1,
        name: 'Burn',
        targetAll: true,
        isNew: false,
        numberOwned: 1,
        trueNumberOwned: 1,
        goldCost: [0, 0, 0],
        alliesCalled: [],
      };
      this.abilityDeck[1] = {
        id: 99,
        boosterId: 88,
        abilityFunction: 'wildSuitRange',
        targetAll: false,
        abilityValue: [14, 14, 14],
        cost: [],
        name: 'Wild',
        description: [
          'Wild a card In Hand',
          'Wild a card In Hand',
          'Wild a card In Hand',
        ],
        image: 'sliceAbility.png',
        level: 3,
        hitAnimation: 'fire',
        isNew: false,
        numberOwned: 1,
        trueNumberOwned: 1,
        goldCost: [0, 0, 0],
        alliesCalled: [],
      };
      this.drawAbilityCard(2);
      this.nextGuideStep();
    } else if (step === 7) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        'Ability cards use up cards in your hand to play them'
      );
      if (this.skippingGuide) {
        return;
      }
      this.hoverAbilityEnter(this.abilityCardsHand[0]);
      this.nextGuideStep();
    } else if (step === 8) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        'Arrows are drawn to the cards it will use'
      );
      if (this.skippingGuide) {
        return;
      }
      this.nextGuideStep();
    } else if (step === 9) {
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        'Scroll on the ability card to change the cards it will use'
      );
      if (this.skippingGuide) {
        return;
      }
      this.abilityCardChangeUseCards(
        { deltaY: -100 },
        this.abilityCardsHand[0]
      );
      await this.timeout(1000);
      if (this.skippingGuide) {
        return;
      }
      this.abilityCardChangeUseCards(
        { deltaY: -100 },
        this.abilityCardsHand[0]
      );
      await this.timeout(1000);
      if (this.skippingGuide) {
        return;
      }
      this.abilityCardChangeUseCards(
        { deltaY: -100 },
        this.abilityCardsHand[0]
      );
      await this.timeout(1000);
      this.nextGuideStep();
    } else if (step === 10) {
      await this.timeout(2000);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage('Click the ability card to use it');
      if (this.skippingGuide) {
        return;
      }
      await this.timeout(2000);
      if (this.skippingGuide) {
        return;
      }
      this.selectAbilityCard(this.abilityCardsHand[0]);
      await this.timeout(3000);
      this.nextGuideStep();
    } else if (step === 11) {
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      await this.pushDrawOutTextMessage(
        "That's it for now! Good luck soldier."
      );
      await this.timeout(2500);
      if (this.skippingGuide) {
        return;
      }
      await this.hidePreviousGuideMessages();
      if (this.skippingGuide) {
        return;
      }
      this.nextGuideStep();
    } else if (step === 12) {
      if (this.skippingGuide || this.endGuide) {
        return;
      }
      this.endGuide = true;
      this.hideGuideNow = true;
      this.activeLeaderLines.forEach((x) => {
        x.hide();
        x.remove();
      });
      this.activeAbilityLeaderLines.forEach((x) => {
        x.hide();
        x.remove();
      });
      if (this.currentCombatPhase?.background) {
        const bg = this.currentCombatPhase?.background;
        this.loadingService.navigate('/battle', bg, 'Loading...');
      } else {
        this.loadingService.navigate('/battle', 'loadingBg.png', 'Loading...');
      }
      localStorage.setItem('localShownGuideAlready', JSON.stringify(true));
      this.resetGame();
      this.Cards = this.currentLevel?.cards ? this.currentLevel.cards : Cards;
      setTimeout(() => {
        if (!this.skippingGuide) {
          this.resetGame();
          this.Cards = this.currentLevel?.cards
            ? this.currentLevel.cards
            : Cards;
          this.gameInit();
        }
      }, 500);
    }
  }

  async nextCombatPhaseBot(extraDelays: boolean = false) {
    if (!this.allCombatPhases || !this.currentLevel) {
      return;
    }

    if (this.allCombatPhases.length === 0) {
      return;
    }

    const shouldShowEndDialog =
      this.currentCombatPhase &&
      this.currentCombatPhase.dialogEnd &&
      this.currentCombatPhase.dialogEnd.length > 0 &&
      extraDelays &&
      !this.hideDialog;
    if (shouldShowEndDialog) {
      this.startEndDialogCombat();
      return;
    }

    this.currentCombatPhase = this.allCombatPhases[0];
    this.allCombatPhases.shift();

    this.combatImages = this.combatImages.map((x) => {
      if (x.id === this.currentCombatPhase?.id) {
        return { ...x, display: true };
      }
      return { ...x, display: false };
    });
    if (this.currentCombatPhase.dialogStart && !this.hideDialog) {
      this.dialogArray = this.currentCombatPhase.dialogStart;
    }
    this.gameThemePathEnemy = this.currentCombatPhase.enemyCardTheme;
    this.showSnowEffect = this.currentCombatPhase.showSnowEffect;
    this.showBubblesEffect = this.currentCombatPhase.showBubblesEffect;
    this.showLeavesEffect = this.currentCombatPhase.showLeavesEffect;
    this.showSunFlareEffect = this.currentCombatPhase.showSunFlareEffect;
    this.showCloudsEffect = this.currentCombatPhase.showCloudsEffect;
    this.showNightEffect = this.currentCombatPhase.showNightEffect;
    this.showFireEffect = this.currentCombatPhase.showFireEffect;
    this.showAshesEffect = this.currentCombatPhase.showAshesEffect;

    this.completedEnemyTurns = [];
    if (extraDelays) {
      await this.timeout(1000);
    }
    this.enemyPlayers = this.currentCombatPhase.enemyPlayers;
    if (!this.easyMode) {
      this.abilityDeckBot = this.currentCombatPhase.enemyAbilityCards;
      this.abilityCardsHandBot = [];
      this.abilityCardsHand = [];
      if (this.currentLevel.shuffleAbilityCardsBot) {
        this.abilityDeckBot = this.cardService.shuffle(this.abilityDeckBot);
      }
    }
    const enemyCards: CardDto[] = this.Cards.map((x) => {
      return { ...x, wildInitial: x.value, wildCurrent: '0' };
    });
    this.enemyDeck = enemyCards;
    if (this.currentLevel.shuffleCardsBot) {
      this.enemyDeck = this.cardService.shuffle(enemyCards);
    }

    if (extraDelays) {
      await this.addCardsToBothHands();
      this.drawAbilityCardBot(2);
      this.drawAbilityCard(2);
      this.newTurn();
    }
  }

  async continue() {
    // localStorage.setItem('showLoading', JSON.stringify(true));
    // window.location.reload();
    this.activeLeaderLines.forEach((x) => {
      x.hide();
      x.remove();
    });
    this.playerService.playSound('button.mp3');
    if (this.currentCombatPhase?.background) {
      this.loadingService.navigate(
        '/' + this.localStorageService.currentRoute(),
        this.currentCombatPhase.background,
        'Loading...'
      );
    } else {
      this.loadingService.navigate(
        '/' + this.localStorageService.currentRoute(),
        'loadingBg.png',
        'Loading...'
      );
    }
  }

  async retry() {
    // localStorage.setItem('showLoading', JSON.stringify(true));
    // window.location.reload();
    this.activeLeaderLines.forEach((x) => {
      x.hide();
      x.remove();
    });
    this.playerService.playSound('button.mp3');
    if (this.currentCombatPhase?.background) {
      this.loadingService.navigate(
        '/battle',
        this.currentCombatPhase.background,
        'Loading...'
      );
    } else {
      this.loadingService.navigate('/battle', 'loadingBg.png', 'Loading...');
    }
    setTimeout(() => {
      this.resetGame();
    }, 500);
    setTimeout(() => {
      this.resetGame();
      this.gameInit();
    }, 2000);
  }

  resetGame() {
    this.playerDeck = [];
    this.playerHand = [];
    this.playerDefense = [];
    this.player = defaultPlayer;
    this.playerTarget = 0;
    this.playerAttackHand = {
      valid: false,
      highCard: 0,
      cards: [],
    };
    this.playerWinner = false;
    this.playerLoser = false;
    this.finishedChoosingDefensePlayer = false;

    this.selectedEnemyCards = [];
    this.enemyDeck = [];
    this.enemyHand = [];
    this.enemyDefense = [];
    this.enemyPlayers = [];
    this.enemyTarget = 0;
    this.enemyAttackHand = {
      valid: false,
      highCard: 0,
      cards: [],
    };
    this.enemyWinner = false;
    this.enemyLoser = false;
    this.enemyAttackStarted = false;
    this.showBotCards = false;
    this.tie = false;

    this.attackEnding = false;
    this.selectedCards = [];
    this.canSelectCards = true;

    this.redrawCards = [];
    this.redrawSelectedCards = [];
    this.redrawing = true;
    this.redrawHide = false;
    this.disableAttackBtn = true;

    this.validCards = [];
    this.errorList = [];
    this.errorListInactive = [];
    this.messageList = [];
    this.messageListInactive = [];
    this.displayMessageList = [];
    this.displayMessageListInactive = [];

    this.attackStarted = false;

    this.canDefendWithMultipleCards = false;
    this.hasWildCards = true;
    this.wildCards = [];
    this.alwaysWinTies = false;
    this.canSeeTopCard = false;
    this.canSeeTopCardAbilities = false;
    this.topRedrawCard = 0;
    this.topRedrawCardEnemy = 0;

    this.activeLeaderLines = [];
    this.staticEnemyTarget = 0;
    this.wrappingTurn = false;
    this.doingWildCardChange = false;

    this.usedSpecialCardThisTurn = false;

    this.completedEnemyTurns = [];
    this.currentEnemyTurn = defaultPlayer;

    this.discardCards = [];
    this.discardSelectedCards = [];
    this.discarding = false;
    this.discardHide = true;
    this.enemyNextTurn = false;
    this.duringBotTurnDiscard = false;

    this.currentExtraDmg = 0;

    this.abilityCardsHand = [];
    this.abilityDeck = [];
    this.hoveringAbilityCard = defaultAbilityCard;
    this.hoveringAbilityHand = [];
    this.activeAbilityLeaderLines = [];
    this.currentlyRunning = false;
    this.usedAbilityCard = false;
    this.errorAbilityCard = defaultAbilityCard;
    this.topAbilityCard = defaultAbilityCard;
    this.currentAbility = defaultAbilityCard;
    this.startedAbilityTurn = false;

    this.flamesOnEnemies = [];
    this.healOnEnemies = [];
    this.addDefenseOnEnemies = [];
    this.supportOnEnemies = [];
    this.shieldOnEnemies = [];
    this.leachOnEnemies = [];
    this.healOnPlayer = false;
    this.fireOnPlayer = false;
    this.shieldOnPlayer = false;
    this.increaseOffenseOnPlayer = false;
    this.abilityEnemyTarget = 0;
    this.playerUsingAbilityCard = false;

    this.usedAbilityCardBot = false;
    this.startedAbilityTurnBot = false;
    this.currentlyRunningBot = false;
    this.abilityCardsHandBot = [];
    this.abilityDeckBot = [];
    this.hoveringAbilityCardBot = defaultAbilityCard;
    this.topAbilityCardBot = defaultAbilityCard;
    this.currentAbilityBot = defaultAbilityCard;

    this.gameLoserPlayer = false;
    this.gameWinnerPlayer = false;
    this.shownRewardItem = {
      id: 0,
      color: 'gold',
      image: '',
      text: '',
      textAmount: '',
      value: 0,
    };
    this.rewardItemsClean = [
      {
        id: 1,
        color: 'gold',
        image: 'goldReward.png',
        text: 'Gold',
        textAmount: 'x100',
        value: 100,
      },
    ];
    this.rewardItems = [
      {
        id: 1,
        color: 'gold',
        image: 'goldReward.png',
        text: 'Gold',
        textAmount: 'x100',
        value: 100,
      },
    ];
    this.canClickNextReward = false;
    this.finishedRewards = false;
    this.showHeroLevelUp = false;

    this.battleRewardXp = 70;
    this.leveledUp = false;

    this.snowFlakesArray = [];
    this.showSnowEffect = false;
    this.showBubblesEffect = false;
    this.showLeavesEffect = false;
    this.showSunFlareEffect = false;
    this.showCloudsEffect = false;
    this.showNightEffect = false;
    this.showFireEffect = false;
    this.showAshesEffect = false;

    this.abilityCardCombos = [];
    this.currentlyShuffling = false;

    this.gameThemePathEnemy = 'default';
    this.easyMode = false;
    this.checkSurrender = false;

    this.hideDialog = false;
    this.dialogArray = [];
    this.displayDialog = false;
    this.dialogArrayCombat = [];
    this.displayDialogCombat = false;
    this.dialogArrayGameEnd = [];
    this.displayDialogGameEnd = false;
    this.hoveringAbilityDescription = undefined;
    this.showPokerHandsChart = false;

    this.firstLevel = undefined;
    this.currentLevel = undefined;
    this.allCombatPhases = undefined;
    this.currentCombatPhase = undefined;
    this.combatImages = [];
    this.playerLevelUpEnabled = true;
  }

  async selectAbilityCard(ability: AbilityCard) {
    this.playerService.playSound('cardFlip.mp3');
    const playerHand = this.useMemorizedCards(ability);
    const canUse: CardDto[] = this.abilityService.checkCanUseAbility(
      ability,
      playerHand
    );

    if (canUse.length > 0 || ability.cost[ability.level - 1].length === 0) {
      this.errorAbilityCard = ability;
      this.usedAbilityCard = true;

      // Remove cards from hand
      canUse.forEach((x) => {
        this.playerHand = this.playerHand.filter((a) => a.id !== x.id);
      });

      // Hide lines
      try {
        for await (const x of this.activeAbilityLeaderLines) {
          await x.hide('fade', { duration: 100, timing: 'linear' });
        }
      } catch (err) {
        console.log(err);
      }
      this.activeAbilityLeaderLines = [];

      // Use ability card
      try {
        for await (const x of this.activeLeaderLines) {
          await x.hide('fade', { duration: 100, timing: 'linear' });
        }
      } catch (err) {
        console.log(err);
      }
      this.activeLeaderLines = [];

      this.selectedCards = [];
      this.enemyTarget = 0;
      this.useAbilityCard(ability);
    } else {
      this.errorAbilityCard = ability;
    }
  }

  useAbilityCard(ability: AbilityCard) {
    this.canSelectCards = false;
    this.playerUsingAbilityCard = true;
    if (ability.abilityFunction === 'damage') {
      this.damageAbility(ability);
    }

    if (ability.abilityFunction === 'heal') {
      this.healAbility(ability);
    }

    // Draw x cards
    if (ability.abilityFunction === 'draw') {
      this.drawAbility(ability);
    }

    // Redraw all number/face cards
    if (ability.abilityFunction === 'redraw') {
      this.redrawAbility(ability);
    }

    // Redraw whole hand including abilities
    if (ability.abilityFunction === 'redrawAll') {
      this.redrawAllAbility(ability);
    }

    // Bot discards x
    if (ability.abilityFunction === 'discard') {
      this.discardAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === 'offense') {
      this.offenseAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === 'leach') {
      this.leachAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === 'wildSuit') {
      this.wildSuitAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === 'wildRange') {
      this.wildRangeAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === 'wildSuitRange') {
      this.wildSuitRangeAbility(ability);
    }

    // Player offense +x
    if (ability.abilityFunction === 'increaseDefense') {
      this.increaseDefenseAbility(ability);
    }
  }

  async increaseDefenseAbility(ability: AbilityCard) {
    // green hp while healing
    // potion fades on player
    let newAttack =
      this.player.attack + ability.abilityValue[ability.level - 1];

    // Remove ability card from hand
    this.abilityCardsHand = this.abilityCardsHand.filter(
      (x) => x.id !== ability.id
    );
    await this.timeout(200);
    this.playerService.playSound('heal.mp3');
    this.increaseOffenseOnPlayer = true;
    await this.timeout(400);
    this.player.attack = newAttack;

    this.endAbilityTurn(ability, 800 - this.AbilityDelay); // 500
  }

  async drawAbility(ability: AbilityCard) {
    this.addPlayerCardsToHand(ability.abilityValue[ability.level - 1]);
    this.endAbilityTurn(ability, 100);
  }

  async redrawAbility(ability: AbilityCard) {
    // Redraw all other cards
    this.playerHand = [];
    this.selectedCards = [];
    this.addPlayerCardsToHand(5);

    this.endAbilityTurn(ability, 100);
  }

  async redrawAllAbility(ability: AbilityCard) {
    // Redraw ability cards
    this.abilityCardsHand = [];
    this.drawAbilityCard(2);

    // Redraw all other cards
    this.playerHand = [];
    this.selectedCards = [];
    this.addPlayerCardsToHand(5);

    this.endAbilityTurn(ability, 100);
  }

  async discardAbility(ability: AbilityCard) {
    let usedDiscards: number = 0;
    const abilityCost = ability.abilityValue[ability.level - 1];

    this.enemyHand = this.enemyHand.filter((x, i) => {
      if (usedDiscards !== abilityCost) {
        usedDiscards++;
        return false;
      } else {
        return true;
      }
    });
    this.endAbilityTurn(ability, 100);
  }

  async offenseAbility(ability: AbilityCard) {
    // Target enemy player
    if (ability.targetAll) {
      // Automatically apply -x to all enemies
      this.enemyPlayers = this.enemyPlayers.map((x) => {
        let newAttack =
          x.attack -
          this.currentAbility.abilityValue[this.currentAbility.level - 1];
        if (newAttack < 1) {
          newAttack = 0;
        }
        this.shieldOnEnemies.push(x);
        this.playerService.playSound('block.mp3');

        return { ...x, attack: newAttack };
      });
      this.endAbilityTurn(ability, 1200 - this.AbilityDelay); // 500
    } else {
      const ID = this.pushDisplayMessage(
        `Select An Enemy To Apply -${
          ability.abilityValue[ability.level - 1]
        } Offense To`
      );
      this.currentAbility = ability;
    }
  }

  async leachAbility(ability: AbilityCard) {
    // Target enemy player
    if (ability.targetAll) {
      const totalEnemyPlayersValid = this.enemyPlayers.filter(
        (x) => x.health > 0
      );
      const totalHealthRegained =
        totalEnemyPlayersValid.length * ability.abilityValue[ability.level - 1];

      // Automatically apply -x to all enemies
      this.enemyPlayers = this.enemyPlayers.map((x) => {
        // Decrease enemy health by value
        let newHealth = x.health - ability.abilityValue[ability.level - 1];
        this.leachOnEnemies.push(x);

        return { ...x, health: newHealth };
      });
      this.playerService.playSound('freeze.mp3');

      // Remove active lines
      try {
        for await (const x of this.activeAbilityLeaderLines) {
          await x.hide('fade', { duration: 100, timing: 'linear' });
        }
      } catch (err) {
        console.log(err);
      }
      this.activeAbilityLeaderLines = [];

      let healAbility = { ...ability };
      healAbility.abilityFunction = 'heal';
      healAbility.abilityValue[healAbility.level - 1] = totalHealthRegained;

      await this.timeout(400);
      this.healAbility(healAbility);
    } else {
      const ID = this.pushDisplayMessage(
        `Select An Enemy To Steal ${
          ability.abilityValue[ability.level - 1]
        } Health From`
      );
      this.currentAbility = ability;
    }
  }

  async wildSuitAbility(ability: AbilityCard) {
    // Target card in hand
    this.currentAbility = ability;
    const ID = this.pushDisplayMessage(`Select A Card To Give Wild Suit To`);
  }

  async wildRangeAbility(ability: AbilityCard) {
    // Target card in hand
    this.currentAbility = ability;
    const ID = this.pushDisplayMessage(
      `Select A Card To Give Wild Suit and Range +${
        ability.abilityValue[ability.level - 1]
      } To`
    );
  }

  async wildSuitRangeAbility(ability: AbilityCard) {
    // Target card in hand
    this.currentAbility = ability;
    const ID = this.pushDisplayMessage(
      `Select A Card To Give Wild Range +1 To`
    );
  }

  async damageAbility(ability: AbilityCard) {
    if (ability.targetAll) {
      // Automatically attack all enemies
      for (const x of this.enemyPlayers) {
        const incomingAttackPower = ability.abilityValue[ability.level - 1];
        const newHealth = x.health - incomingAttackPower;
        if (ability.hitAnimation === 'fire') {
          this.flamesOnEnemies.push(x);
        }
        this.playerService.playSound('fire.mp3');
        this.enemyTarget = x.id;
        this.numbersGoDownIncrementallyBot(x.health, newHealth);
      }
      await this.timeout(200 * ability.abilityValue[ability.level - 1]);
      this.endAbilityTurn(ability, 1200 - this.AbilityDelay); // 500
    } else {
      const ID = this.pushDisplayMessage(
        `Select An Enemy To Deal ${
          ability.abilityValue[ability.level - 1]
        } Damage To`
      );
      this.currentAbility = ability;
    }
  }

  async healAbility(ability: AbilityCard) {
    // green hp while healing
    // potion fades on player
    let newHealth =
      this.player.health + ability.abilityValue[ability.level - 1];
    if (newHealth > this.player.baseHealth) {
      newHealth = this.player.baseHealth;
    }

    // Remove ability card from hand
    this.abilityCardsHand = this.abilityCardsHand.filter(
      (x) => x.id !== ability.id
    );
    await this.timeout(200);
    this.playerService.playSound('heal.mp3');
    this.healOnPlayer = true;
    await this.timeout(400);
    this.numbersGoUpIncrementallyPlayer(this.player.health, newHealth);

    this.endAbilityTurn(ability, 700 - this.AbilityDelay); // 500
  }

  async endAbilityTurn(ability: AbilityCard, timeout: number) {
    // Remove ability card from hand
    this.abilityCardsHand = this.abilityCardsHand.filter(
      (x) => x.id !== ability.id
    );

    // Remove active lines
    try {
      for await (const x of this.activeAbilityLeaderLines) {
        await x.hide('fade', { duration: 100, timing: 'linear' });
      }
    } catch (err) {
      console.log(err);
    }
    this.activeAbilityLeaderLines = [];

    this.displayMessageList.forEach((x) => {
      this.displayMessageListInactive.push(x.id);
    });

    setTimeout(() => {
      this.healOnPlayer = false;
      this.usedAbilityCard = false;
      this.increaseOffenseOnPlayer = false;
      this.playerUsingAbilityCard = false;
      this.flamesOnEnemies = [];
      this.shieldOnEnemies = [];
      this.leachOnEnemies = [];
      this.enemyTarget = 0;
      this.currentAbility = defaultAbilityCard;
      this.startedAbilityTurn = false;
      const shouldEndGame = this.checkEndGame();
      if (shouldEndGame) {
        return;
      }
      this.canSelectCards = true;
      this.abilityCardsHand.forEach((x) => {
        this.hoverAbilityOut(x);
      });
      this.pushMessage('Player Turn');
    }, timeout);
  }

  async onSelectTargetAbilityFire() {
    const ability = this.currentAbility;
    this.startedAbilityTurn = true;

    for await (const x of this.enemyPlayers) {
      if (x.id === this.enemyTarget) {
        const incomingAttackPower = ability.abilityValue[ability.level - 1];
        const newHealth = x.health - incomingAttackPower;
        if (ability.hitAnimation === 'fire') {
          this.flamesOnEnemies.push(x);
        }
        this.playerService.playSound('fire.mp3');
        await this.numbersGoDownIncrementallyBot(x.health, newHealth);
      }
    }

    this.endAbilityTurn(ability, 1900 - this.AbilityDelayLonger); // 800
    setTimeout(() => {
      this.abilityEnemyTarget = 0;
    }, 4000);
  }

  async onSelectTargetAbilityOffense() {
    const ability = this.currentAbility;
    this.startedAbilityTurn = true;

    this.enemyPlayers = this.enemyPlayers.map((x) => {
      if (x.id === this.enemyTarget) {
        let newAttack =
          x.attack -
          this.currentAbility.abilityValue[this.currentAbility.level - 1];
        if (newAttack < 1) {
          newAttack = 0;
        }
        this.shieldOnEnemies.push(x);
        return { ...x, attack: newAttack };
      }

      return x;
    });

    this.endAbilityTurn(ability, 1800 - this.AbilityDelay); // 500
    setTimeout(() => {
      this.abilityEnemyTarget = 0;
    }, 4000);
  }

  async onSelectTargetAbilityLeach() {
    const ability = this.currentAbility;
    this.startedAbilityTurn = true;

    this.enemyPlayers = this.enemyPlayers.map((x) => {
      if (x.id === this.enemyTarget) {
        // Decrease enemy health by value
        let newHealth = x.health - ability.abilityValue[ability.level - 1];
        this.leachOnEnemies.push(x);

        return { ...x, health: newHealth };
      }
      return x;
    });

    const totalEnemyPlayersValid = this.enemyPlayers.filter(
      (x) => x.id === this.enemyTarget
    );
    const totalHealthRegained =
      totalEnemyPlayersValid.length * ability.abilityValue[ability.level - 1];
    let healAbility = ability;
    healAbility.abilityFunction = 'heal';
    healAbility.abilityValue[ability.level - 1] = totalHealthRegained;

    // Remove active lines
    try {
      for await (const x of this.activeAbilityLeaderLines) {
        await x.hide('fade', { duration: 100, timing: 'linear' });
      }
    } catch (err) {
      console.log(err);
    }
    this.activeAbilityLeaderLines = [];

    await this.timeout(1000);
    this.healAbility(healAbility);

    setTimeout(() => {
      this.abilityEnemyTarget = 0;
    }, 4000);
  }

  async onSelectTargetAbilityWildSuit(card: CardDto) {
    // Give wild suit to target card
    const newCard: CardDto = {
      ...card,
      wild: true,
      wildSuit: true,
      wildSuits: [1, 1, 1, 1],
    };
    this.playerHand = this.playerHand.map((x) => {
      if (x.id === card.id) {
        return newCard;
      }

      return x;
    });

    this.endAbilityTurn(this.currentAbility, 100);
  }

  async onSelectTargetAbilityWildRange(card: CardDto) {
    // Give wild range
    const newCard: CardDto = {
      ...card,
      wild: true,
      wildRange:
        this.currentAbility.abilityValue[this.currentAbility.level - 1],
    };
    this.playerHand = this.playerHand.map((x) => {
      if (x.id === card.id) {
        return newCard;
      }

      return x;
    });

    this.endAbilityTurn(this.currentAbility, 100);
  }

  async onSelectTargetAbilityWildSuitRange(card: CardDto) {
    // Give wild range and suit
    const newCard: CardDto = {
      ...card,
      wild: true,
      wildRange:
        this.currentAbility.abilityValue[this.currentAbility.level - 1],
      wildSuit: true,
      wildSuits: [1, 1, 1, 1],
    };
    this.playerHand = this.playerHand.map((x) => {
      if (x.id === card.id) {
        return newCard;
      }

      return x;
    });

    this.endAbilityTurn(this.currentAbility, 100);
  }

  shuffleHand(ability: AbilityCard, scrollUp: boolean): CardDto[] {
    this.currentlyShuffling = true;
    // Check before running again
    const foundAbilityCombo = this.abilityCardCombos.find(
      (x) => x.id === ability.id
    );
    const playerHand = this.playerHand;

    let hasSameSuits = false;
    if (playerHand && foundAbilityCombo && foundAbilityCombo.shuffledCards) {
      hasSameSuits = this.cardService.hasSameSuits(
        foundAbilityCombo?.shuffledCards[foundAbilityCombo.currentIndex],
        playerHand
      );
    }
    const canNotRun = hasSameSuits;
    // console.log('hasSameSuits: ', hasSameSuits);
    // console.log(
    //   'abilityCombo: ',
    //   foundAbilityCombo?.shuffledCards[foundAbilityCombo.currentIndex]
    // );
    // console.log('playerHand: ', playerHand);

    // Check if can even use
    const canUse: CardDto[] = this.abilityService.checkCanUseAbility(ability, [
      ...this.playerHand,
    ]);

    const shouldRun =
      (canUse.length > 0 || ability.cost[ability.level - 1].length === 0) &&
      !canNotRun;
    // If can use && haven't already run for this id
    if (
      shouldRun
      // shouldRun ||
      // !hasSameSuits ||
      // !foundAbilityCombo?.shuffledCards[foundAbilityCombo.currentIndex]
    ) {
      // shuffle array 25 times, then get distinct arrays
      const shuffledCardsArray: any[] = [];
      const shuffledShuffledCardsArray: any[] = [];
      Array.from(Array(25).keys()).forEach((x) => {
        const shuffledHand: CardDto[] = this.cardService.shuffle([
          ...this.playerHand,
        ]);
        const canUseShuffled: CardDto[] =
          this.abilityService.checkCanUseAbility(ability, [...shuffledHand]);
        const sortedCanUse: CardDto[] = canUseShuffled.sort(
          (a, b) => a.id - b.id
        );
        shuffledCardsArray.push(sortedCanUse);
        const sortedShuffle: CardDto[] = shuffledHand.sort(
          (a, b) => a.id - b.id
        );
        shuffledShuffledCardsArray.push(sortedShuffle);
      });
      const foundShuffledIndexArrays: number[] = [];

      var unique = shuffledCardsArray
        .map((ar) => JSON.stringify(ar))
        .filter((itm, idx, arr) => {
          if (arr.indexOf(itm) === idx) {
            foundShuffledIndexArrays.push(idx);
          }
          return arr.indexOf(itm) === idx;
        })
        .map((str) => JSON.parse(str));

      const shuffledCleanCardsArray: any[] = [];
      foundShuffledIndexArrays.forEach((x, i) => {
        const foundItemArr = shuffledShuffledCardsArray[i];
        shuffledCleanCardsArray.push(foundItemArr);
      });

      const foundAbility = this.abilityCardCombos.find(
        (x) => x.id === ability.id
      );

      if (!foundAbility) {
        this.abilityCardCombos.push({
          id: ability.id,
          cards: unique,
          shuffledCards: shuffledCleanCardsArray,
          currentIndex: foundAbilityCombo?.currentIndex ?? 0,
        });
      }

      this.abilityCardCombos = this.abilityCardCombos.map((x) => {
        if (x.id === ability.id) {
          return {
            id: x.id,
            cards: unique,
            shuffledCards: shuffledCleanCardsArray,
            currentIndex: x.currentIndex ?? 0,
          };
        }
        return x;
      });
    }

    const currentItem = this.abilityCardCombos.find((x) => x.id === ability.id);
    if (scrollUp && currentItem) {
      // Scroll up, go up 1 item

      let nextIndex = currentItem?.currentIndex + 1;

      if (nextIndex >= currentItem.cards.length) {
        nextIndex = 0;
      }
      this.abilityCardCombos = this.abilityCardCombos.map((x) => {
        if (x.id === ability.id) {
          return { ...x, currentIndex: nextIndex };
        }

        return x;
      });

      const indexCards = currentItem.cards[nextIndex];
      this.currentlyShuffling = false;
      return indexCards;
    } else if (currentItem) {
      // Scroll down, go down 1 item

      let prevIndex = currentItem?.currentIndex - 1;

      if (prevIndex < 0) {
        prevIndex = currentItem.cards.length - 1;
      }
      this.abilityCardCombos = this.abilityCardCombos.map((x) => {
        if (x.id === ability.id) {
          return { ...x, currentIndex: prevIndex };
        }

        return x;
      });

      const indexCards = currentItem.cards[prevIndex];
      this.currentlyShuffling = false;
      return indexCards;
    }
    this.currentlyShuffling = false;
    return [];
  }

  MobileValueScrollUp(event: any, card: CardDto) {
    event.stopPropagation();
    event.preventDefault();

    this.wildCardScrollChange(-100, card);
  }

  MobileValueScrollDown(event: any, card: CardDto) {
    event.stopPropagation();
    event.preventDefault();
    this.playerService.playSound('button.mp3');

    this.wildCardScrollChange(100, card);
  }

  abilityCardChangeUseCards(scroll: any, ability: AbilityCard) {
    let scrollUp = false;
    if (scroll.deltaY === -100) {
      scrollUp = true;
    }

    // If currently running, return
    if (
      this.hoveringAbilityHand.length === 0 ||
      this.usedAbilityCard ||
      this.currentlyShuffling
    ) {
      return;
    }
    this.currentlyRunning = false;

    const canUse = this.shuffleHand(ability, scrollUp);

    if (canUse.length < 1 && ability.cost[ability.level - 1].length !== 0) {
      return;
    }

    if (!this.currentlyRunning) {
      this.currentlyRunning = true;
      this.hoveringAbilityCard = ability;
      this.hoveringAbilityHand = canUse;

      if (canUse.length > 0 || ability.cost[ability.level - 1].length === 0) {
        this.setAttackArrowsPlayerAbility();
      }
    }
  }

  useMemorizedCards(ability: AbilityCard): CardDto[] {
    // Check before running again
    const foundAbilityCombo = this.abilityCardCombos.find(
      (x) => x.id === ability.id
    );
    const playerHand = this.playerHand;
    let hasSameSuits = false;
    if (playerHand && foundAbilityCombo && foundAbilityCombo.shuffledCards) {
      hasSameSuits = this.cardService.hasSameSuits(
        foundAbilityCombo?.shuffledCards[foundAbilityCombo.currentIndex],
        playerHand
      );
    }

    const foundItem = this.abilityCardCombos.find((x) => x.id === ability.id);

    if (foundItem && hasSameSuits) {
      return foundItem.cards[foundItem.currentIndex];
    }

    return this.playerHand;
  }

  hoverAbilityEnter(ability: AbilityCard) {
    // If currently running, return
    if (this.currentlyRunning || this.usedAbilityCard) {
      return;
    }

    const playerHand = this.useMemorizedCards(ability);
    const canUse: CardDto[] = this.abilityService.checkCanUseAbility(
      ability,
      playerHand
    );

    if (
      canUse.length < 1 &&
      ability.cost.length > 0 &&
      ability.cost[ability.level - 1].length !== 0
    ) {
      return;
    }

    if (!this.currentlyRunning) {
      this.currentlyRunning = true;
      this.hoveringAbilityCard = ability;
      this.hoveringAbilityHand = canUse;

      if (canUse.length > 0 || ability.cost[ability.level - 1].length === 0) {
        this.setAttackArrowsPlayerAbility();
      }
    }
  }

  showFireAnimation(player: PlayerDto) {
    const foundPlayer = this.flamesOnEnemies.find((x) => x.id === player.id);
    if (foundPlayer) {
      return true;
    }

    return false;
  }

  showShieldAnimation(player: PlayerDto) {
    const foundPlayer = this.shieldOnEnemies.find((x) => x.id === player.id);
    if (foundPlayer) {
      return true;
    }

    return false;
  }

  showLeachAnimation(player: PlayerDto) {
    const foundPlayer = this.leachOnEnemies.find((x) => x.id === player.id);
    if (foundPlayer) {
      return true;
    }
    return false;
  }

  showHealAnimationBot(player: PlayerDto): boolean {
    const foundPlayer = this.healOnEnemies.find((x) => x.id === player.id);
    if (foundPlayer) {
      return true;
    }
    return false;
  }

  showAddDefenseAnimationBot(player: PlayerDto): boolean {
    const foundPlayer = this.addDefenseOnEnemies.find(
      (x) => x.id === player.id
    );
    if (foundPlayer) {
      return true;
    }
    return false;
  }

  showSupportAnimationBot(player: PlayerDto): boolean {
    const foundPlayer = this.supportOnEnemies.find((x) => x.id === player.id);
    if (foundPlayer) {
      return true;
    }
    return false;
  }

  async hoverAbilityOut(ability: AbilityCard) {
    if (this.usedAbilityCard) {
      return;
    }

    this.errorAbilityCard = {
      id: 0,
      boosterId: 0,
      abilityFunction: 'damage',
      targetAll: false,
      abilityValue: [1, 2, 3],
      cost: [['hearts'], ['hearts'], ['hearts']],
      description: ['', '', ''],
      image: 'sliceAbility.png',
      level: 1,
      name: '',
      hitAnimation: 'heal',
      isNew: false,
      numberOwned: 1,
      trueNumberOwned: 1,
      goldCost: [0, 0, 0],
      alliesCalled: [],
    };
    this.hoveringAbilityHand = [];
    this.hoveringAbilityCard = {
      id: 0,
      boosterId: 0,
      abilityFunction: 'damage',
      targetAll: false,
      abilityValue: [1, 2, 3],
      cost: [['hearts'], ['hearts'], ['hearts']],
      description: ['', '', ''],
      image: 'sliceAbility.png',
      level: 1,
      name: '',
      hitAnimation: 'heal',
      isNew: false,
      numberOwned: 1,
      trueNumberOwned: 1,
      goldCost: [0, 0, 0],
      alliesCalled: [],
    };
    this.currentlyRunning = false;
    try {
      for await (const x of this.activeAbilityLeaderLines) {
        await x.hide('fade', { duration: 100, timing: 'linear' });
      }
      this.activeAbilityLeaderLines = [];
    } catch (err) {
      this.activeAbilityLeaderLines = [];
      console.log(err);
    }
  }

  abilityCardIsSelected(ability: AbilityCard): boolean {
    const includesAbility = this.hoveringAbilityCard.id === ability.id;

    if (includesAbility) {
      // Test lines
      return true;
    }
    return false;
  }

  abilityCardIsSelectedBot(ability: AbilityCard): boolean {
    const includesAbility = this.hoveringAbilityCardBot.id === ability.id;

    if (includesAbility) {
      // Test lines
      return true;
    }
    return false;
  }

  abilityCardIsValid(ability: AbilityCard): boolean {
    return false;
  }

  cardIsValidForAbilityCard(card: CardDto): boolean {
    const includesCard = this.hoveringAbilityHand.find(
      (x: CardDto) => x.id === card.id
    );

    if (includesCard) {
      // Test lines
      return true;
    }
    return false;
  }

  cardIsValidForAbility(card: AbilityCard): boolean {
    const includesAbility = this.hoveringAbilityCard.id === card.id;

    if (includesAbility) {
      // Test lines
      return true;
    }
    return false;
  }

  async setAttackArrowsPlayerAbilityDamage() {
    try {
      const abilityCards = this.activeAbilityCards;
      await this.timeout(150);
      let foundTarget: ElementRef | undefined;
      if (abilityCards) {
        for await (const x of abilityCards) {
          if (x.nativeElement.className.includes('abilityIsActiveTarget')) {
            foundTarget = x.nativeElement;
          }
        }
      }
      let foundEnemyTarget: ElementRef | undefined;
      if (this.enemyPlayerRef) {
        for await (const x of this.enemyPlayerRef) {
          if (x.nativeElement.className.includes('enemyAbilityTarget')) {
            foundEnemyTarget = x.nativeElement;
          }
        }
      }
      if (foundTarget && foundEnemyTarget) {
        try {
          for await (const x of this.activeAbilityLeaderLines) {
            await x.hide('fade', { duration: 100, timing: 'linear' });
          }
        } catch (err) {
          console.log(err);
        }
        const myNewActiveLines: any[] = [];
        const myLineOptions: any = {
          dash: { animation: true },
          endSocket: 'bottom',
          startSocket: 'top',
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
          foundTarget,
          foundEnemyTarget,
          myLineOptions
        );
        myNewLine.show('draw', { duration: 200, timing: 'linear' });
        myNewActiveLines.push(myNewLine);
        this.activeAbilityLeaderLines = myNewActiveLines;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async setAttackArrowsPlayerAbility() {
    try {
      const abilityCards = this.activeAbilityCards;
      await this.timeout(150);
      let foundTarget: ElementRef | undefined;
      if (abilityCards) {
        for await (const x of abilityCards) {
          if (x.nativeElement.className.includes('abilityIsActive')) {
            foundTarget = x.nativeElement;
          }
        }
      }

      if (this.currentlyRunning && foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.myActiveCards) {
          try {
            for await (const x of this.activeAbilityLeaderLines) {
              await x.hide('fade', { duration: 100, timing: 'linear' });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.myActiveCards) {
            if (x.nativeElement.className.includes('abilityActiveCard')) {
              const myLineOptions: any = {
                dash: { animation: true },
                endSocket: 'top',
                startSocket: 'top',
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
                foundTarget,
                x.nativeElement,
                myLineOptions
              );
              myNewLine.show('draw', { duration: 200, timing: 'linear' });
              myNewActiveLines.push(myNewLine);
            }
          }
        }
        this.activeAbilityLeaderLines = myNewActiveLines;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async setAttackArrowsEnemyAbility() {
    try {
      const abilityCards = this.activeAbilityCardsBot;
      await this.timeout(250);
      let foundTarget: ElementRef | undefined;
      if (abilityCards) {
        for await (const x of abilityCards) {
          if (x.nativeElement.className.includes('abilityIsActive')) {
            foundTarget = x.nativeElement;
          }
        }
      }

      if (foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.activeEnemyCards) {
          try {
            for await (const x of this.activeAbilityLeaderLines) {
              await x.hide('fade', { duration: 100, timing: 'linear' });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.activeEnemyCards) {
            if (x.nativeElement.className.includes('activeEnemyCard')) {
              const myLineOptions: any = {
                dash: { animation: true },
                endSocket: 'bottom',
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
                foundTarget,
                x.nativeElement,
                myLineOptions
              );
              myNewLine.show('draw', { duration: 200, timing: 'linear' });
              myNewActiveLines.push(myNewLine);
            }
          }
        }
        this.activeAbilityLeaderLines = myNewActiveLines;
      }
    } catch (err) {
      console.log(err);
    }
  }

  updateDeckBasedOnPlayerSkills() {
    // // What range can wild cards go
    const Player = this.player.skills;

    this.Cards = this.Cards.map((x) => {
      let alteredCard = x;

      let shownWildSuits = [0, 0, 0, 0];
      // Update Shown Suits
      if (Player?.showWildHearts) {
        shownWildSuits[0] = 1;
      }
      if (Player?.showWildDiamonds) {
        shownWildSuits[1] = 1;
      }
      if (Player?.showWildSpades) {
        shownWildSuits[2] = 1;
      }
      if (Player?.showWildClubs) {
        shownWildSuits[3] = 1;
      }

      // Wild Suit Cards //
      if (Player?.wildHearts && x.suit === 'hearts') {
        // All Hearts Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      if (Player?.wildDiamonds && x.suit === 'diamonds') {
        // All Diamonds Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      if (Player?.wildSpades && x.suit === 'spades') {
        // All Spades Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      if (Player?.wildClubs && x.suit === 'clubs') {
        // All Clubs Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      // Wild Range Cards //
      if (
        Player?.rangeHearts &&
        Player?.rangeHearts > 0 &&
        x.suit === 'hearts'
      ) {
        // All Hearts Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildRange: Player?.rangeHearts,
        };
      }

      if (
        Player?.rangeDiamonds &&
        Player?.rangeDiamonds > 0 &&
        x.suit === 'diamonds'
      ) {
        // All Diamonds Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildRange: Player?.rangeDiamonds,
        };
      }

      if (
        Player?.rangeSpades &&
        Player?.rangeSpades > 0 &&
        x.suit === 'spades'
      ) {
        // All Spades Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildRange: Player?.rangeSpades,
        };
      }

      if (Player?.rangeClubs && Player?.rangeClubs > 0 && x.suit === 'clubs') {
        // All Clubs Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildRange: Player?.rangeClubs,
        };
      }

      return alteredCard;
    });

    if (this.allCardsWild) {
      this.Cards = this.Cards.map((x) => {
        return {
          ...x,
          wild: true,
          wildRange: 14,
          wildSuit: true,
          wildSuits: [1, 1, 1, 1],
        };
      });
    }
  }

  @HostListener('document:keypress', ['$event'])
  giveHint(event: KeyboardEvent) {
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
    this.playerService.playSound('button.mp3');

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
    this.selectedCards = this.selectedCards.map((x) => {
      const foundCard = this.playerHand.find((a) => a.id === x.id);

      if (foundCard) {
        return foundCard;
      }

      return x;
    });
    this.determineSubtractValue();
  }

  wildCardScrollChange(scroll: any, card: CardDto) {
    if (this.doingWildCardChange || !card.wild) {
      return;
    }

    // Wild, ability to scroll card with limited range
    this.doingWildCardChange = true;
    if (scroll.deltaY < 0 && card.wild) {
      // scroll up
      let value = Number(card.value) + 1;
      const currentValue = Number(card.wildCurrent) + 1;

      if (value > 14) {
        value = 2;
      }

      if (
        value < 15 &&
        (Math.abs(currentValue) <= Number(card.wildRange) ||
          card.wildRange === 14)
      ) {
        let newCurrent = currentValue.toString();
        if (card.wildRange === 14) {
          newCurrent = '0';
        }

        const newCard: CardDto = {
          ...this.Cards.find(
            (a: CardDto) => a.suit === card.suit && a.value === value.toString()
          ),
          wildInitial: card.wildInitial,
          wildCurrent: newCurrent,
          wildRange: card.wildRange,
          wildSuit: card.wildSuit,
          wildSuits: card.wildSuits,
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
      let value = Number(card.value) - 1;
      const currentValue = Number(card.wildCurrent) - 1;
      if (value < 2) {
        value = 14;
      }

      if (
        (value > 1 && Math.abs(currentValue) <= Number(card.wildRange)) ||
        card.wildRange === 14
      ) {
        let newCurrent = currentValue.toString();
        if (card.wildRange === 14) {
          newCurrent = '0';
        }

        const newCard: CardDto = {
          ...this.Cards.find(
            (a: CardDto) => a.suit === card.suit && a.value === value.toString()
          ),
          wildInitial: card.wildInitial,
          wildCurrent: newCurrent,
          wildRange: card.wildRange,
          wildSuit: card.wildSuit,
          wildSuits: card.wildSuits,
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
    this.determineSubtractValue();
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

  hoverAbilityPlayerIn(card: PlayerDto) {
    if (this.currentAbility.id !== 0 && !this.startedAbilityTurn) {
      this.abilityEnemyTarget = card.id;
      this.setAttackArrowsPlayerAbilityDamage();
    }
  }

  hoverAbilityPlayerOut(card: PlayerDto) {
    if (!this.startedAbilityTurn) {
      this.abilityEnemyTarget = 0;
    }
  }

  setEnemyPlayerHoverTarget(card: PlayerDto) {
    if (this.currentAbility.id !== 0) {
      this.enemyTarget = card.id;
      this.staticEnemyTarget = this.enemyTarget;
      this.abilityEnemyTarget = this.enemyTarget;

      if (this.currentAbility.abilityFunction === 'damage') {
        this.onSelectTargetAbilityFire();
      }

      if (this.currentAbility.abilityFunction === 'offense') {
        this.onSelectTargetAbilityOffense();
      }

      if (this.currentAbility.abilityFunction === 'leach') {
        this.onSelectTargetAbilityLeach();
      }

      return;
    }

    if (card && card.id !== this.enemyTarget && this.canSelectCards) {
      this.playerService.playSound('button.mp3');
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
    return enemyPlayer ?? defaultPlayer;
  }

  findEnemyPlayerAttack(): PlayerDto {
    const enemyPlayer = this.currentEnemyTurn;
    return (
      enemyPlayer ?? {
        id: 0,
        health: 1,
        attack: 1,
        image: 'goomba.png',
        name: '',
        baseHealth: 1,
        baseAttack: 1,
        level: 1,
      }
    );
  }

  findStaticEnemyPlayer(): PlayerDto {
    const enemyPlayer = this.enemyPlayers.find(
      (x) => x.id === this.staticEnemyTarget
    );
    return enemyPlayer ?? defaultPlayer;
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

  hideRedrawPanel() {
    if (
      this.firstLevel &&
      this.firstLevel.dialogStart &&
      this.firstLevel.dialogStart.length > 0 &&
      !this.hideDialog
    ) {
      this.redrawing = false;
      setTimeout(() => {
        this.redrawHide = true;
        this.displayDialog = true;
      }, 1000);
    } else {
      this.finishedRedraw();
    }
  }

  finishedDialog() {
    // Finished dialog, populate redraw cards
    this.displayDialog = false;
    this.finishedRedraw();
  }

  startEndDialogCombat() {
    if (
      this.currentCombatPhase &&
      this.currentCombatPhase.dialogEnd &&
      this.currentCombatPhase.dialogEnd.length > 0 &&
      !this.hideDialog
    ) {
      this.displayDialogCombat = true;
      this.dialogArrayCombat = this.currentCombatPhase.dialogEnd;
      this.currentCombatPhase.dialogEnd = [];
    }
  }

  finishedDialogCombat() {
    this.displayDialogCombat = false;
    this.nextCombatPhaseBot(true);
  }

  startEndDialogGameEnd() {
    if (
      this.currentCombatPhase &&
      this.currentCombatPhase.dialogEnd &&
      this.currentCombatPhase.dialogEnd.length > 0 &&
      !this.hideDialog
    ) {
      this.comicData = this.currentLevel?.comicData ?? {
        comics: [],
        display: false,
        id: 0,
      };
      this.showComic = this.currentLevel?.showComicEnd ?? false;
      this.displayDialogGameEnd = true;
      this.dialogArrayGameEnd = this.currentCombatPhase.dialogEnd;
      this.currentCombatPhase.dialogEnd = [];

      console.log(this.currentLevel?.showComicEndOnly);
      console.log(this.currentLevel?.showComicEndOnly ?? false);
      if (this.currentLevel?.showComicEndOnly ?? false) {
        console.log(this.currentLevel?.showComicEndOnly ?? false);
        this.tempHideComic = true;

        this.showComic = this.currentLevel?.showComicEndOnly ?? false;
        this.comicData = this.currentLevel?.comicDataEndOnly ?? {
          comics: [],
          display: false,
          id: 0,
        };
        console.log(this.comicData);
        setTimeout(() => {
          this.tempHideComic = false;
        }, 500);
      }
    } else {
      this.endGame(true);
    }
  }

  finishedDialogGameEnd() {
    this.displayDialogGameEnd = false;
    this.endGame(true);
  }

  finishedRedraw() {
    this.redrawing = false;
    setTimeout(() => {
      this.pushMessage('Player Turn');
      this.disableAttackBtn = false;
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
      this.drawAbilityCard(2);
      this.drawAbilityCardBot(2);
      this.redrawSelectedCards.forEach((x, i) => {
        this.redrawCards.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
      });

      // Add cards to bot hand
      for (const num of [0, 1, 2, 3, 4]) {
        // Add to player 1 hand and remove player 1 deck
        this.enemyHand.push(this.enemyDeck[0]);
        this.enemyDeck.push(this.enemyDeck[0]);
        this.enemyDeck.shift();
      }
      setTimeout(() => {
        if (this.playerDeck[0] && this.playerDeck[0].id) {
          this.topRedrawCard = this.playerDeck[0].id;
        }
        if (this.enemyDeck[0] && this.enemyDeck[0].id) {
          this.topRedrawCardEnemy = this.enemyDeck[0].id;
        }
      }, 400);

      this.playerHand = this.redrawCards;
    }, 900);
  }

  selectRedrawCard(card: CardDto) {
    const includesCard = this.redrawSelectedCards.find(
      (x: CardDto) => x.id === card.id
    );

    this.playerService.playSound('cardFlip.mp3');

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
    if (this.currentAbility.abilityFunction === 'wildSuit') {
      this.onSelectTargetAbilityWildSuit(card);
      return;
    }

    if (this.currentAbility.abilityFunction === 'wildRange') {
      this.onSelectTargetAbilityWildRange(card);
      return;
    }

    if (this.currentAbility.abilityFunction === 'wildSuitRange') {
      this.onSelectTargetAbilityWildSuitRange(card);
      return;
    }

    if (this.canSelectCards) {
      this.playerService.playSound('cardFlip.mp3');
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

    if (hand.valid && !this.enemyAttackStarted) {
      this.validCards = this.selectedCards;
      this.setAttackArrowsPlayer(true);
    } else if (!this.enemyAttackStarted) {
      this.setAttackArrowsPlayer(false);
      this.validCards = [];
    }
    this.determineSubtractValue();
  }

  async setAttackArrowsPlayer(valid: boolean) {
    try {
      const foundValidEnemy = this.enemyPlayers.find((x) => x.health > 0);
      if (this.enemyTarget === 0 && foundValidEnemy) {
        this.enemyTarget = foundValidEnemy.id;
        this.staticEnemyTarget = this.enemyTarget;
      }
      await this.timeout(150);
      let foundTarget: ElementRef | undefined;
      if (this.enemyPlayerRef) {
        for await (const x of this.enemyPlayerRef) {
          if (x.nativeElement.className.includes('errorEnemyBorder')) {
            foundTarget = x.nativeElement;
          }
        }
      }

      if (foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.myActiveCards) {
          try {
            for await (const x of this.activeLeaderLines) {
              await x.hide('fade', { duration: 100, timing: 'linear' });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.myActiveCards) {
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
          }
        }
        this.activeLeaderLines = myNewActiveLines;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async setAttackArrowsEnemy() {
    try {
      this.playerTarget = this.player.id;
      await this.timeout(150);
      let foundTarget: ElementRef | undefined;
      if (this.playerRef) {
        for await (const x of this.playerRef) {
          if (x.nativeElement.className.includes('errorEnemyBorder')) {
            foundTarget = x.nativeElement;
          }
        }
      }
      if (foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.activeEnemyCards) {
          try {
            for await (const x of this.activeLeaderLines) {
              await x.hide('fade', { duration: 100, timing: 'linear' });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.activeEnemyCards) {
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
          }
        }

        this.activeLeaderLines = myNewActiveLines;
      }
    } catch (err) {
      console.log(err);
    }
  }

  attackButtonEnabled(): boolean {
    const validAttackHand =
      this.cardService.determineHand(this.selectedCards).valid ?? false;
    return validAttackHand && this.canSelectCards;
  }

  async attack(isGuide: boolean = false) {
    if (this.disableAttackBtn) {
      return;
    }
    this.playerService.playSound('button.mp3');

    if (this.selectedCards.length === 0 && this.playerHand.length === 0) {
      this.newTurn();
      await this.addCardsToBothHands();

      // Player turn ends

      // Bot auto discard
      this.botDiscardPhase();

      if (this.playerHand.length < 6) {
        this.startBotTurnsLoop();
        this.pushError('Enemy Turn');
        this.usedSpecialCardThisTurn = false;
      } else if (!this.showGuide) {
        // If player needs to discard
        this.enemyNextTurn = true;
        this.playerDiscardPhase();
      }
    } else {
      const hand: DetermineObject = this.cardService.determineHand(
        this.selectedCards
      );
      if (hand.name === 'Four of a Kind') {
        this.achievementService.unlockNewAchievement(5);
      }
      if (hand.name === 'Full House') {
        this.achievementService.unlockNewAchievement(6);
      }
      if (hand.name === 'Flush') {
        this.achievementService.unlockNewAchievement(7);
      }

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

      this.attackStarted = true;
      try {
        for await (const x of this.activeLeaderLines) {
          await x.hide('fade', { duration: 100, timing: 'linear' });
        }
      } catch (err) {
        console.log(err);
      }
      // Valid attack hand, commence battle
      this.playerAttackHand = hand;
      if (!isGuide) {
        this.initiateBotDefense(hand);
      }
    }
  }

  async initiateBotDefense(playerHand: DetermineObject) {
    const addLengthEnemy =
      this.enemyPlayers.find((x) => x.id === this.currentEnemyTurn.id)
        ?.attack ?? 0;

    if (addLengthEnemy === 0) {
      const foundEnemy = this.enemyPlayers.find(
        (x) => x.id === this.enemyTarget
      );
      await this.addBotCardsToHand(foundEnemy?.attack ?? 0);
    } else {
      await this.addBotCardsToHand(addLengthEnemy);
    }

    setTimeout(() => {
      if (this.enemyHand.length > 0) {
        const botHand: DetermineObject =
          this.cardService.generateBotDefenseHand(
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
        }, 500 - this.BattleDelay); // 300
      } else {
        setTimeout(() => {
          this.enemyAttackHand = {
            cards: [],
            highCard: 0,
            valid: false,
            power: 0,
            name: '',
            ranking: 0,
          };
          this.enemyDefense = [];

          // Play animations for attacking cards
          // Determine winner
          const result = this.cardService.determineWinner(
            playerHand,
            this.enemyAttackHand
          );
          this.setWinner(result, true);
        }, 500 - this.BattleDelay); // 300
      }
    }, 1000 - this.AbilityDelay); // 500
  }

  async numbersGoUpIncrementallyPlayer(
    currentHealth: number,
    newHealth: number
  ) {
    const difference = newHealth - currentHealth;
    const differentArr = Array.from(Array(difference).keys());

    for await (const i of differentArr) {
      const updateHealth = currentHealth + (i + 1);
      await this.timeout(100 * i);
      this.player.health = updateHealth;
    }
  }

  async numbersGoDownIncrementallyBot(
    currentHealth: number,
    newHealth: number
  ) {
    const enemyTarget = this.enemyTarget;
    const difference = currentHealth - newHealth;
    const foundIndex = this.enemyPlayers.findIndex((x) => x.id === enemyTarget);

    const differentArr = Array.from(Array(difference).keys());
    for await (const i of differentArr) {
      const newEnemyHealth = currentHealth - (i + 1);
      await this.timeout(100 * i);
      this.enemyPlayers[foundIndex] = {
        ...this.enemyPlayers[foundIndex],
        health: newEnemyHealth,
      };
    }
  }

  async numbersGoDownIncrementally(
    currentHealth: number,
    newHealth: number,
    isAttackingPlayer: boolean = false,
    defaultTimeout: number = this.DefaultTimeoutDelay // 2500 / 1000
  ) {
    const enemyTarget = this.enemyTarget;
    await this.timeout(defaultTimeout);
    this.playerService.playSound('attack.mp3');
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
        const newEnemyHealth = currentHealth - (i + 1);
        const updateHealth = newEnemyHealth - this.currentExtraDmg;
        await this.timeout(100 * i);
        this.enemyPlayers[foundIndex] = {
          ...this.enemyPlayers[foundIndex],
          health: updateHealth,
        };
      }
    }

    if (defaultTimeout === this.DefaultTimeoutDelay) {
      this.wrappingTurn = true;
      return await this.timeout(1000 - this.AbilityDelay);
    } else {
      return;
    }
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async setWinner(result: DetermineWinnerObject, playerTurn: boolean) {
    if (playerTurn) {
      this.combatFinishPlayer(result);
    } else {
      this.combatFinishBot(result);
    }
  }

  async combatFinishPlayer(result: DetermineWinnerObject) {
    // Player finishes combat
    // If player won combat, attack selected opponent
    let extraTimeout: number = 0;
    if (result.player1Winner) {
      this.playerWinner = true;
      this.enemyLoser = true;
      for await (const x of this.enemyPlayers) {
        if (x.id === this.enemyTarget && result.player1Determine.power) {
          const incomingAttackPower = result.player1Determine.power;
          extraTimeout = incomingAttackPower;
          const newHealth = x.health - incomingAttackPower;
          console.log(
            'Player Wins Attack: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, this.DefaultNumbersDelay);
        }
      }
    }
    // Fail
    if (result.player2Winner) {
      this.enemyWinner = true;
      this.playerLoser = true;

      const incomingAttackPower = this.enemyDefense.length;
      extraTimeout = incomingAttackPower;
      const newHealth = this.player.health - incomingAttackPower;
      console.log(
        'Bot Defended: Attacking player for ' + incomingAttackPower + ' damage'
      );
      setTimeout(() => {
        this.numbersGoDownIncrementally(this.player.health, newHealth, true);
      }, this.DefaultNumbersDelay);
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
          extraTimeout = incomingAttackPower;
          const newHealth = x.health - incomingAttackPower;
          console.log(
            'Player Wins Attack: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, this.DefaultNumbersDelay);
        }
      }
    }

    const shouldEndGame = this.checkEndGame();
    if (shouldEndGame) {
      return;
    }

    const extraTime = extraTimeout * 100;
    const totalWaitTime = this.TotalWaitDelay + extraTime; // 3500 or 2000
    await this.timeout(totalWaitTime);
    this.attackEnding = true;
    await this.timeout(this.TotalMiniWaitDelay); // 500 or 300
    this.attackStarted = false;
    this.newTurn();
    await this.addCardsToBothHands();

    // Player turn ends

    // Bot auto discard
    this.botDiscardPhase();

    if (this.playerHand.length < 6) {
      this.startBotTurnsLoop();
      this.pushError('Enemy Turn');
      this.usedSpecialCardThisTurn = false;
    } else if (!this.showGuide) {
      // If player needs to discard
      this.enemyNextTurn = true;
      this.playerDiscardPhase();
    }
  }

  checkEndGame(): boolean {
    // Check if victory
    if (this.player.health < 1) {
      setTimeout(() => {
        this.endGame(false);
      }, 2000);
      return true;
    }

    // Check if defeated
    const aliveEnemies = this.enemyPlayers.filter((x) => x.health > 0);
    if (aliveEnemies.length < 1) {
      if (this.allCombatPhases && this.allCombatPhases.length !== 0) {
        this.nextCombatPhaseBot(true);
        return true;
      } else {
        setTimeout(() => {
          if (!this.hideDialog) {
            this.startEndDialogGameEnd();
          } else {
            this.displayDialogGameEnd = false;
            this.endGame(true);
          }
        }, this.EndGameDelay); // 2000 or 800
        return true;
      }
    }

    return false;
  }

  surrender() {
    this.checkSurrender = false;
    this.gameLoserPlayer = true;
    this.rewardItems = [];
    this.rewardItemsClean = [];
    setTimeout(() => {
      this.finishedRewards = true;
    }, 2500);
  }

  levelUpPlayer() {
    if (this.player.level === 3) {
      this.finishHeroLevelUp();
      return;
    }
    // Gradually increase xp
    setTimeout(() => {
      this.gradualXpIncrease();
    }, 800);
  }

  async gradualXpIncrease() {
    if (this.player.xpLevels && (this.player.xp === 0 || this.player.xp)) {
      const increaseValue = this.battleRewardXp;
      const increaseArr = Array.from(Array(increaseValue).keys());

      for await (const x of increaseArr) {
        this.player.xp = this.player.xp + 1;
        this.battleRewardXp = this.battleRewardXp - 1;

        if (
          this.player.xp === this.player.xpLevels[this.player.level - 1] &&
          !this.player.isMaxLevel
        ) {
          // Level up character
          this.leveledUp = true;
          this.player.xp = 0;
          this.player.level = this.player.level + 1;

          // If player
          if (this.player.level > 3) {
            this.player.isMaxLevel = true;
            this.achievementService.unlockNewAchievement(9);
            this.player.level = 3;
          }
        }
        await this.timeout(25);
      }

      if (this.leveledUp) {
        await this.timeout(2700);
        this.finishHeroLevelUp();
      } else {
        await this.timeout(1700);
        this.finishHeroLevelUp();
      }
    }
  }

  finishHeroLevelUp() {
    if (this.leveledUp) {
      this.rewardItems = this.rewardItemsClean;
      this.showHeroLevelUp = false;
      setTimeout(() => {
        this.canClickNextReward = true;
        this.nextReward({ id: 0 });
      }, 399);
    } else {
      setTimeout(() => {
        this.showHeroLevelUp = false;
        this.canClickNextReward = true;
        this.nextReward({ id: 0 });
      }, 399);
    }
  }

  determineXpValues(): string {
    if ((this.player.xp === 0 || this.player.xp) && this.player.xpLevels) {
      const current = this.player.xp;
      const total = this.player.xpLevels[this.player.level - 1];

      // Check if max level
      if (this.player.isMaxLevel) {
        return 'Max Level';
      }

      return `${current}/${total}`;
    }

    return '';
  }

  determineWidthXp(): string {
    if (this.player.xpLevels && (this.player.xp === 0 || this.player.xp)) {
      const currentXp: number = this.player.xp;
      const totalXp: number = this.player.xpLevels[this.player.level - 1];
      const percentageXp = (currentXp / totalXp) * 98;
      if (percentageXp > 98 || this.player.isMaxLevel) {
        return '98%';
      }
      return percentageXp + '%';
    }
    return '98%';
  }

  endGame(playerWon: boolean) {
    this.playerService.stopCurrentAudio();
    if (playerWon) {
      localStorage.setItem('gameStartedYet', JSON.stringify(true));
      let challengeFlags: FlagDto[] =
        this.localStorageService.getChallengeFlags();
      challengeFlags = challengeFlags.map((x) => {
        if (x.id === this.currentLevel?.id) {
          return { ...x, levelStatus: 'finished' };
        }
        return x;
      });
      this.localStorageService.setChallengeFlags(challengeFlags);
      setTimeout(() => {
        this.gameWinnerPlayer = true;
        this.playerService.playSound('victory.mp3');
      }, this.VictoryEnd1000);
      if (this.playerLevelUpEnabled) {
        setTimeout(() => {
          this.showHeroLevelUp = true;
        }, this.VictoryEnd4300);
        setTimeout(() => {
          this.levelUpPlayer();
        }, this.VictoryEnd4300 + 300);
      } else {
        setTimeout(() => {
          this.showHeroLevelUp = false;
          this.canClickNextReward = true;
          this.nextReward({ id: 0 });
        }, this.VictoryEnd3500);
      }
    } else {
      localStorage.setItem('gameStartedYet', JSON.stringify(true));
      setTimeout(() => {
        this.playerService.playSound('defeat.mp3');
        this.gameLoserPlayer = true;
        this.rewardItems = [];
        this.rewardItemsClean = [];
      }, this.VictoryEnd1000);
      setTimeout(() => {
        this.finishedRewards = true;
      }, this.VictoryEnd4300);
    }
  }

  determineSubtractValue() {
    const extraDmg = this.cardService.determineExtraDamage(
      this.selectedCards,
      this.player
    );
    this.currentExtraDmg = extraDmg;
  }

  botDiscardPhase() {
    if (this.enemyHand.length > 5) {
      // Reduce array to 5
      this.enemyHand = this.enemyHand.filter((x, i) => {
        // 0, 1, 2, 3, 4
        if (i < 5) {
          return true;
        }
        return false;
      });
    }
  }

  playerDiscardPhase() {
    // Show discard window
    this.discarding = true;
    this.discardHide = false;
    this.discardCards = this.playerHand;
    this.duringBotTurnDiscard = false;
    this.playerHand = [];
  }

  playerDiscardPhaseExtra() {
    // Show discard window
    this.discarding = true;
    this.discardHide = false;
    this.discardCards = this.playerHand;
    this.playerHand = [];

    this.duringBotTurnDiscard = true;
  }

  finishedDiscarding() {
    if (this.discardCards.length - this.discardSelectedCards.length !== 5) {
      this.errorList.push('test');
      return;
    }

    this.playerService.playSound('button.mp3');
    // finished
    this.discardCards = this.discardCards.filter((x) => {
      const foundCard = this.discardSelectedCards.find((a) => a.id === x.id);
      if (!foundCard) {
        return true;
      }

      return false;
    });
    this.playerHand = this.discardCards;
    this.discarding = false;

    setTimeout(() => {
      this.discardHide = true;
    }, 1000);

    if (this.duringBotTurnDiscard) {
      this.startBotTurn();
      return;
    }

    if (this.enemyNextTurn) {
      this.completedEnemyTurns = [];
      this.startBotTurnsLoop();
      this.pushError('Enemy Turn');
      this.addCardsToBothHands();
      this.usedSpecialCardThisTurn = false;
    } else {
      this.completedEnemyTurns = [];
      this.pushMessage('Player Turn');
      this.addCardsToBothHands();
      this.newTurn();
    }
  }

  discardCardIsSelected(card: CardDto) {
    const includesCard = this.discardSelectedCards.find(
      (x: CardDto) => x.id === card.id
    );
    if (includesCard) {
      return true;
    }
    return false;
  }

  selectDiscardCard(card: CardDto) {
    const includesCard = this.discardSelectedCards.find(
      (x: CardDto) => x.id === card.id
    );
    this.playerService.playSound('cardFlip.mp3');

    // Add card to selectedCards
    if (
      !includesCard &&
      this.discardCards.length - this.discardSelectedCards.length !== 5
    ) {
      this.discardSelectedCards.push(card);
    }
    // Remove card from selectedCards
    if (includesCard) {
      this.discardSelectedCards = this.discardSelectedCards.filter(
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

  startBotTurnsLoop() {
    const shouldEndGame = this.checkEndGame();
    if (shouldEndGame) {
      return;
    }

    // Find next valid attack enemy
    let foundValidEnemy = false;
    const nextEnemy = this.enemyPlayers.find((x: PlayerDto) => {
      // Turn already done? return
      if (this.completedEnemyTurns.includes(x.id)) {
        return;
      }

      // Health is 0 or lower? return
      if (x.health < 1) {
        return;
      }

      // If health is greater than 0 and turn length is 0, first enemy, draw ability cards
      const isValidEnemy = this.enemyPlayers.find((x) => x.health > 0);
      if (
        this.completedEnemyTurns.length === 0 &&
        isValidEnemy &&
        isValidEnemy.id === x.id &&
        !foundValidEnemy
      ) {
        foundValidEnemy = true;
        if (this.abilityCardsHandBot.length === 0) {
          this.drawAbilityCardBot(2);
        }
      }

      if (!this.completedEnemyTurns.includes(x.id)) {
        this.currentEnemyTurn = x;
        this.startBotTurn();
        return true;
      }

      return;
    });

    if (!nextEnemy) {
      // Bot auto discard
      this.botDiscardPhase();
      this.drawAbilityCard(2);

      if (this.playerHand.length < 6) {
        this.completedEnemyTurns = [];
        this.addCardsToBothHands();
        this.newTurn();
        this.pushMessage('Player Turn');
      } else if (!this.showGuide) {
        // If player needs to discard
        this.enemyNextTurn = false;
        this.playerDiscardPhase();
      }
    }
  }

  async addCardsToBothHands() {
    const addLength = 5 - this.playerHand.length;
    const addLengthEnemy = 5 - this.enemyHand.length;

    this.addPlayerCardsToHand(addLength);
    this.addBotCardsToHand(addLengthEnemy);
  }

  async addBotCardsToHand(addLength: number) {
    if (addLength > 0) {
      const addArrEnemy = Array.from(Array(addLength).keys());
      let i = 1;
      for await (const x of addArrEnemy) {
        this.enemyHand.push(this.enemyDeck[0]);
        this.enemyDeck.push(this.enemyDeck[0]);
        this.enemyDeck.shift();
        setTimeout(() => {
          this.playerService.playSound('cardFlip.mp3');
        }, i * 200);
        i++;
      }
      await this.timeout(400);
      if (this.enemyDeck[0] && this.enemyDeck[0].id) {
        this.topRedrawCardEnemy = this.enemyDeck[0].id;
      }
    }
  }

  async addPlayerCardsToHand(addLength: number) {
    if (addLength > 0) {
      const addArr = Array.from(Array(addLength).keys());
      let i = 1;
      for await (const x of addArr) {
        this.playerHand.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
        setTimeout(() => {
          this.playerService.playSound('cardFlip.mp3');
        }, i * 200);
        i++;
      }
      this.topRedrawCard = 0;
      await this.timeout(400);
      if (this.playerDeck[0] && this.playerDeck[0].id) {
        this.topRedrawCard = this.playerDeck[0].id;
      }
    }
  }

  isFinishedWithTurn(player: PlayerDto): boolean {
    const isFinished = this.completedEnemyTurns.includes(player.id);
    return isFinished ? true : false;
  }

  async combatFinishBot(result: DetermineWinnerObject) {
    // Bot finishes combat

    // Success, player defended
    let extraTimeout: number = 0;
    if (result.player1Winner) {
      this.playerWinner = true;
      this.enemyLoser = true;
      // Attack bot for 1 damage
      this.enemyTarget = this.findStaticEnemyPlayer().id;
      this.staticEnemyTarget = this.findStaticEnemyPlayer().id;
      for await (const x of this.enemyPlayers) {
        if (x.id === this.enemyTarget) {
          const incomingAttackPower = this.selectedCards.length;
          extraTimeout = incomingAttackPower;
          console.log(
            'Player Defended: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          const newHealth = x.health - incomingAttackPower;
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, this.DefaultNumbersDelay);
        }
      }
    }

    // Fail, bot wins
    if (result.player2Winner && result.player2Determine.power) {
      this.enemyWinner = true;
      this.playerLoser = true;

      const incomingAttackPower = result.player2Determine.power;
      extraTimeout = incomingAttackPower;
      const newHealth = this.player.health - incomingAttackPower;
      console.log(
        'Bot Wins Attack: Attacking player for ' +
          incomingAttackPower +
          ' damage'
      );
      setTimeout(() => {
        this.numbersGoDownIncrementally(this.player.health, newHealth, true);
      }, this.DefaultNumbersDelay);
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
          extraTimeout = incomingAttackPower;
          console.log(
            'Player Defended: Attacking bot for ' +
              incomingAttackPower +
              ' damage'
          );
          const newHealth = x.health - incomingAttackPower;
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, this.DefaultNumbersDelay);
        }
      }
    }

    const shouldEndGame = this.checkEndGame();
    if (shouldEndGame) {
      return;
    }

    const extraTime = extraTimeout * 100;
    const totalWaitTime = this.TotalWaitDelay + extraTime; // 3500 or 2000
    await this.timeout(totalWaitTime);
    this.attackEnding = true;
    await this.timeout(this.TotalMiniWaitDelay); // 500 or 300
    this.attackStarted = false;
    this.newTurn();
    this.startBotTurnsLoop();
  }

  async abilityTurnBot() {
    for await (const ability of this.abilityCardsHandBot) {
      const canUse: CardDto[] = this.abilityService.checkCanUseAbility(
        ability,
        this.enemyHand
      );

      if (canUse.length > 0 || ability.cost[ability.level - 1].length === 0) {
        this.usedAbilityCardBot = true;

        await this.timeout(1000 - this.AbilityDelay); // 500
        this.selectedEnemyCards = canUse;
        this.hoveringAbilityCardBot = ability;
        this.setAttackArrowsEnemyAbility();
        // Select ability card and show lines to cards it will use
        await this.timeout(500);

        // Remove cards from hand
        canUse.forEach((x) => {
          this.enemyHand = this.enemyHand.filter((a) => a.id !== x.id);
        });

        // Hide lines
        try {
          for await (const x of this.activeAbilityLeaderLines) {
            await x.hide('fade', { duration: 100, timing: 'linear' });
          }
        } catch (err) {
          console.log(err);
        }
        this.activeAbilityLeaderLines = [];

        // // Use ability card
        this.selectedCards = [];
        this.enemyTarget = 0;
        await this.useAbilityCardBot(ability);
        // Remove ability card from hand
        this.abilityCardsHandBot = this.abilityCardsHandBot.filter(
          (x) => x.id !== ability.id
        );
        this.selectedEnemyCards = [];
        this.hoveringAbilityCardBot = defaultAbilityCard;
      }
    }
  }

  async useAbilityCardBot(ability: AbilityCard) {
    // damage
    if (ability.abilityFunction === 'damage') {
      await this.botUseDamageAbility(ability);
    }

    // -offense
    if (ability.abilityFunction === 'offense') {
      await this.botUseOffenseAbility(ability);
    }

    // discard
    if (ability.abilityFunction === 'discard') {
      await this.botUseDiscardAbility(ability);
    }

    // draw card
    if (ability.abilityFunction === 'draw') {
      await this.botUseDrawAbility(ability);
    }

    // heal
    if (ability.abilityFunction === 'heal') {
      await this.botUseHealAbility(ability);
    }

    // Increase Defense
    if (ability.abilityFunction === 'increaseDefense') {
      await this.botUseIncreaseDefenseAbility(ability);
    }

    // Call in enemies
    if (ability.abilityFunction === 'callInSupport') {
      await this.botUseSupportAbility(ability);
    }
  }

  async botUseSupportAbility(ability: AbilityCard) {
    // Attack player
    this.pushDisplayMessage('Rally');

    this.enemyPlayers.forEach((x) => {
      this.supportOnEnemies.push(x);
    });
    await this.timeout(1000 - this.AbilityDelay);
    const newAllies = ability.alliesCalled![ability.level - 1];
    newAllies?.forEach((x) => {
      const newId = this.enemyPlayers.length + 1;
      const newAlly = { ...x, id: newId };
      this.enemyPlayers.unshift(newAlly);
      this.completedEnemyTurns.push(newAlly.id);
    });
    this.playerService.playSound('horn.mp3');

    await this.timeout(700 - this.AbilityDelay);
    this.abilityDeckBot = this.abilityDeckBot.filter(
      (x) => x.id !== ability.id
    );
    this.botEndAbilityTurn();
  }

  async botUseIncreaseDefenseAbility(ability: AbilityCard) {
    if (ability.targetAll) {
      // Heal all
      this.pushDisplayMessage(
        `All Defense +${ability.abilityValue[ability.level - 1]}`
      );
      await this.timeout(500 - this.AbilityDelaySmall);
      this.enemyPlayers = this.enemyPlayers.map((x) => {
        if (x.health < 1) {
          return x;
        } else {
          const incomingHeal = ability.abilityValue[ability.level - 1];
          let newDefense = x.attack + incomingHeal;
          this.addDefenseOnEnemies.push(x);
          return { ...x, attack: newDefense };
        }
      });
      this.playerService.playSound('heal.mp3');
      await this.timeout(1200 - this.AbilityDelay);
      this.botEndAbilityTurn();
    } else {
      // Heal single
      this.pushDisplayMessage(
        `Defense +${ability.abilityValue[ability.level - 1]}`
      );
      await this.timeout(500 - this.AbilityDelaySmall);
      const validPlayer: PlayerDto | undefined = this.enemyPlayers.find(
        (x) => x.health > 0
      );
      const lowHealthAndValid: PlayerDto | undefined = this.enemyPlayers.find(
        (x) => x.health > 0 && x.health !== x.baseHealth
      );
      let foundPlayer: PlayerDto | undefined;
      if (lowHealthAndValid) {
        foundPlayer = lowHealthAndValid;
      } else {
        foundPlayer = validPlayer ?? undefined;
      }
      this.playerService.playSound('heal.mp3');

      if (foundPlayer) {
        this.addDefenseOnEnemies.push(foundPlayer);
        this.enemyPlayers = this.enemyPlayers.map((x) => {
          if (x.id === foundPlayer?.id) {
            let newDefense = x.attack + ability.abilityValue[ability.level - 1];
            return { ...x, attack: newDefense };
          }

          return x;
        });
      }
      await this.timeout(1200 - this.AbilityDelay);
      this.botEndAbilityTurn();
    }
  }

  async botUseDamageAbility(ability: AbilityCard) {
    // Attack player
    this.pushDisplayMessage('Fire Attack');
    await this.timeout(500 - this.AbilityDelaySmall);
    this.playerService.playSound('fire.mp3');

    this.player.health =
      this.player.health - ability.abilityValue[ability.level - 1];

    this.fireOnPlayer = true;
    await this.timeout(1200 - this.AbilityDelay);
    this.botEndAbilityTurn();
  }

  async botUseOffenseAbility(ability: AbilityCard) {
    // -offense on player
    this.pushDisplayMessage(
      `-${ability.abilityValue[ability.level - 1]} Defense`
    );
    await this.timeout(500 - this.AbilityDelaySmall);

    this.player.attack =
      this.player.attack - ability.abilityValue[ability.level - 1];
    if (this.player.attack < 0) {
      this.player.attack = 0;
    }
    this.playerService.playSound('block.mp3');

    this.shieldOnPlayer = true;
    await this.timeout(1200 - this.AbilityDelay);
    this.botEndAbilityTurn();
  }

  async botUseDiscardAbility(ability: AbilityCard) {
    // Discard player card at random
    this.pushDisplayMessage(
      `Discard ${ability.abilityValue[ability.level - 1]} Cards`
    );
    await this.timeout(500 - this.AbilityDelaySmall);
    const shuffledArray = this.cardService.shuffle(this.playerHand);
    let finishedDiscards = 0;
    this.playerService.playSound('cardFlip.mp3');
    for await (const x of shuffledArray) {
      if (finishedDiscards !== ability.abilityValue[ability.level - 1]) {
        finishedDiscards++;
        this.playerHand = this.playerHand.filter((a) => a.id !== x.id);
      }
    }
    await this.timeout(100);
    this.botEndAbilityTurn();
  }

  async botUseDrawAbility(ability: AbilityCard) {
    // Draw cards
    this.pushDisplayMessage(
      `Draw ${ability.abilityValue[ability.level - 1]} Cards`
    );
    await this.timeout(500 - this.AbilityDelaySmall);

    this.addBotCardsToHand(ability.abilityValue[ability.level - 1]);
    await this.timeout(100);
    this.botEndAbilityTurn();
  }

  async botUseHealAbility(ability: AbilityCard) {
    if (ability.targetAll) {
      // Heal all
      this.pushDisplayMessage(
        `Heal All ${ability.abilityValue[ability.level - 1]} Health`
      );
      await this.timeout(500 - this.AbilityDelaySmall);
      this.enemyPlayers = this.enemyPlayers.map((x) => {
        if (x.health < 1) {
          return x;
        } else {
          const incomingHeal = ability.abilityValue[ability.level - 1];
          let newHealth = x.health + incomingHeal;
          if (newHealth > x.baseHealth) {
            newHealth = x.baseHealth;
          }
          this.healOnEnemies.push(x);
          return { ...x, health: newHealth };
        }
      });
      this.playerService.playSound('heal.mp3');
      await this.timeout(1200 - this.AbilityDelay);
      this.botEndAbilityTurn();
    } else {
      // Heal single
      this.pushDisplayMessage(
        `Heal ${ability.abilityValue[ability.level - 1]} Health`
      );
      await this.timeout(500 - this.AbilityDelaySmall);
      const validPlayer: PlayerDto | undefined = this.enemyPlayers.find(
        (x) => x.health > 0
      );
      const lowHealthAndValid: PlayerDto | undefined = this.enemyPlayers.find(
        (x) => x.health > 0 && x.health !== x.baseHealth
      );
      this.playerService.playSound('heal.mp3');

      let foundPlayer: PlayerDto | undefined;
      if (lowHealthAndValid) {
        foundPlayer = lowHealthAndValid;
      } else {
        foundPlayer = validPlayer ?? undefined;
      }

      if (foundPlayer) {
        this.healOnEnemies.push(foundPlayer);
        this.enemyPlayers = this.enemyPlayers.map((x) => {
          if (x.id === foundPlayer?.id) {
            let newHealth = x.health + ability.abilityValue[ability.level - 1];
            if (newHealth > x.baseHealth) {
              newHealth = x.baseHealth;
            }
            return { ...x, health: newHealth };
          }

          return x;
        });
      }
      await this.timeout(1200 - this.AbilityDelay);
      this.botEndAbilityTurn();
    }
  }

  botEndAbilityTurn() {
    this.fireOnPlayer = false;
    this.shieldOnPlayer = false;
    this.healOnEnemies = [];
    this.addDefenseOnEnemies = [];
    this.supportOnEnemies = [];
    this.displayMessageList.forEach((x) => {
      this.displayMessageListInactive.push(x.id);
    });
    this.checkEndGame();
  }

  async startBotTurn() {
    this.abilityCardsHand = [];
    this.showBotCards = true;
    this.canSelectCards = false;
    this.fireOnPlayer = false;
    // Discard any remaining player hand over 5
    if (this.playerHand.length > 5 && !this.showGuide) {
      this.playerDiscardPhaseExtra();
      return;
    }
    if (this.abilityCardsHandBot.length > 0) {
      await this.abilityTurnBot();
    }

    // Determine attack hand
    let botHand: DetermineObject = {
      valid: false,
      highCard: 0,
      cards: [],
    };
    if (this.enemyHand.length > 0) {
      botHand = this.cardService.generateBotOffenseHand(this.enemyHand);
    } else {
      this.completedEnemyTurns = [];
      this.pushMessage('Player Turn');
      this.addCardsToBothHands();
      this.newTurn();
      return;
    }

    await this.timeout(500);

    this.playerTarget = this.player.id;
    this.selectedEnemyCards = botHand.cards;
    this.setAttackArrowsEnemy();

    await this.timeout(1000);
    // Attack
    const attackPlayer = this.findEnemyPlayerAttack();
    this.staticEnemyTarget = attackPlayer.id;
    this.showBotCards = false;

    this.abilityCardsHandBot = [];
    this.enemyAttackStarted = true;
    this.canSelectCards = true;
    try {
      for await (const x of this.activeLeaderLines) {
        await x.hide('fade', { duration: 100, timing: 'linear' });
      }
    } catch (err) {
      console.log(err);
    }
    // Valid attack hand, commence battle
    this.enemyAttackHand = botHand;
    this.enemyDefense = botHand.cards;

    const addLength = this.player.attack;
    this.addPlayerCardsToHand(addLength);
  }

  chooseDefensePlayerCards() {
    this.validCards = [];
    this.playerService.playSound('button.mp3');
    // If selectedcards length is equal to player hand length, ignore errors
    if (
      this.selectedCards.length !== this.enemyAttackHand.cards.length &&
      !this.canDefendWithMultipleCards &&
      this.selectedCards.length !== this.playerHand.length
    ) {
      this.canSelectCards = true;
      this.pushError('Select ' + this.enemyAttackHand.cards.length + ' Cards');
      return;
    }

    if (
      this.canDefendWithMultipleCards &&
      this.selectedCards.length < this.enemyAttackHand.cards.length &&
      this.selectedCards.length !== this.playerHand.length
    ) {
      this.canSelectCards = true;
      this.pushError(
        'Select At Least ' + this.enemyAttackHand.cards.length + ' Cards'
      );
      return;
    }

    this.canSelectCards = false;
    if (this.showGuide) {
      this.selectedCards = [this.playerHand[5]];
    }
    console.log(this.selectedCards);
    console.log(this.playerHand);
    const hand: DetermineObject = this.cardService.determineHand(
      this.selectedCards
    );
    this.playerAttackHand = hand;
    if (hand.name === 'Four of a Kind') {
      this.achievementService.unlockNewAchievement(5);
    }
    if (hand.name === 'Full House') {
      this.achievementService.unlockNewAchievement(6);
    }
    if (hand.name === 'Flush') {
      this.achievementService.unlockNewAchievement(7);
    }

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
    this.completedEnemyTurns.push(this.staticEnemyTarget);
    if (this.showGuide) {
      this.completedEnemyTurns = this.enemyPlayers.map((x) => x.id);
    }
    const result = this.cardService.determineWinner(hand, this.enemyAttackHand);
    this.setWinner(result, false);
  }

  newTurn() {
    this.finishedChoosingDefensePlayer = false;
    this.enemyTarget = 0;
    this.currentEnemyTurn = defaultPlayer;
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
    this.duringBotTurnDiscard = false;
    this.staticEnemyTarget = 0;
    this.tie = false;
    this.discarding = false;
    this.currentAbility = defaultAbilityCard;
    this.enemyDefense = [];
    this.activeLeaderLines = [];
    this.activeAbilityLeaderLines = [];
    this.discardSelectedCards = [];
    this.currentExtraDmg = 0;
    this.abilityCardCombos = [];
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

  pushMessage(message: string): number {
    const ID = this.messageList.length + 1;
    this.messageList.push({ id: ID, message: message });

    setTimeout(() => {
      this.messageListInactive.push(ID);
    }, 1100);

    return ID;
  }

  pushDisplayMessage(message: string): number {
    const ID = this.displayMessageList.length + 1;
    this.displayMessageList.push({ id: ID, message: message });
    return ID;
  }

  async pushDrawOutTextMessage(message: string) {
    const ID = this.drawOutMessageList.length + 1;
    this.drawOutMessageList.push({ id: ID, message: message, width: 0 });
    await this.timeout(500);
  }
}

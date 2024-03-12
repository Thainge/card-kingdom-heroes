import { AbilityCard } from "./../../models/abilityCard";
import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { CardDto } from "src/app/models/card";
import { CardService } from "src/app/services/card.service";
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
} from "angular-animations";
import { PlayerDto } from "src/app/models/player";
import {
  DetermineObject,
  DetermineWinnerObject,
} from "src/app/models/determine";
import "leader-line";
import { playerService } from "src/app/services/player.service";
import { gameTheme } from "src/app/models/theme";
import { CheatDto } from "src/app/models/cheat";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
declare let LeaderLine: any;
import { Cards } from "src/assets/data/cards";
import { EnviornmentSettings } from "src/assets/data/environement";
import { AbilityService } from "src/app/services/ability.service";

const defaultAbilityCard: AbilityCard = {
  id: 0,
  abilityFunction: "damage",
  targetAll: false,
  abilityValue: 1,
  cost: ["hearts"],
  description: "",
  image: "",
  level: 1,
  name: "",
  hitAnimation: "heal",
};

type ClickObject = {
  id: number;
  x: number;
  y: number;
};

interface ComboObject {
  id: number;
  cards: any[];
  shuffledCards: any[];
  currentIndex: number;
}

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger("cardLeaving", [
      transition(":leave", [
        style({ width: "12%" }),
        animate(".5s ease-in", style({ width: "0%" })),
      ]),
    ]),

    fadeOutUpOnLeaveAnimation({ anchor: "fadeUpLeave" }),
    fadeInUpOnEnterAnimation({ anchor: "fadeUpEnter" }),

    fadeOutLeftOnLeaveAnimation({ anchor: "fadeLeftLeave" }),
    fadeInLeftOnEnterAnimation({ anchor: "fadeLeftEnter" }),

    fadeOutRightOnLeaveAnimation({ anchor: "fadeRightLeave" }),
    fadeInRightOnEnterAnimation({ anchor: "fadeRightEnter" }),

    fadeInDownOnEnterAnimation({ anchor: "fadeDownEnter" }),
    fadeOutDownOnLeaveAnimation({ anchor: "fadeDownLeave" }),

    fadeInOnEnterAnimation({ anchor: "fadeEnter" }),
    fadeOutOnLeaveAnimation({ anchor: "fadeOutLeave" }),

    zoomInOnEnterAnimation({ anchor: "zoomInEnter" }),
    zoomOutOnLeaveAnimation({ anchor: "zoomOutLeave" }),
    flipInYOnEnterAnimation({ anchor: "flipInYonEnter" }),
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
    image: "",
    name: "",
    baseHealth: 1,
    baseAttack: 1,
    level: 1,
  };
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
  displayMessageList: any[] = [];
  displayMessageListInactive: any[] = [];

  attackStarted: boolean = false;

  canDefendWithMultipleCards: boolean = false;
  hasWildCards: boolean = true;
  wildCards: CardDto[] = [];
  alwaysWinTies: boolean = false;
  canSeeTopCard: boolean = false;
  topRedrawCard: number = 0;
  topRedrawCardEnemy: number = 0;

  activeLeaderLines: any[] = [];
  staticEnemyTarget: number = 0;
  wrappingTurn: boolean = false;
  doingWildCardChange: boolean = false;

  usedSpecialCardThisTurn: boolean = false;

  gameThemePath: gameTheme = "default";
  Cards: CardDto[] = [];
  completedEnemyTurns: number[] = [];
  currentEnemyTurn: PlayerDto = {
    id: 0,
    health: 1,
    attack: 1,
    image: "",
    name: "",
    baseHealth: 1,
    baseAttack: 1,
    level: 1,
  };

  discardCards: CardDto[] = [];
  discardSelectedCards: CardDto[] = [];
  discarding: boolean = false;
  discardHide: boolean = true;
  enemyNextTurn: boolean = false;
  duringBotTurnDiscard: boolean = false;

  currentExtraDmg: number = 0;
  randomBgImage: string = "";

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
  shieldOnEnemies: PlayerDto[] = [];
  leachOnEnemies: PlayerDto[] = [];
  healOnPlayer: boolean = false;
  fireOnPlayer: boolean = false;
  shieldOnPlayer: boolean = false;
  abilityEnemyTarget: number = 0;

  usedAbilityCardBot: boolean = false;
  startedAbilityTurnBot: boolean = false;
  currentlyRunningBot: boolean = false;
  abilityCardsHandBot: AbilityCard[] = [];
  abilityDeckBot: AbilityCard[] = [];
  hoveringAbilityCardBot: AbilityCard = defaultAbilityCard;
  topAbilityCardBot: AbilityCard = defaultAbilityCard;
  currentAbilityBot: AbilityCard = defaultAbilityCard;

  clickAnimationsList: ClickObject[] = [];
  gameLoserPlayer: boolean = false;
  gameWinnerPlayer: boolean = false;
  shownRewardItem: any = { id: 0 };
  rewardItemsClean: any[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
  rewardItems: any[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
  canClickNextReward: boolean = false;
  finishedRewards: boolean = false;
  showHeroLevelUp: boolean = false;

  battleRewardXp: number = 50;
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

  @ViewChildren("myActiveCards")
  myActiveCards: QueryList<ElementRef> | undefined;

  @ViewChildren("activeAbilityCards")
  activeAbilityCards: QueryList<ElementRef> | undefined;
  @ViewChildren("activeAbilityCardsBot")
  activeAbilityCardsBot: QueryList<ElementRef> | undefined;

  @ViewChildren("activeEnemyCards") activeEnemyCards:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren("enemyPlayerRef") enemyPlayerRef:
    | QueryList<ElementRef>
    | undefined;

  @ViewChildren("playerRef") playerRef: QueryList<ElementRef> | undefined;
  @ViewChild("enemyDefenseRef") enemyDefenseRef: ElementRef | undefined;

  constructor(
    private cardService: CardService,
    private userService: playerService,
    private abilityService: AbilityService
  ) {}

  ngOnInit() {
    setInterval(() => {
      try {
        this.clickAnimationsList = this.clickAnimationsList.slice(
          this.clickAnimationsList.length - 4
        );
      } catch (err) {}
    }, 1000 * 30);
    this.importRandomBgImage();
    // Get game theme
    this.userService.gameTheme$.subscribe((x) => {
      this.gameThemePath = x;
      this.player = this.userService.getPlayer(this.gameThemePath);
      this.abilityDeck = this.userService.getAbilityCards(this.gameThemePath);
      this.abilityDeck = this.cardService.shuffle(this.abilityDeck);
      this.abilityDeckBot = this.userService.getAbilityCardsBot(
        this.gameThemePath
      );
      this.abilityDeckBot = this.cardService.shuffle(this.abilityDeckBot);
      this.enemyPlayers = [
        {
          id: 1,
          image: "./assets/" + this.gameThemePath + "/" + "link.png",
          name: "Link",
          attack: 3,
          health: 1,
          baseHealth: 7,
          baseAttack: 6,
          level: 1,
        },
        // {
        //   id: 2,
        //   image: './assets/' + this.gameThemePath + '/' + 'link.png',
        //   name: 'Link',
        //   attack: 2,
        //   health: 1,
        //   baseHealth: 7,
        //   baseAttack: 1,
        //   level: 1,
        // },
        // {
        //   id: 3,
        //   image: './assets/' + this.gameThemePath + '/' + 'link.png',
        //   name: 'Link',
        //   attack: 1,
        //   health: 4,
        //   baseHealth: 7,
        //   baseAttack: 0,
        //   level: 1,
        // },
      ];

      if (this.Cards.length < 1) {
        this.Cards = Cards;
        this.gameInit();
      }
    });
  }

  ngAfterViewInit() {
    this.snowFlakesArray = Array.from(Array(50).keys());
  }

  async clickAnimation(e: any) {
    const ID = this.clickAnimationsList.length + 1;
    const clickObject: ClickObject = {
      id: ID,
      x: e.clientX,
      y: e.clientY,
    };
    this.clickAnimationsList.push(clickObject);
  }

  async nextReward(rewardItem: any) {
    if (this.canClickNextReward && this.rewardItems.length > 0) {
      // no more clicks
      this.canClickNextReward = false;
      this.rewardItems = this.rewardItems.filter((x) => x.id !== rewardItem.id);
      // Hide current reward
      this.shownRewardItem = { id: 0 };
      await this.timeout(750);
      // show new reward
      this.shownRewardItem = this.rewardItems[0];
      if (this.rewardItems.length === 0) {
        this.finishedRewards = true;
      }
      await this.timeout(500);
      // Can click again
      this.canClickNextReward = true;
    }
  }

  isActiveReward(rewardItem: any) {
    return this.shownRewardItem.id === rewardItem.id;
  }

  drawAbilityCard(amount: number) {
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

  drawAbilityCardBot(amount: number) {
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

  async importRandomBgImage() {
    const imagesArray = Array.from(
      Array(EnviornmentSettings.backgroundCount).keys()
    );
    const shuffledArray = this.cardService.shuffle(imagesArray);
    this.randomBgImage = shuffledArray[0] + 1;
  }

  gameInit() {
    // Cheats
    const cheats: CheatDto = this.userService.getPlayerCheats();
    this.canDefendWithMultipleCards = cheats.canDefendWithMultipleCards;
    this.alwaysWinTies = cheats.alwaysWinTies;
    this.canSeeTopCard = cheats.canSeeTopCard;

    // Change deck values based on player skills
    this.updateDeckBasedOnPlayerSkills();

    // Add wildcards to deck
    let playerCards: CardDto[] = this.Cards.map((x) => {
      return { ...x, wildInitial: x.value };
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

    // Shuffle player decks
    this.playerDeck = this.cardService.shuffle(playerCards);
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
      if (this.enemyDeck[0] && this.enemyDeck[0].id) {
        this.topRedrawCardEnemy = this.enemyDeck[0].id;
      }
    }, 400);

    // this.gameWinnerPlayer = true;
    this.redrawing = false;
    this.redrawHide = true;
    this.playerHand = [...this.redrawCards];
    this.abilityDeck = this.userService.getAbilityCards(this.gameThemePath);
    this.drawAbilityCard(2);
    this.drawAbilityCardBot(2);
    // this.finishedRewards = true;
    // this.rewardItems = [];
    // this.endGame(true);
    // this.newTurn();
    // this.startBotTurnsLoop();
    // this.healOnPlayer = true;
    // this.abilityCardsHand = [];
    // this.showBotCards = true;
    // this.canSelectCards = false;
    // this.fireOnPlayer = false;
    // this.currentEnemyTurn = this.enemyPlayers[0];
    // this.playerDiscardPhase();
  }

  continue() {
    console.log("leave page");
  }

  retry() {
    window.location.reload();
  }

  async selectAbilityCard(ability: AbilityCard) {
    const playerHand = this.useMemorizedCards(ability);
    const canUse: CardDto[] = this.abilityService.checkCanUseAbility(
      ability,
      playerHand
    );

    if (canUse.length > 0 || ability.cost.length === 0) {
      this.errorAbilityCard = ability;
      this.usedAbilityCard = true;

      // Remove cards from hand
      canUse.forEach((x) => {
        this.playerHand = this.playerHand.filter((a) => a.id !== x.id);
      });

      // Hide lines
      try {
        for await (const x of this.activeAbilityLeaderLines) {
          await x.hide("fade", { duration: 100, timing: "linear" });
        }
      } catch (err) {
        console.log(err);
      }
      this.activeAbilityLeaderLines = [];

      // Use ability card
      try {
        for await (const x of this.activeLeaderLines) {
          await x.hide("fade", { duration: 100, timing: "linear" });
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
    if (ability.abilityFunction === "damage") {
      this.damageAbility(ability);
    }

    if (ability.abilityFunction === "heal") {
      this.healAbility(ability);
    }

    // Draw x cards
    if (ability.abilityFunction === "draw") {
      this.drawAbility(ability);
    }

    // Redraw all number/face cards
    if (ability.abilityFunction === "redraw") {
      this.redrawAbility(ability);
    }

    // Redraw whole hand including abilities
    if (ability.abilityFunction === "redrawAll") {
      this.redrawAllAbility(ability);
    }

    // Bot discards x
    if (ability.abilityFunction === "discard") {
      this.discardAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === "offense") {
      this.offenseAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === "leach") {
      this.leachAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === "wildSuit") {
      this.wildSuitAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === "wildRange") {
      this.wildRangeAbility(ability);
    }

    // Bot offense -x
    if (ability.abilityFunction === "wildSuitRange") {
      this.wildSuitRangeAbility(ability);
    }
  }

  async drawAbility(ability: AbilityCard) {
    this.addPlayerCardsToHand(ability.abilityValue);
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
    const abilityCost = ability.abilityValue;

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
        let newAttack = x.attack - this.currentAbility.abilityValue;
        if (newAttack < 1) {
          newAttack = 0;
        }
        this.shieldOnEnemies.push(x);
        return { ...x, attack: newAttack };
      });
      this.endAbilityTurn(ability, 800);
    } else {
      const ID = this.pushDisplayMessage(
        `Select An Enemy To Apply -${ability.abilityValue} Offense To`
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
        totalEnemyPlayersValid.length * ability.abilityValue;

      // Automatically apply -x to all enemies
      this.enemyPlayers = this.enemyPlayers.map((x) => {
        // Decrease enemy health by value
        let newHealth = x.health - ability.abilityValue;
        this.leachOnEnemies.push(x);

        return { ...x, health: newHealth };
      });

      // Remove active lines
      try {
        for await (const x of this.activeAbilityLeaderLines) {
          await x.hide("fade", { duration: 100, timing: "linear" });
        }
      } catch (err) {
        console.log(err);
      }
      this.activeAbilityLeaderLines = [];

      let healAbility = { ...ability };
      healAbility.abilityFunction = "heal";
      healAbility.abilityValue = totalHealthRegained;

      await this.timeout(1000);
      this.healAbility(healAbility);
    } else {
      const ID = this.pushDisplayMessage(
        `Select An Enemy To Steal ${ability.abilityValue} Health From`
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
      `Select A Card To Give Wild Suit and Range +${ability.abilityValue} To`
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
      for await (const x of this.enemyPlayers) {
        const incomingAttackPower = ability.abilityValue;
        const newHealth = x.health - incomingAttackPower;
        if (ability.hitAnimation === "fire") {
          this.flamesOnEnemies.push(x);
        }
        this.enemyTarget = x.id;
        await this.numbersGoDownIncrementallyBot(x.health, newHealth);
      }
      this.endAbilityTurn(ability, 800);
    } else {
      const ID = this.pushDisplayMessage(
        `Select An Enemy To Deal ${ability.abilityValue} Damage To`
      );
      this.currentAbility = ability;
    }
  }

  async healAbility(ability: AbilityCard) {
    // green hp while healing
    // potion fades on player
    let newHealth = this.player.health + ability.abilityValue;
    if (newHealth > this.player.baseHealth) {
      newHealth = this.player.baseHealth;
    }

    // Remove ability card from hand
    this.abilityCardsHand = this.abilityCardsHand.filter(
      (x) => x.id !== ability.id
    );
    await this.timeout(200);
    this.healOnPlayer = true;
    await this.timeout(800);
    this.numbersGoUpIncrementallyPlayer(this.player.health, newHealth);

    this.endAbilityTurn(ability, 400);
  }

  async endAbilityTurn(ability: AbilityCard, timeout: number) {
    // Remove ability card from hand
    this.abilityCardsHand = this.abilityCardsHand.filter(
      (x) => x.id !== ability.id
    );

    // Remove active lines
    try {
      for await (const x of this.activeAbilityLeaderLines) {
        await x.hide("fade", { duration: 100, timing: "linear" });
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
      this.pushMessage("Player Turn");
    }, timeout);
  }

  async onSelectTargetAbilityFire() {
    const ability = this.currentAbility;
    this.startedAbilityTurn = true;

    for await (const x of this.enemyPlayers) {
      if (x.id === this.enemyTarget) {
        const incomingAttackPower = ability.abilityValue;
        const newHealth = x.health - incomingAttackPower;
        if (ability.hitAnimation === "fire") {
          this.flamesOnEnemies.push(x);
        }
        await this.numbersGoDownIncrementallyBot(x.health, newHealth);
      }
    }

    this.endAbilityTurn(ability, 1000);
    setTimeout(() => {
      this.abilityEnemyTarget = 0;
    }, 4000);
  }

  async onSelectTargetAbilityOffense() {
    const ability = this.currentAbility;
    this.startedAbilityTurn = true;

    this.enemyPlayers = this.enemyPlayers.map((x) => {
      if (x.id === this.enemyTarget) {
        let newAttack = x.attack - this.currentAbility.abilityValue;
        if (newAttack < 1) {
          newAttack = 0;
        }
        this.shieldOnEnemies.push(x);
        return { ...x, attack: newAttack };
      }

      return x;
    });

    this.endAbilityTurn(ability, 800);
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
        let newHealth = x.health - ability.abilityValue;
        this.leachOnEnemies.push(x);

        return { ...x, health: newHealth };
      }
      return x;
    });

    const totalEnemyPlayersValid = this.enemyPlayers.filter(
      (x) => x.id === this.enemyTarget
    );
    const totalHealthRegained =
      totalEnemyPlayersValid.length * ability.abilityValue;
    let healAbility = ability;
    healAbility.abilityFunction = "heal";
    healAbility.abilityValue = totalHealthRegained;

    // Remove active lines
    try {
      for await (const x of this.activeAbilityLeaderLines) {
        await x.hide("fade", { duration: 100, timing: "linear" });
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
      wildRange: this.currentAbility.abilityValue,
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
      wildRange: this.currentAbility.abilityValue,
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

    // Check if can even use
    const canUse: CardDto[] = this.abilityService.checkCanUseAbility(ability, [
      ...this.playerHand,
    ]);

    // If can use && haven't already run for this id
    if ((canUse.length > 0 || ability.cost.length === 0) && !canNotRun) {
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

    if (canUse.length < 1 && ability.cost.length !== 0) {
      return;
    }

    if (!this.currentlyRunning) {
      this.currentlyRunning = true;
      this.hoveringAbilityCard = ability;
      this.hoveringAbilityHand = canUse;

      if (canUse.length > 0 || ability.cost.length === 0) {
        this.setAttackArrowsPlayerAbility();
      }
    }
  }

  useMemorizedCards(ability: AbilityCard): CardDto[] {
    const foundItem = this.abilityCardCombos.find((x) => x.id === ability.id);

    if (foundItem) {
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

    if (canUse.length < 1 && ability.cost.length !== 0) {
      return;
    }

    if (!this.currentlyRunning) {
      this.currentlyRunning = true;
      this.hoveringAbilityCard = ability;
      this.hoveringAbilityHand = canUse;

      if (canUse.length > 0 || ability.cost.length === 0) {
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

  async hoverAbilityOut(ability: AbilityCard) {
    if (this.usedAbilityCard) {
      return;
    }

    this.errorAbilityCard = {
      id: 0,
      abilityFunction: "damage",
      targetAll: false,
      abilityValue: 1,
      cost: ["hearts"],
      description: "",
      image: "",
      level: 1,
      name: "",
      hitAnimation: "heal",
    };
    this.hoveringAbilityHand = [];
    this.hoveringAbilityCard = {
      id: 0,
      abilityFunction: "damage",
      targetAll: false,
      abilityValue: 1,
      cost: ["hearts"],
      description: "",
      image: "",
      level: 1,
      name: "",
      hitAnimation: "heal",
    };
    this.currentlyRunning = false;
    try {
      for await (const x of this.activeAbilityLeaderLines) {
        await x.hide("fade", { duration: 100, timing: "linear" });
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
          if (x.nativeElement.className.includes("abilityIsActiveTarget")) {
            foundTarget = x.nativeElement;
          }
        }
      }
      let foundEnemyTarget: ElementRef | undefined;
      if (this.enemyPlayerRef) {
        for await (const x of this.enemyPlayerRef) {
          if (x.nativeElement.className.includes("enemyAbilityTarget")) {
            foundEnemyTarget = x.nativeElement;
          }
        }
      }
      if (foundTarget && foundEnemyTarget) {
        try {
          for await (const x of this.activeAbilityLeaderLines) {
            await x.hide("fade", { duration: 100, timing: "linear" });
          }
        } catch (err) {
          console.log(err);
        }
        const myNewActiveLines: any[] = [];
        const myLineOptions: any = {
          dash: { animation: true },
          endSocket: "bottom",
          startSocket: "top",
          dropShadow: true,
          gradient: {
            startColor: "rgba(0, 255, 0, 0.281)",
            endColor: "rgb(0, 255, 0)",
          },
          animOptions: {
            duration: 30,
            timing: "linear",
          },
          hide: true,
          endPlug: "arrow3",
          endPlugColor: "rgb(0, 255, 0)",
        };
        let myNewLine: any = new LeaderLine(
          foundTarget,
          foundEnemyTarget,
          myLineOptions
        );
        myNewLine.show("draw", { duration: 200, timing: "linear" });
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
          if (x.nativeElement.className.includes("abilityIsActive")) {
            foundTarget = x.nativeElement;
          }
        }
      }

      if (this.currentlyRunning && foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.myActiveCards) {
          try {
            for await (const x of this.activeAbilityLeaderLines) {
              await x.hide("fade", { duration: 100, timing: "linear" });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.myActiveCards) {
            if (x.nativeElement.className.includes("abilityActiveCard")) {
              const myLineOptions: any = {
                dash: { animation: true },
                endSocket: "top",
                startSocket: "top",
                dropShadow: true,
                gradient: {
                  startColor: "rgba(0, 255, 0, 0.281)",
                  endColor: "rgb(0, 255, 0)",
                },
                animOptions: {
                  duration: 30,
                  timing: "linear",
                },
                hide: true,
                endPlug: "arrow3",
                endPlugColor: "rgb(0, 255, 0)",
              };
              let myNewLine: any = new LeaderLine(
                foundTarget,
                x.nativeElement,
                myLineOptions
              );
              myNewLine.show("draw", { duration: 200, timing: "linear" });
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
      await this.timeout(150);
      let foundTarget: ElementRef | undefined;
      if (abilityCards) {
        for await (const x of abilityCards) {
          if (x.nativeElement.className.includes("abilityIsActive")) {
            foundTarget = x.nativeElement;
          }
        }
      }

      if (foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.activeEnemyCards) {
          try {
            for await (const x of this.activeAbilityLeaderLines) {
              await x.hide("fade", { duration: 100, timing: "linear" });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.activeEnemyCards) {
            if (x.nativeElement.className.includes("activeEnemyCard")) {
              const myLineOptions: any = {
                dash: { animation: true },
                endSocket: "bottom",
                startSocket: "bottom",
                dropShadow: true,
                gradient: {
                  startColor: "rgba(0, 255, 0, 0.281)",
                  endColor: "rgb(0, 255, 0)",
                },
                animOptions: {
                  duration: 30,
                  timing: "linear",
                },
                hide: true,
                endPlug: "arrow3",
                endPlugColor: "rgb(0, 255, 0)",
              };
              let myNewLine: any = new LeaderLine(
                foundTarget,
                x.nativeElement,
                myLineOptions
              );
              myNewLine.show("draw", { duration: 200, timing: "linear" });
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

      // --- Wild Suit Cards --- //
      if (Player?.wildHearts && x.suit === "hearts") {
        // All Hearts Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      if (Player?.wildDiamonds && x.suit === "diamonds") {
        // All Diamonds Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      if (Player?.wildSpades && x.suit === "spades") {
        // All Spades Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      if (Player?.wildClubs && x.suit === "clubs") {
        // All Clubs Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildSuit: true,
          wildSuits: shownWildSuits,
        };
      }

      // --- Wild Range Cards --- //
      if (
        Player?.rangeHearts &&
        Player?.rangeHearts > 0 &&
        x.suit === "hearts"
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
        x.suit === "diamonds"
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
        x.suit === "spades"
      ) {
        // All Spades Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildRange: Player?.rangeSpades,
        };
      }

      if (Player?.rangeClubs && Player?.rangeClubs > 0 && x.suit === "clubs") {
        // All Clubs Wild
        alteredCard = {
          ...alteredCard,
          wild: true,
          wildRange: Player?.rangeClubs,
        };
      }

      return alteredCard;
    });
  }

  @HostListener("document:keypress", ["$event"])
  giveHint(event: KeyboardEvent) {
    if (event.key && event.key.toLowerCase() === "h") {
      const playerBestHand: DetermineObject =
        this.cardService.generateBotOffenseHand(this.playerHand);
      this.validCards = playerBestHand.cards;
    }
  }

  useSpecialAbilityCard() {
    this.usedSpecialCardThisTurn = true;
    this.pushSpecialAbilityImage("Test test test");
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
      image: card.value + "_of_" + suit + ".png",
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

      if (this.currentAbility.abilityFunction === "damage") {
        this.onSelectTargetAbilityFire();
      }

      if (this.currentAbility.abilityFunction === "offense") {
        this.onSelectTargetAbilityOffense();
      }

      if (this.currentAbility.abilityFunction === "leach") {
        this.onSelectTargetAbilityLeach();
      }

      return;
    }

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
        image: "",
        name: "",
        baseHealth: 1,
        baseAttack: 1,
        level: 1,
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
        image: "",
        name: "",
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
    return (
      enemyPlayer ?? {
        id: 0,
        health: 1,
        attack: 1,
        image: "",
        name: "",
        baseHealth: 1,
        baseAttack: 1,
        level: 1,
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
      this.pushMessage("Player Turn");
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
    if (this.currentAbility.abilityFunction === "wildSuit") {
      this.onSelectTargetAbilityWildSuit(card);
      return;
    }

    if (this.currentAbility.abilityFunction === "wildRange") {
      this.onSelectTargetAbilityWildRange(card);
      return;
    }

    if (this.currentAbility.abilityFunction === "wildSuitRange") {
      this.onSelectTargetAbilityWildSuitRange(card);
      return;
    }

    if (this.canSelectCards) {
      const includesCard = this.selectedCards.find(
        (x: CardDto) => x.id === card.id
      );

      // Add card to selectedCards
      if (!includesCard) {
        if (this.selectedCards.length === 5) {
          this.pushError("Max 5 cards");
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
          if (x.nativeElement.className.includes("errorEnemyBorder")) {
            foundTarget = x.nativeElement;
          }
        }
      }

      if (foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.myActiveCards) {
          try {
            for await (const x of this.activeLeaderLines) {
              await x.hide("fade", { duration: 100, timing: "linear" });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.myActiveCards) {
            if (x.nativeElement.className.includes("activeCard")) {
              const myLineOptions: any = {
                dash: { animation: true },
                endSocket: "bottom",
                startSocket: "top",
                dropShadow: true,
                gradient: {
                  startColor: valid
                    ? "rgba(0, 255, 0, 0.281)"
                    : "rgba(255, 0, 0, 0.281)",
                  endColor: valid ? "rgb(0, 255, 0)" : "rgb(228, 35, 35)",
                },
                animOptions: {
                  duration: 30,
                  timing: "linear",
                },
                hide: true,
                endPlug: "arrow3",
                endPlugColor: valid ? "rgb(0, 255, 0)" : "rgb(228, 35, 35)",
              };
              let myNewLine: any = new LeaderLine(
                x.nativeElement,
                foundTarget,
                myLineOptions
              );
              myNewLine.show("draw", { duration: 200, timing: "linear" });
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
          if (x.nativeElement.className.includes("errorEnemyBorder")) {
            foundTarget = x.nativeElement;
          }
        }
      }
      if (foundTarget) {
        const myNewActiveLines: any[] = [];
        if (this.activeEnemyCards) {
          try {
            for await (const x of this.activeLeaderLines) {
              await x.hide("fade", { duration: 100, timing: "linear" });
            }
          } catch (err) {
            console.log(err);
          }
          for await (const x of this.activeEnemyCards) {
            if (x.nativeElement.className.includes("activeEnemyCard")) {
              const myLineOptions: any = {
                dash: { animation: true },
                endSocket: "top",
                startSocket: "bottom",
                dropShadow: true,
                gradient: {
                  startColor: "rgba(0, 255, 0, 0.281)",
                  endColor: "rgb(0, 255, 0)",
                },
                animOptions: {
                  duration: 30,
                  timing: "linear",
                },
                hide: true,
                endPlug: "arrow3",
                endPlugColor: "rgb(0, 255, 0)",
              };
              let myNewLine: any = new LeaderLine(
                x.nativeElement,
                foundTarget,
                myLineOptions
              );
              myNewLine.show("draw", { duration: 200, timing: "linear" });
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

  async attack() {
    if (this.selectedCards.length === 0 && this.playerHand.length === 0) {
      this.newTurn();
      await this.addCardsToBothHands();

      // Player turn ends

      // Bot auto discard
      this.botDiscardPhase();

      if (this.playerHand.length < 6) {
        this.startBotTurnsLoop();
        this.pushError("Enemy Turn");
        this.usedSpecialCardThisTurn = false;
      } else {
        // If player needs to discard
        this.enemyNextTurn = true;
        this.playerDiscardPhase();
      }
    } else {
      const hand: DetermineObject = this.cardService.determineHand(
        this.selectedCards
      );

      if (!hand.valid) {
        this.canSelectCards = true;
        this.pushError("Invalid Attack Hand!");
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
          await x.hide("fade", { duration: 100, timing: "linear" });
        }
      } catch (err) {
        console.log(err);
      }
      // Valid attack hand, commence battle
      this.playerAttackHand = hand;
      this.initiateBotDefense(hand);
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
        }, 500);
      } else {
        setTimeout(() => {
          this.enemyAttackHand = {
            cards: [],
            highCard: 0,
            valid: false,
            power: 0,
            name: "",
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
        }, 500);
      }
    }, 1000);
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
    defaultTimeout: number = 2500
  ) {
    const enemyTarget = this.enemyTarget;
    await this.timeout(defaultTimeout);
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

    if (defaultTimeout === 2500) {
      this.wrappingTurn = true;
      return await this.timeout(1000);
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
            "Player Wins Attack: Attacking bot for " +
              incomingAttackPower +
              " damage"
          );
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, 400);
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
        "Bot Defended: Attacking player for " + incomingAttackPower + " damage"
      );
      setTimeout(() => {
        this.numbersGoDownIncrementally(this.player.health, newHealth, true);
      }, 400);
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
            "Player Wins Attack: Attacking bot for " +
              incomingAttackPower +
              " damage"
          );
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, 400);
        }
      }
    }

    const shouldEndGame = this.checkEndGame();
    if (shouldEndGame) {
      return;
    }

    const extraTime = extraTimeout * 100;
    const totalWaitTime = 3500 + extraTime;
    await this.timeout(totalWaitTime);
    this.attackEnding = true;
    await this.timeout(500);
    this.attackStarted = false;
    this.newTurn();
    await this.addCardsToBothHands();

    // Player turn ends

    // Bot auto discard
    this.botDiscardPhase();

    if (this.playerHand.length < 6) {
      this.startBotTurnsLoop();
      this.pushError("Enemy Turn");
      this.usedSpecialCardThisTurn = false;
    } else {
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
      setTimeout(() => {
        this.endGame(true);
      }, 2000);
      return true;
    }

    return false;
  }

  levelUpPlayer() {
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
            this.player.level = 3;
          }
        }
        await this.timeout(25);
      }

      await this.timeout(1700);
      this.finishHeroLevelUp();
    }
  }

  finishHeroLevelUp() {
    if (this.leveledUp) {
      const newId = this.rewardItemsClean.length;
      const heroLevelUpItem = { id: newId + 1 };
      const heroCardPack = { id: newId + 2 };
      this.rewardItemsClean.unshift(heroLevelUpItem);
      this.rewardItemsClean.unshift(heroCardPack);
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
        return "Max Level";
      }

      return `${current}/${total}`;
    }

    return "";
  }

  determineWidthXp(): string {
    if (this.player.xpLevels && (this.player.xp === 0 || this.player.xp)) {
      const currentXp: number = this.player.xp;
      const totalXp: number = this.player.xpLevels[this.player.level - 1];
      const percentageXp = (currentXp / totalXp) * 98;
      if (percentageXp > 98 || this.player.isMaxLevel) {
        return "98%";
      }
      return percentageXp + "%";
    }
    return "98%";
  }

  endGame(playerWon: boolean) {
    if (playerWon) {
      setTimeout(() => {
        this.gameWinnerPlayer = true;
      }, 1000);
      setTimeout(() => {
        this.showHeroLevelUp = true;
      }, 4300);
      setTimeout(() => {
        this.levelUpPlayer();
      }, 4600);
      // this.gameWinnerPlayer = true;
      // this.showHeroLevelUp = true;
      // setTimeout(() => {
      //   this.levelUpPlayer();
      // }, 300);
    } else {
      setTimeout(() => {
        this.gameLoserPlayer = true;
        this.rewardItems = [];
        this.rewardItemsClean = [];
      }, 1000);
      setTimeout(() => {
        this.finishedRewards = true;
      }, 4500);
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
      this.errorList.push("test");
      return;
    }

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
      this.pushError("Enemy Turn");
      this.addCardsToBothHands();
      this.usedSpecialCardThisTurn = false;
    } else {
      this.completedEnemyTurns = [];
      this.pushMessage("Player Turn");
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
        this.pushMessage("Player Turn");
      } else {
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
      for await (const x of addArrEnemy) {
        this.enemyHand.push(this.enemyDeck[0]);
        this.enemyDeck.push(this.enemyDeck[0]);
        this.enemyDeck.shift();
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
      for await (const x of addArr) {
        this.playerHand.push(this.playerDeck[0]);
        this.playerDeck.push(this.playerDeck[0]);
        this.playerDeck.shift();
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
            "Player Defended: Attacking bot for " +
              incomingAttackPower +
              " damage"
          );
          const newHealth = x.health - incomingAttackPower;
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, 400);
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
        "Bot Wins Attack: Attacking player for " +
          incomingAttackPower +
          " damage"
      );
      setTimeout(() => {
        this.numbersGoDownIncrementally(this.player.health, newHealth, true);
      }, 400);
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
            "Player Defended: Attacking bot for " +
              incomingAttackPower +
              " damage"
          );
          const newHealth = x.health - incomingAttackPower;
          setTimeout(() => {
            this.numbersGoDownIncrementally(x.health, newHealth);
          }, 400);
        }
      }
    }

    const shouldEndGame = this.checkEndGame();
    if (shouldEndGame) {
      return;
    }

    const extraTime = extraTimeout * 100;
    const totalWaitTime = 3500 + extraTime;
    await this.timeout(totalWaitTime);
    this.attackEnding = true;
    await this.timeout(500);
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

      if (canUse.length > 0 || ability.cost.length === 0) {
        this.usedAbilityCardBot = true;

        await this.timeout(1000);
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
            await x.hide("fade", { duration: 100, timing: "linear" });
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
    if (ability.abilityFunction === "damage") {
      await this.botUseDamageAbility(ability);
    }

    // -offense
    if (ability.abilityFunction === "offense") {
      await this.botUseOffenseAbility(ability);
    }

    // discard
    if (ability.abilityFunction === "discard") {
      await this.botUseDiscardAbility(ability);
    }

    // draw card
    if (ability.abilityFunction === "draw") {
      await this.botUseDrawAbility(ability);
    }

    // heal 1
    if (ability.abilityFunction === "heal") {
      await this.botUseHealAbility(ability);
    }
  }

  async botUseDamageAbility(ability: AbilityCard) {
    // Attack player
    this.pushDisplayMessage("Fire Attack");
    await this.timeout(500);

    this.player.health = this.player.health - ability.abilityValue;

    this.fireOnPlayer = true;
    await this.timeout(800);
    this.botEndAbilityTurn();
  }

  async botUseOffenseAbility(ability: AbilityCard) {
    // -offense on player
    this.pushDisplayMessage(`-${ability.abilityValue} Defense`);
    await this.timeout(500);

    this.player.attack = this.player.attack - ability.abilityValue;
    if (this.player.attack < 0) {
      this.player.attack = 0;
    }

    this.shieldOnPlayer = true;
    await this.timeout(800);
    this.botEndAbilityTurn();
  }

  async botUseDiscardAbility(ability: AbilityCard) {
    // Discard player card at random
    this.pushDisplayMessage(`Discard ${ability.abilityValue} Cards`);
    await this.timeout(500);
    const shuffledArray = this.cardService.shuffle(this.playerHand);
    let finishedDiscards = 0;
    for await (const x of shuffledArray) {
      if (finishedDiscards !== ability.abilityValue) {
        finishedDiscards++;
        this.playerHand = this.playerHand.filter((a) => a.id !== x.id);
      }
    }
    await this.timeout(100);
    this.botEndAbilityTurn();
  }

  async botUseDrawAbility(ability: AbilityCard) {
    // Draw cards
    this.pushDisplayMessage(`Draw ${ability.abilityValue} Cards`);
    await this.timeout(500);
    this.addBotCardsToHand(ability.abilityValue);
    await this.timeout(100);
    this.botEndAbilityTurn();
  }

  async botUseHealAbility(ability: AbilityCard) {
    if (ability.targetAll) {
      // Heal all
      this.pushDisplayMessage(`Heal All ${ability.abilityValue} Health`);
      await this.timeout(500);
      this.enemyPlayers = this.enemyPlayers.map((x) => {
        if (x.health < 1) {
          return x;
        } else {
          const incomingHeal = ability.abilityValue;
          let newHealth = x.health + incomingHeal;
          if (newHealth > x.baseHealth) {
            newHealth = x.baseHealth;
          }
          this.healOnEnemies.push(x);
          return { ...x, health: newHealth };
        }
      });
      await this.timeout(800);
      this.botEndAbilityTurn();
    } else {
      // Heal single
      this.pushDisplayMessage(`Heal ${ability.abilityValue} Health`);
      await this.timeout(500);
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

      if (foundPlayer) {
        this.healOnEnemies.push(foundPlayer);
        this.enemyPlayers = this.enemyPlayers.map((x) => {
          if (x.id === foundPlayer?.id) {
            let newHealth = x.health + ability.abilityValue;
            if (newHealth > x.baseHealth) {
              newHealth = x.baseHealth;
            }
            return { ...x, health: newHealth };
          }

          return x;
        });
      }
      await this.timeout(800);
      this.botEndAbilityTurn();
    }
  }

  botEndAbilityTurn() {
    this.fireOnPlayer = false;
    this.shieldOnPlayer = false;
    this.healOnEnemies = [];
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
    if (this.playerHand.length > 5) {
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
      this.pushMessage("Player Turn");
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
        await x.hide("fade", { duration: 100, timing: "linear" });
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
    // If selectedcards length is equal to player hand length, ignore errors
    if (
      this.selectedCards.length !== this.enemyAttackHand.cards.length &&
      !this.canDefendWithMultipleCards &&
      this.selectedCards.length !== this.playerHand.length
    ) {
      this.canSelectCards = true;
      this.pushError("Select " + this.enemyAttackHand.cards.length + " Cards");
      return;
    }

    if (
      this.canDefendWithMultipleCards &&
      this.selectedCards.length < this.enemyAttackHand.cards.length &&
      this.selectedCards.length !== this.playerHand.length
    ) {
      this.canSelectCards = true;
      this.pushError(
        "Select At Least " + this.enemyAttackHand.cards.length + " Cards"
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
    this.completedEnemyTurns.push(this.staticEnemyTarget);
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
      image: "",
      name: "",
      baseHealth: 1,
      baseAttack: 1,
      level: 1,
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

  pushSpecialAbilityImage(message: string) {
    const ID = this.specialAbilityList.length + 1;
    this.specialAbilityList.push({ id: ID, message: message });

    setTimeout(() => {
      this.specialAbilityListInactive.push(ID);
    }, 1100);
  }
}

import { playerService } from 'src/app/services/player.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Panzoom } from '@fancyapps/ui/dist/panzoom/panzoom.esm.js';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  zoomInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { BattleStartOverlayComponent } from 'src/app/components/battle-start-overlay/battle-start-overlay.component';
import { DialogComponent } from 'src/app/components/dialogComponent/dialog.component';
import { MapOverlayComponent } from 'src/app/components/map-overlay/map-overlay.component';
import { BoosterPack } from 'src/app/models/boosterPack';
import { DotDto, FlagDto } from 'src/app/models/flag';
import { LevelDto } from 'src/app/models/level';
import { PlayerDto } from 'src/app/models/player';
import { LoadingService } from 'src/app/services/loading.service';
import { AchievementService } from 'src/app/services/achievement.service';
import { LocalStorageService } from 'src/app/services/localstorage.service';
const { Pins } = require('@fancyapps/ui/dist/panzoom/panzoom.pins.esm.js');

type WhirlpoolSize = 0 | 1 | 1.25 | 1.5 | 2 | 2.5;
type WhirlpoolOpacity = 0 | 0.4 | 0.6 | 0.8 | 1;
type Battle = 201 | 202 | 203 | 204;

interface SpecialLevels {
  wheelShow: boolean;
  wheelFinished: boolean;
  // flyingShipShow: boolean;
  // flyingShipFinished: boolean;
  // sailingBoatShowShow: boolean;
  // sailingBoatShowFinished: boolean;

  hero1Show: boolean;
  hero1Finished: boolean;
  // town1GameShow: boolean;
  // town1GameFinished: boolean;
  // town1FightShow: boolean;
  // town1FightFinished: boolean;

  hero2Show: boolean;
  hero2Finished: boolean;
  // town2GameShow: boolean;
  // town2GameFinished: boolean;
  // town2FightShow: boolean;
  // town2FightFinished: boolean;

  hero3Show: boolean;
  hero3Finished: boolean;
  // town3GameShow: boolean;
  // town3GameFinished: boolean;
  // town3FightShow: boolean;
  // town3FightFinished: boolean;

  hero4Show: boolean;
  hero4Finished: boolean;
  // town4GameShow: boolean;
  // town4GameFinished: boolean;
  // town4FightShow: boolean;
  // town4FightFinished: boolean;
}

@Component({
  selector: 'app-zelda-map',
  templateUrl: './zelda-map.component.html',
  styleUrls: ['./zelda-map.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DialogComponent,
    MapOverlayComponent,
    BattleStartOverlayComponent,
  ],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    zoomInOnEnterAnimation({ anchor: 'zoomInEnter' }),
    zoomOutOnLeaveAnimation({ anchor: 'zoomOutLeave' }),
  ],
})
export class ZeldaMapComponent implements AfterViewInit, OnInit {
  @ViewChild('panZoom', { static: false }) scene: ElementRef | undefined;
  flagsList: FlagDto[] = [];
  previousFlagsList: any[] = [];
  currentFlagHover: FlagDto | undefined;
  currentLevel: FlagDto | undefined;
  nextLevel: FlagDto | undefined;
  currentBattle: LevelDto | undefined;
  currentDetails: any | undefined;
  finished: boolean = false;
  placingFlag = true;
  placingCurrentFlag: FlagDto | undefined;
  mouseX: number = 0;
  mouseY: number = 0;
  devMode: boolean = false;
  currentWhirlpoolScale: WhirlpoolSize = 1;
  currentWhirlpoolOpacity: WhirlpoolOpacity = 0.4;
  specialLevelsData: SpecialLevels = {
    wheelShow: false,
    wheelFinished: false,
    hero1Show: false,
    hero1Finished: false,
    hero2Show: false,
    hero2Finished: false,
    hero3Show: false,
    hero3Finished: false,
    hero4Show: false,
    hero4Finished: false,
  };
  isSpecialBattle: boolean = false;
  battleStartOpen: boolean = false;
  challengeLevels: LevelDto[] = [];
  challengeFlags: FlagDto[] = [];
  showNewCampaigns: boolean = false;
  shownNewCampaigns: BoosterPack[] = [];
  shownRewardItem: BoosterPack = {
    id: 0,
    image: '',
    cost: 0,
    count: 0,
    showNew: false,
    title: '',
    unlocked: true,
  };
  canClickNextReward: boolean = false;
  hideWhirlpool: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private playerService: playerService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.challengeLevels = this.localStorageService.getChallengeLevels();
    this.challengeFlags = this.localStorageService.getChallengeFlags();
    this.checkStartOfGame();
    this.initFlags();

    const hideWhirlpool = this.localStorageService.getHideWhirlpool();
    if (hideWhirlpool) {
      this.hideWhirlpool = true;
    }
  }

  ngAfterViewInit() {
    this.initPanZoom();
  }

  showWheel() {
    this.loadingService.showWheel$.next(true);
    this.playerService.playSound('open.mp3');
  }

  initFlags() {
    setTimeout(() => {
      this.flagsList = this.localStorageService.getFlagsData();
      this.specialLevelsData = this.localStorageService.getSpecialLevelsData();
      try {
        this.specialLevelsData.hero1Finished =
          this.challengeFlags[0].levelStatus === 'finished';
        this.specialLevelsData.hero2Finished =
          this.challengeFlags[1].levelStatus === 'finished';
        this.specialLevelsData.hero3Finished =
          this.challengeFlags[2].levelStatus === 'finished';
        this.specialLevelsData.hero4Finished =
          this.challengeFlags[3].levelStatus === 'finished';
      } catch (err) {}
      this.nextLevel = this.flagsList.find(
        (x) => x.levelStatus === 'nextLevel'
      );
      this.currentLevel = this.flagsList.find(
        (x) => x.levelStatus === 'justFinished'
      );
      this.flagsList = this.flagsList.map((x) => {
        if (x.levelStatus === 'justFinished') {
          return { ...x, levelStatus: 'finished' };
        }

        if (x.levelStatus === 'nextLevel') {
          return { ...x, alreadyAnimated: true };
        }

        return x;
      });
      const heroes: PlayerDto[] = JSON.parse(
        localStorage.getItem('heroData') ?? '[]'
      );
      this.flagsList.forEach((x) => {
        if (x.id === 1) {
          this.specialLevelsData.wheelShow = true;
        }

        // Forest finished unlock challenge
        if (x.id === 3 && x.levelStatus === 'finished') {
          this.specialLevelsData.hero1Show = true;
        }

        // Forest finished unlock pack
        if (x.id === 4 && x.levelStatus === 'finished') {
          const boosterPacks: BoosterPack[] =
            this.localStorageService.getBoosterPacks();
          const newBoosterPacks = boosterPacks.map((x) => {
            if (x.id === 2 && !x.unlocked) {
              this.showNewCampaigns = true;
              this.shownNewCampaigns = [
                ...this.shownNewCampaigns,
                { ...x, id: 102, image: './assets/rewards/' + x.image },
              ];
              this.shownRewardItem = this.shownNewCampaigns[0];
              setTimeout(() => {
                this.canClickNextReward = true;
              }, 300);
              return { ...x, unlocked: true };
            }
            return x;
          });
          this.currentWhirlpoolScale = 1.5;
          this.currentWhirlpoolOpacity = 0.6;
          this.localStorageService.setBoosterPacks(newBoosterPacks);
        }

        if (x.id === 6 && x.levelStatus === 'finished') {
          if (heroes.length > 0) {
            const newHeroes = heroes.map((x) => {
              if (x.id === 5 && !x.unlocked) {
                this.showNewCampaigns = true;
                this.shownNewCampaigns = [
                  ...this.shownNewCampaigns,
                  {
                    id: 104,
                    cost: 0,
                    count: 0,
                    image: './assets/rewards/' + x.image,
                    showNew: true,
                    title: 'New Hero!',
                    unlocked: true,
                  },
                ];
                this.shownRewardItem = this.shownNewCampaigns[0];
                setTimeout(() => {
                  this.canClickNextReward = true;
                }, 300);
                return { ...x, disabled: false, unlocked: true };
              }

              return x;
            });
            this.playerService.heroDataChanged$.next(true);
            localStorage.setItem('heroData', JSON.stringify(newHeroes));
          }
        }

        // Fire finished unlock challenge
        if (x.id === 6 && x.levelStatus === 'finished') {
          this.specialLevelsData.hero4Show = true;
        }

        // Fire finished unlock pack
        if (x.id === 7 && x.levelStatus === 'finished') {
          this.specialLevelsData.hero2Show = true;
          const boosterPacks: BoosterPack[] =
            this.localStorageService.getBoosterPacks();
          const newBoosterPacks = boosterPacks.map((x) => {
            if (x.id === 3 && !x.unlocked) {
              this.showNewCampaigns = true;
              this.shownNewCampaigns = [
                ...this.shownNewCampaigns,
                { ...x, id: 109, image: './assets/rewards/' + x.image },
              ];
              this.shownRewardItem = this.shownNewCampaigns[0];
              setTimeout(() => {
                this.canClickNextReward = true;
              }, 300);
              return { ...x, unlocked: true };
            }
            return x;
          });
          this.currentWhirlpoolScale = 2;
          this.currentWhirlpoolOpacity = 0.8;
          this.localStorageService.setBoosterPacks(newBoosterPacks);
        }

        // Fire finished unlock pack
        if (x.id === 8 && x.levelStatus === 'finished') {
          this.specialLevelsData.hero3Show = true;
        }

        if (x.id === 9 && x.levelStatus === 'finished') {
          this.currentWhirlpoolScale = 2.5;
          this.currentWhirlpoolOpacity = 1;
        }

        if (x.id === 10 && x.levelStatus === 'finished') {
          setTimeout(() => {
            this.currentWhirlpoolScale = 0;
            this.currentWhirlpoolOpacity = 0;
            this.localStorageService.setHideWhirlpool(true);
          }, 1000);
          const finishedCampaignShown =
            this.localStorageService.getDidShowCampaignFinish();
          console.log(finishedCampaignShown);
          if (!finishedCampaignShown) {
            setTimeout(() => {
              this.localStorageService.setDidShowCampaignFinish(true);
              this.showNewCampaigns = true;
              this.shownNewCampaigns = [
                ...this.shownNewCampaigns,
                {
                  id: 199,
                  cost: 0,
                  count: 0,
                  image: './assets/campaignFinished.png',
                  showNew: true,
                  title: 'Campaign Finished!',
                  unlocked: true,
                },
              ];
              this.shownRewardItem = this.shownNewCampaigns[0];
              setTimeout(() => {
                this.canClickNextReward = true;
              }, 300);
            }, 1500);
          }
        }
      });
      this.localStorageService.setSpecialLevelsData(this.specialLevelsData);
      this.localStorageService.setFlagsData(this.flagsList);
    }, 1);
  }

  isActiveReward(rewardItem: BoosterPack) {
    return this.shownRewardItem.id === rewardItem.id;
  }

  async nextReward(rewardItem: any) {
    if (this.canClickNextReward && this.shownNewCampaigns.length > 0) {
      this.playerService.playSound('cardFlip.mp3');
      // no more clicks
      this.canClickNextReward = false;
      this.shownNewCampaigns = this.shownNewCampaigns.filter(
        (x) => x.id !== rewardItem.id
      );
      // Hide current reward
      this.shownRewardItem = {
        id: 0,
        image: '',
        cost: 0,
        count: 0,
        showNew: false,
        title: '',
        unlocked: true,
      };
      await this.timeout(750);
      // show new reward
      this.shownRewardItem = this.shownNewCampaigns[0];
      if (this.shownNewCampaigns.length === 0) {
        this.showNewCampaigns = false;
      }
      await this.timeout(500);
      // Can click again
      this.canClickNextReward = true;
    }
  }

  finishLevelTest() {
    const foundCurrentFlag = this.flagsList.find(
      (x) => x.levelStatus === 'nextLevel'
    );
    if (foundCurrentFlag) {
      const newFlags: FlagDto[] = this.flagsList.map((x) => {
        if (x.id === foundCurrentFlag.id) {
          return { ...x, levelStatus: 'justFinished', alreadyAnimated: false };
        }

        if (x.id === foundCurrentFlag.id + 1) {
          return { ...x, levelStatus: 'nextLevel' };
        }

        return x;
      });
      this.localStorageService.setFlagsData(newFlags);
      location.reload();
    }
  }

  async initPanZoom() {
    setTimeout(() => {
      this.loadingService.displayOptions$.next(false);
    }, 1);
    await this.timeout(1);
    const container = document.getElementById('myPanzoom');
    const options = {
      maxScale: 0.8,
      minScale: 0.8,
      decelFriction: 0.05,
      dragFriction: 0.35,
      dragMinThreshold: 3,
      friction: 0.25,
      mouseMoveFactor: 1,
      mouseMoveFriction: 1,
      maxVelocity: 25,
      zoom: true,
    };

    const pz = new Panzoom(container, options, {
      Pins,
    });

    const currentLevel = this.flagsList.find(
      (x) => x.levelStatus === 'nextLevel'
    );

    const initArr = Array.from(Array(10).keys());
    for await (let x of initArr) {
      await pz.panTo({
        x: -1000,
        y: -600,
        friction: 0,
        ignoreBounds: false,
      });
      await this.timeout(10);
    }
    if (currentLevel) {
      pz.panTo({
        x: 500 - currentLevel.x,
        y: 200 - currentLevel.y,
        friction: 0.04,
      });
    }
    await this.timeout(4000);
    this.loadingService.displayOptions$.next(true);
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  determineDelayFlag(): number {
    if (this.currentLevel) {
      const delay = this.currentLevel?.dots.length * 200;
      return delay + 500;
    }
    return 2000;
  }

  determineDelayDot(index: number): number {
    const delay = (index + 1) * 200;
    return delay + 200;
  }

  showBattleStartOverlay(flag: FlagDto) {
    this.playerService.playSound('open.mp3');
    this.battleStartOpen = true;
    this.isSpecialBattle = false;
    const levelsData = this.localStorageService.getLevelsData();
    this.currentBattle = levelsData.find((x) => x.id === flag.id);
    this.currentDetails = this.flagsList.find(
      (x) => x.id === flag.id
    )?.missionDetails;
    this.finished =
      flag.levelStatus === 'finished' || flag.levelStatus === 'justFinished';
  }

  checkStartOfGame() {
    try {
      const gameStartedYet = JSON.parse(
        localStorage.getItem('gameStartedYet') ?? 'false'
      );
      if (!gameStartedYet) {
        this.router.navigate(['/']);
      }
    } catch (err) {}
  }

  startSpecialBattle(battle: Battle) {
    this.playerService.playSound('open.mp3');
    this.battleStartOpen = true;
    this.isSpecialBattle = true;
    this.currentBattle = this.challengeLevels.find((x) => x.id === battle);
    this.currentDetails = this.challengeFlags.find(
      (x) => x.id === battle
    )?.missionDetails;
    this.finished =
      this.challengeFlags.find((x) => x.id === battle)?.levelStatus ===
      'finished';
  }

  @HostListener('mousemove', ['$event']) onMouseMove(e: any) {
    if (!this.devMode) {
      return;
    }

    this.mouseX = e.clientX + 10;
    this.mouseY = e.clientY + 10;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    // this.finishLevelTest();

    if (!this.devMode) {
      return;
    }

    if (($event.ctrlKey || $event.metaKey) && $event.keyCode == 90) {
      this.removeLastStep();
    }
  }

  removeLastStep() {
    if (!this.devMode) {
      return;
    }

    if (this.previousFlagsList.length < 1 && this.flagsList.length > 0) {
      return;
    }

    if (this.flagsList.length > 0) {
      const previousItem = this.flagsList[this.flagsList.length - 1];

      // Set current to previous
      // Remove from previous array
      this.flagsList = this.previousFlagsList.pop();

      const currItem = this.flagsList[this.flagsList.length - 1];
      if (previousItem.id !== currItem.id) {
        this.currentFlagHover = undefined;
        this.placingCurrentFlag = undefined;
        this.placingFlag = true;
      }

      if (this.previousFlagsList.length < 1) {
        this.flagsList = [];
        this.previousFlagsList = [];
        this.currentFlagHover = undefined;
        this.placingCurrentFlag = undefined;
        this.placingFlag = true;
      }
    }
  }

  trackById = (index: number, item: any) => item.id;

  addLevel(e: any) {
    var rect = e.target.getBoundingClientRect();
    var x = Math.round(e.clientX - rect.left) - 43;
    var y = Math.round(e.clientY - rect.top) - 70;
    console.log({ x, y });
    e.preventDefault();
    if (!this.devMode) {
      return;
    }

    let ID = 0;
    if (this.placingCurrentFlag && this.placingCurrentFlag.id) {
      ID = this.placingCurrentFlag.id;
    } else {
      ID = this.flagsList.length + 1;
    }

    const FlagObject: FlagDto = {
      id: ID,
      x,
      y,
      levelStatus: 'finished',
      levelType: 'normal',
      alreadyAnimated: false,
      dots: [],
      missionDetails: {
        description: '',
        image: 'loadingBg.png',
        rewardMax: 0,
        rewardMin: 0,
        title: '',
      },
    };
    this.previousFlagsList.push(this.flagsList);
    if (this.placingFlag) {
      // Place flag
      this.placingCurrentFlag = FlagObject;
      this.placingFlag = false;
      this.flagsList.push(FlagObject);
      this.flagsList = this.flagsList.map((x) => {
        if (x.id === FlagObject.id) {
          return x;
        }

        return { ...x, levelStatus: 'finished' };
      });
    } else {
      // place dots
      const foundFlag = this.flagsList.find(
        (x) => x.id === this.placingCurrentFlag?.id
      );
      if (foundFlag) {
        const dotId = foundFlag.dots.length + 1;
        const newDots: DotDto = {
          id: dotId,
          x: FlagObject.x + 34,
          y: FlagObject.y + 62,
        };
        this.flagsList = this.flagsList.map((x) => {
          if (
            this.placingCurrentFlag &&
            this.placingCurrentFlag.id &&
            x.id === this.placingCurrentFlag.id
          ) {
            return { ...x, dots: [...x.dots, newDots] };
          }

          return x;
        });
      }
    }

    if (this.previousFlagsList.length > 10) {
      this.previousFlagsList.shift();
    }

    console.log(this.flagsList);
  }

  @HostListener('mouseup', ['$event'])
  middleclickEvent(e: any) {
    if (!this.devMode) {
      return;
    }

    if (e.which === 2) {
      this.finishDots();
    }
  }

  finishDots() {
    if (!this.devMode) {
      return;
    }

    if (!this.placingFlag) {
      this.placingCurrentFlag = undefined;
      this.placingFlag = true;
    } else {
      this.placingFlag = false;
      this.placingCurrentFlag = this.flagsList[this.flagsList.length - 1];
    }
  }
}

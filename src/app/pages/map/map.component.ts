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
import { DotDto, FlagDto } from 'src/app/models/flag';
import { LevelDto } from 'src/app/models/level';
import { LoadingService } from 'src/app/services/loading.service';
import { flagsData } from 'src/assets/data/flags';
import { LevelsData } from 'src/assets/data/level';
const { Pins } = require('@fancyapps/ui/dist/panzoom/panzoom.pins.esm.js');

type WhirlpoolSize = 1 | 1.25 | 1.5 | 2;
type WhirlpoolOpacity = 0.4 | 0.6 | 0.8 | 1;
type Battle = 'battle1' | 'battle2' | 'battle3' | 'battle4';

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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
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
export class MapComponent implements AfterViewInit, OnInit {
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
    // flyingShipShow: false,
    // flyingShipFinished: false,
    // sailingBoatShowShow: false,
    // sailingBoatShowFinished: false,

    hero1Show: false,
    hero1Finished: false,
    // town1GameShow: false,
    // town1GameFinished: false,
    // town1FightShow: false,
    // town1FightFinished: false,

    hero2Show: false,
    hero2Finished: false,
    // town2GameShow: false,
    // town2GameFinished: false,
    // town2FightShow: false,
    // town2FightFinished: false,

    hero3Show: false,
    hero3Finished: false,
    // town3GameShow: false,
    // town3GameFinished: false,
    // town3FightShow: false,
    // town3FightFinished: false,

    hero4Show: false,
    hero4Finished: false,
    // town4GameShow: false,
    // town4GameFinished: false,
    // town4FightShow: false,
    // town4FightFinished: false,
  };
  isSpecialBattle: boolean = false;
  battleStartOpen: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkStartOfGame();
    this.initFlags();
  }

  ngAfterViewInit() {
    this.initPanZoom();
  }

  showWheel() {
    this.loadingService.showWheel$.next(true);
  }

  initFlags() {
    this.flagsList = JSON.parse(localStorage.getItem('flagsData') ?? '[]');
    if (this.flagsList.length < 1) {
      this.flagsList = flagsData;
      localStorage.setItem('flagsData', JSON.stringify(this.flagsList));
    }

    const specialLevelsData = JSON.parse(
      localStorage.getItem('specialLevelData') ?? '[]'
    );
    if (
      specialLevelsData &&
      (specialLevelsData.wheelShow || !specialLevelsData.wheelShow)
    ) {
      this.specialLevelsData = specialLevelsData;
    }
    this.nextLevel = this.flagsList.find((x) => x.levelStatus === 'nextLevel');
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
    localStorage.setItem('flagsData', JSON.stringify(this.flagsList));
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
    // this.flagsList = this.flagsList.map((x) => {
    //   if (x.levelStatus === 'nextLevel') {
    //     return { ...x, alreadyAnimated: true };
    //   }

    //   return x;
    // });
    // this.currentLevel = this.flagsList.find(
    //   (x) => x.levelStatus === 'nextLevel'
    // );
    // console.log(this.currentLevel);
    // this.flagsList.forEach((x) => {
    //   if (x.levelStatus === 'justFinished') {
    //     this.finishLevel(x);
    //   }
    // });
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
    this.battleStartOpen = true;
    this.isSpecialBattle = false;
    this.currentBattle = LevelsData.find((x) => x.id === flag.id);
    this.currentDetails = this.flagsList.find(
      (x) => x.id === flag.id
    )?.missionDetails;
    this.finished =
      flag.levelStatus === 'finished' || flag.levelStatus === 'justFinished';
  }

  checkStartOfGame() {
    const gameStartedYet = JSON.parse(
      localStorage.getItem('gameStartedYet') ?? ''
    );
    if (!gameStartedYet) {
      this.router.navigate(['/']);
    }
  }

  startSpecialBattle(battle: Battle) {
    // this.battleStartOpen = true;
    // this.isSpecialBattle = true;
    // this.currentBattle = LevelsData.find((x) => x.id === this.currentLevel?.id);
    // set up special file that has special combats (ids battle1, battle2, battle3, battle4,)
  }

  // finishLevel(flag: FlagDto) {
  //   let foundIndex = -10;
  //   this.flagsList = this.flagsList.map((x, i) => {
  //     // Green land
  //     if (flag.id === 3) {
  //       this.specialLevelsData.wheelShow = true;
  //     }
  //     if (flag.id === 4) {
  //       this.specialLevelsData.hero1Show = true;
  //     }
  //     // if (flag.id === 5) {
  //     //   this.specialLevelsData.town1GameShow = true;
  //     // }
  //     // if (flag.id === 5) {
  //     //   this.specialLevelsData.town1FightShow = true;
  //     // }

  //     // Snow land
  //     if (flag.id === 8) {
  //       this.specialLevelsData.hero2Show = true;
  //     }
  //     // if (flag.id === 8) {
  //     //   this.specialLevelsData.town2GameShow = true;
  //     // }
  //     // if (flag.id === 8) {
  //     //   this.specialLevelsData.town2FightShow = true;
  //     // }

  //     // Desert land
  //     if (flag.id === 14) {
  //       this.specialLevelsData.hero3Show = true;
  //     }
  //     // if (flag.id === 14) {
  //     //   this.specialLevelsData.town3GameShow = true;
  //     // }
  //     // if (flag.id === 14) {
  //     //   this.specialLevelsData.town3FightShow = true;
  //     // }

  //     // Fire land
  //     if (flag.id === 19) {
  //       this.specialLevelsData.hero4Show = true;
  //     }
  //     // if (flag.id === 18) {
  //     //   this.specialLevelsData.town4GameShow = true;
  //     // }
  //     // if (flag.id === 18) {
  //     //   this.specialLevelsData.town4FightShow = true;
  //     // }

  //     if (x.id === flag.id) {
  //       foundIndex = i + 1;
  //       this.currentLevel = x;
  //       return { ...x, levelStatus: 'finished' };
  //     }

  //     if (foundIndex === i) {
  //       foundIndex = -10;
  //       return { ...x, levelStatus: 'nextLevel' };
  //     }

  //     return x;
  //   });
  //   localStorage.setItem(
  //     'specialLevelData',
  //     JSON.stringify(this.specialLevelsData)
  //   );
  // }

  @HostListener('mousemove', ['$event']) onMouseMove(e: any) {
    if (!this.devMode) {
      return;
    }

    this.mouseX = e.clientX + 10;
    this.mouseY = e.clientY + 10;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
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

import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  currentBattle: LevelDto | undefined;
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    const currentLevel = this.flagsList.find(
      (x) => x.levelStatus === 'justFinished'
    );
    console.log(this.currentLevel);
    this.currentLevel = currentLevel;
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
    this.flagsList.forEach((x) => {
      if (x.levelStatus === 'justFinished') {
        this.finishLevel(x);
      }
    });
    localStorage.setItem(
      'flagsData',
      JSON.stringify([
        {
          id: 1,
          x: 553,
          y: 1836,
          levelStatus: 'justFinished',
          alreadyAnimated: true,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 667,
              y: 1908,
            },
            {
              id: 2,
              x: 751,
              y: 1908,
            },
            {
              id: 3,
              x: 822,
              y: 1893,
            },
            {
              id: 4,
              x: 889,
              y: 1857,
            },
            {
              id: 5,
              x: 970,
              y: 1859,
            },
            {
              id: 6,
              x: 1058,
              y: 1882,
            },
          ],
        },
        {
          id: 2,
          x: 1054,
          y: 1768,
          levelStatus: 'nextLevel',
          alreadyAnimated: true,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1080,
              y: 1684,
            },
            {
              id: 2,
              x: 1002,
              y: 1657,
            },
            {
              id: 3,
              x: 913,
              y: 1649,
            },
            {
              id: 4,
              x: 845,
              y: 1643,
            },
            {
              id: 5,
              x: 797,
              y: 1613,
            },
          ],
        },
        {
          id: 3,
          x: 775,
          y: 1515,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 842,
              y: 1505,
            },
            {
              id: 2,
              x: 944,
              y: 1508,
            },
            {
              id: 3,
              x: 996,
              y: 1452,
            },
            {
              id: 4,
              x: 1047,
              y: 1395,
            },
            {
              id: 5,
              x: 1131,
              y: 1402,
            },
            {
              id: 6,
              x: 1183,
              y: 1467,
            },
            {
              id: 7,
              x: 1263,
              y: 1532,
            },
            {
              id: 8,
              x: 1370,
              y: 1537,
            },
            {
              id: 9,
              x: 1429,
              y: 1475,
            },
            {
              id: 10,
              x: 1382,
              y: 1404,
            },
          ],
        },
        {
          id: 4,
          x: 1329,
          y: 1269,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1250,
              y: 1194,
            },
            {
              id: 2,
              x: 1178,
              y: 1233,
            },
            {
              id: 3,
              x: 1081,
              y: 1201,
            },
            {
              id: 4,
              x: 986,
              y: 1193,
            },
            {
              id: 5,
              x: 929,
              y: 1245,
            },
            {
              id: 6,
              x: 876,
              y: 1309,
            },
            {
              id: 7,
              x: 772,
              y: 1284,
            },
          ],
        },
        {
          id: 5,
          x: 678,
          y: 1190,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 626,
              y: 1236,
            },
            {
              id: 2,
              x: 621,
              y: 1179,
            },
            {
              id: 3,
              x: 614,
              y: 998,
            },
            {
              id: 4,
              x: 596,
              y: 933,
            },
          ],
        },
        {
          id: 6,
          x: 540,
          y: 826,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 342,
              y: 647,
            },
            {
              id: 2,
              x: 371,
              y: 695,
            },
            {
              id: 3,
              x: 466,
              y: 732,
            },
            {
              id: 4,
              x: 549,
              y: 757,
            },
          ],
        },
        {
          id: 7,
          x: 601,
          y: 684,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 705,
              y: 734,
            },
            {
              id: 2,
              x: 783,
              y: 703,
            },
            {
              id: 3,
              x: 797,
              y: 643,
            },
            {
              id: 4,
              x: 792,
              y: 579,
            },
          ],
        },
        {
          id: 8,
          x: 732,
          y: 469,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 517,
              y: 378,
            },
            {
              id: 2,
              x: 451,
              y: 356,
            },
            {
              id: 3,
              x: 448,
              y: 222,
            },
            {
              id: 4,
              x: 598,
              y: 221,
            },
            {
              id: 5,
              x: 726,
              y: 249,
            },
            {
              id: 6,
              x: 799,
              y: 294,
            },
            {
              id: 7,
              x: 879,
              y: 341,
            },
          ],
        },
        {
          id: 9,
          x: 927,
          y: 265,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1046,
              y: 360,
            },
            {
              id: 2,
              x: 1133,
              y: 347,
            },
            {
              id: 3,
              x: 1232,
              y: 392,
            },
            {
              id: 4,
              x: 1310,
              y: 292,
            },
          ],
        },
        {
          id: 10,
          x: 1239,
          y: 192,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1311,
              y: 397,
            },
            {
              id: 2,
              x: 1362,
              y: 436,
            },
            {
              id: 3,
              x: 1404,
              y: 501,
            },
          ],
        },
        {
          id: 11,
          x: 1456,
          y: 439,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1587,
              y: 484,
            },
            {
              id: 2,
              x: 1684,
              y: 472,
            },
            {
              id: 3,
              x: 1764,
              y: 436,
            },
            {
              id: 4,
              x: 1830,
              y: 387,
            },
          ],
        },
        {
          id: 12,
          x: 1867,
          y: 306,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1963,
              y: 392,
            },
            {
              id: 2,
              x: 2022,
              y: 445,
            },
            {
              id: 3,
              x: 2078,
              y: 500,
            },
            {
              id: 4,
              x: 2168,
              y: 478,
            },
          ],
        },
        {
          id: 13,
          x: 2207,
          y: 389,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 2299,
              y: 457,
            },
            {
              id: 2,
              x: 2363,
              y: 503,
            },
            {
              id: 3,
              x: 2435,
              y: 525,
            },
          ],
        },
        {
          id: 14,
          x: 2446,
          y: 511,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 2589,
              y: 760,
            },
            {
              id: 2,
              x: 2588,
              y: 832,
            },
            {
              id: 3,
              x: 2522,
              y: 891,
            },
            {
              id: 4,
              x: 2418,
              y: 882,
            },
            {
              id: 5,
              x: 2326,
              y: 863,
            },
            {
              id: 6,
              x: 2215,
              y: 881,
            },
            {
              id: 7,
              x: 2130,
              y: 859,
            },
          ],
        },
        {
          id: 15,
          x: 2018,
          y: 786,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 2059,
              y: 894,
            },
            {
              id: 2,
              x: 2109,
              y: 946,
            },
            {
              id: 3,
              x: 2135,
              y: 1007,
            },
            {
              id: 4,
              x: 2120,
              y: 1072,
            },
            {
              id: 5,
              x: 2115,
              y: 1147,
            },
          ],
        },
        {
          id: 16,
          x: 2150,
          y: 1138,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 2204,
              y: 1245,
            },
            {
              id: 2,
              x: 2220,
              y: 1301,
            },
            {
              id: 3,
              x: 2197,
              y: 1372,
            },
          ],
        },
        {
          id: 17,
          x: 2133,
          y: 1353,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 2086,
              y: 1381,
            },
            {
              id: 2,
              x: 2016,
              y: 1343,
            },
            {
              id: 3,
              x: 1932,
              y: 1304,
            },
            {
              id: 4,
              x: 1839,
              y: 1334,
            },
            {
              id: 5,
              x: 1858,
              y: 1399,
            },
          ],
        },
        {
          id: 18,
          x: 1846,
          y: 1385,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 1904,
              y: 1492,
            },
            {
              id: 2,
              x: 1911,
              y: 1552,
            },
            {
              id: 3,
              x: 1933,
              y: 1638,
            },
            {
              id: 4,
              x: 1915,
              y: 1704,
            },
            {
              id: 5,
              x: 1954,
              y: 1778,
            },
            {
              id: 6,
              x: 2030,
              y: 1818,
            },
            {
              id: 7,
              x: 2138,
              y: 1815,
            },
          ],
        },
        {
          id: 19,
          x: 2158,
          y: 1722,
          levelStatus: 'hidden',
          alreadyAnimated: false,
          levelType: 'normal',
          dots: [
            {
              id: 1,
              x: 2243,
              y: 1725,
            },
            {
              id: 2,
              x: 2276,
              y: 1663,
            },
            {
              id: 3,
              x: 2656,
              y: 1699,
            },
            {
              id: 4,
              x: 2563,
              y: 1683,
            },
            {
              id: 5,
              x: 2489,
              y: 1648,
            },
            {
              id: 6,
              x: 2427,
              y: 1599,
            },
            {
              id: 7,
              x: 2422,
              y: 1546,
            },
          ],
        },
        {
          id: 20,
          x: 2423,
          y: 1446,
          levelStatus: 'nextLevel',
          alreadyAnimated: true,
          levelType: 'normal',
          dots: [],
        },
      ])
    );
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
  }

  startSpecialBattle(battle: Battle) {
    // this.battleStartOpen = true;
    // this.isSpecialBattle = true;
    // this.currentBattle = LevelsData.find((x) => x.id === this.currentLevel?.id);
    // set up special file that has special combats (ids battle1, battle2, battle3, battle4,)
  }

  finishLevel(flag: FlagDto) {
    let foundIndex = -10;
    this.flagsList = this.flagsList.map((x, i) => {
      // Green land
      if (flag.id === 3) {
        this.specialLevelsData.wheelShow = true;
      }
      if (flag.id === 4) {
        this.specialLevelsData.hero1Show = true;
      }
      // if (flag.id === 5) {
      //   this.specialLevelsData.town1GameShow = true;
      // }
      // if (flag.id === 5) {
      //   this.specialLevelsData.town1FightShow = true;
      // }

      // Snow land
      if (flag.id === 8) {
        this.specialLevelsData.hero2Show = true;
      }
      // if (flag.id === 8) {
      //   this.specialLevelsData.town2GameShow = true;
      // }
      // if (flag.id === 8) {
      //   this.specialLevelsData.town2FightShow = true;
      // }

      // Desert land
      if (flag.id === 14) {
        this.specialLevelsData.hero3Show = true;
      }
      // if (flag.id === 14) {
      //   this.specialLevelsData.town3GameShow = true;
      // }
      // if (flag.id === 14) {
      //   this.specialLevelsData.town3FightShow = true;
      // }

      // Fire land
      if (flag.id === 19) {
        this.specialLevelsData.hero4Show = true;
      }
      // if (flag.id === 18) {
      //   this.specialLevelsData.town4GameShow = true;
      // }
      // if (flag.id === 18) {
      //   this.specialLevelsData.town4FightShow = true;
      // }

      if (x.id === flag.id) {
        foundIndex = i + 1;
        this.currentLevel = x;
        return { ...x, levelStatus: 'finished' };
      }

      if (foundIndex === i) {
        foundIndex = -10;
        return { ...x, levelStatus: 'nextLevel' };
      }

      return x;
    });
    localStorage.setItem(
      'specialLevelData',
      JSON.stringify(this.specialLevelsData)
    );
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

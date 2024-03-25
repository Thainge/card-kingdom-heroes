import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
} from '@angular/core';
import { Panzoom } from '@fancyapps/ui/dist/panzoom/panzoom.esm.js';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  zoomInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { DialogComponent } from 'src/app/components/dialogComponent/dialog.component';
import { MapOverlayComponent } from 'src/app/components/map-overlay/map-overlay.component';
import { DotDto, FlagDto } from 'src/app/models/flag';
import { flagsData } from 'src/assets/data/flags';
const { Pins } = require('@fancyapps/ui/dist/panzoom/panzoom.pins.esm.js');

type WhirlpoolSize = 1 | 1.25 | 1.5 | 2;
type WhirlpoolOpacity = 0.4 | 0.6 | 0.8 | 1;

interface SpecialLevels {
  wheelShow: boolean;
  wheelFinished: boolean;
  flyingShipShow: boolean;
  flyingShipFinished: boolean;
  sailingBoatShowShow: boolean;
  sailingBoatShowFinished: boolean;

  hero1Show: boolean;
  hero1Finished: boolean;
  town1GameShow: boolean;
  town1GameFinished: boolean;
  town1FightShow: boolean;
  town1FightFinished: boolean;

  hero2Show: boolean;
  hero2Finished: boolean;
  town2GameShow: boolean;
  town2GameFinished: boolean;
  town2FightShow: boolean;
  town2FightFinished: boolean;

  hero3Show: boolean;
  hero3Finished: boolean;
  town3GameShow: boolean;
  town3GameFinished: boolean;
  town3FightShow: boolean;
  town3FightFinished: boolean;

  hero4Show: boolean;
  hero4Finished: boolean;
  town4GameShow: boolean;
  town4GameFinished: boolean;
  town4FightShow: boolean;
  town4FightFinished: boolean;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogComponent, MapOverlayComponent],
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
  placingFlag = true;
  placingCurrentFlag: FlagDto | undefined;
  mouseX: number = 0;
  mouseY: number = 0;
  devMode: boolean = false;
  currentWhirlpoolScale: WhirlpoolSize = 1;
  currentWhirlpoolOpacity: WhirlpoolOpacity = 0.4;
  specialLevelsData: SpecialLevels = {
    wheelShow: true,
    wheelFinished: false,
    flyingShipShow: true,
    flyingShipFinished: false,
    sailingBoatShowShow: true,
    sailingBoatShowFinished: false,

    hero1Show: true,
    hero1Finished: false,
    town1GameShow: true,
    town1GameFinished: false,
    town1FightShow: true,
    town1FightFinished: false,

    hero2Show: true,
    hero2Finished: false,
    town2GameShow: true,
    town2GameFinished: false,
    town2FightShow: true,
    town2FightFinished: false,

    hero3Show: true,
    hero3Finished: false,
    town3GameShow: true,
    town3GameFinished: false,
    town3FightShow: true,
    town3FightFinished: false,

    hero4Show: true,
    hero4Finished: false,
    town4GameShow: true,
    town4GameFinished: false,
    town4FightShow: true,
    town4FightFinished: false,
  };

  constructor() {}

  ngOnInit() {
    this.flagsList = flagsData;
    this.flagsList = flagsData.map((x, i) => {
      return { ...x, levelStatus: 'hidden' };
    });
    this.flagsList[0].levelStatus = 'justFinished';
    this.flagsList[1].levelStatus = 'nextLevel';
    const currentLevel = this.flagsList.find(
      (x) => x.levelStatus === 'justFinished'
    );
    setTimeout(() => {
      this.flagsList = this.flagsList.map((x, i) => {
        if (x.id === currentLevel?.id) {
          return { ...x, levelStatus: 'finished' };
        }
        return x;
      });
    }, 1500);
    this.currentLevel = currentLevel;
  }

  ngAfterViewInit() {
    this.initPanZoom();
  }

  async initPanZoom() {
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

    // const initArr = Array.from(Array(10).keys());
    // for await (let x of initArr) {
    //   await pz.panTo({
    //     x: -1000,
    //     y: -600,
    //     friction: 0,
    //     ignoreBounds: false,
    //   });
    //   await this.timeout(10);
    // }
    // if (currentLevel) {
    //   pz.panTo({
    //     x: 500 - currentLevel.x,
    //     y: 200 - currentLevel.y,
    //     friction: 0.04,
    //   });
    // }
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

  finishLevel(flag: FlagDto) {
    let foundIndex = -10;
    this.flagsList = this.flagsList.map((x, i) => {
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

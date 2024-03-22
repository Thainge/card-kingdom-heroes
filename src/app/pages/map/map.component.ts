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
import { DialogComponent } from 'src/app/components/dialogComponent/dialog.component';
import { DotDto, FlagDto } from 'src/app/models/flag';
import { flagsData } from 'src/assets/data/flags';
const { Pins } = require('@fancyapps/ui/dist/panzoom/panzoom.pins.esm.js');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogComponent],
})
export class MapComponent implements AfterViewInit, OnInit {
  @ViewChild('panZoom', { static: false }) scene: ElementRef | undefined;
  flagsList: FlagDto[] = [];
  previousFlagsList: any[] = [];
  currentFlagHover: FlagDto | undefined;
  placingFlag = true;
  placingCurrentFlag: FlagDto | undefined;
  mouseX: number = 0;
  mouseY: number = 0;
  devMode: boolean = false;

  constructor() {}

  ngOnInit() {
    this.flagsList = flagsData.map((x) => {
      return { ...x, levelStatus: 'hidden' };
    });
    this.flagsList[0].levelStatus = 'finished';
    this.flagsList[1].levelStatus = 'nextLevel';
  }

  ngAfterViewInit() {
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

    new Panzoom(container, options, {
      Pins,
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

    var rect = e.target.getBoundingClientRect();
    var x = Math.round(e.clientX - rect.left) - 43;
    var y = Math.round(e.clientY - rect.top) - 70;
    const FlagObject: FlagDto = {
      id: ID,
      x,
      y,
      levelStatus: 'nextLevel',
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

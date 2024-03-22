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
import { FlagDto } from 'src/app/models/flag';
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
  currentFlagHover: FlagDto | undefined;
  isDoingLevelDots: boolean = false;

  constructor() {}

  ngOnInit() {}

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

  addNormalLevel(e: any) {
    e.preventDefault();
    const ID = this.flagsList.length + 1;
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    const clickObject: FlagDto = {
      id: ID,
      x: Math.round(x) - 32,
      y: Math.round(y) - 80,
      levelStatus: 'nextLevel',
      levelType: 'normal',
      dots: [],
    };
    this.flagsList.push(clickObject as FlagDto);
    console.log(this.flagsList);
  }

  @HostListener('document:keypress', ['$event'])
  giveHint(event: KeyboardEvent) {
    if (event.key && event.key.toLowerCase() === 'q') {
      this.isDoingLevelDots = true;
    }
  }

  @HostListener('mouseup', ['$event']) onClick(e: any) {
    if (e.which === 2) this.addBossLevel(e);
  }

  addBossLevel(e: any) {
    e.preventDefault();
    const ID = this.flagsList.length + 1;
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    const clickObject: FlagDto = {
      id: ID,
      x: Math.round(x),
      y: Math.round(y),
      levelStatus: 'nextLevel',
      levelType: 'boss',
      dots: [],
    };
    this.flagsList.push(clickObject as FlagDto);
    console.log(this.flagsList);
  }

  remove(item: FlagDto) {
    const newPoints = this.flagsList.filter((x) => x.id !== item.id);
    this.flagsList = newPoints.map((x, i) => {
      return { ...x, id: i + 1 };
    });
    console.log(this.flagsList);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Panzoom } from '@fancyapps/ui/dist/panzoom/panzoom.esm.js';
import { DialogComponent } from 'src/app/components/dialogComponent/dialog.component';
const { Pins } = require('@fancyapps/ui/dist/panzoom/panzoom.pins.esm.js');

type ClickObject = {
  id: number;
  x: number;
  y: number;
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogComponent],
})
export class MapComponent implements AfterViewInit, OnInit {
  pointsList: ClickObject[] = [];
  @ViewChild('panZoom', { static: false }) scene: ElementRef | undefined;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const container = document.getElementById('myPanzoom');
    const options = {
      maxScale: 0.8,
      minScale: 0.8,
      decelFriction: 0.02,
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

  test(e: any) {
    e.preventDefault();
    const ID = this.pointsList.length + 1;
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    const clickObject: ClickObject = {
      id: ID,
      x,
      y,
    };
    this.pointsList.push(clickObject);
    console.log(this.pointsList);
  }
}

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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogComponent],
})
export class MapComponent implements AfterViewInit, OnInit {
  @ViewChild('panZoom', { static: false }) scene: ElementRef | undefined;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const container = document.getElementById('myPanzoom');
    const options = {
      maxScale: 0.75,
      minScale: 0.75,
      zoom: true,
    };

    new Panzoom(container, options, {
      Pins,
    });
  }

  test() {
    console.log('hi');
  }
}

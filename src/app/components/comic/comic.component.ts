import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations';
import { Comic, ComicPage } from 'src/app/models/level';

@Component({
  selector: 'app-comic',
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    fadeInOnEnterAnimation({ anchor: 'fadeEnter' }),
    fadeOutOnLeaveAnimation({ anchor: 'fadeOutLeave' }),

    fadeInOnEnterAnimation({ anchor: 'fadeUpEnter' }),
  ],
})
export class ComicComponent implements OnInit {
  open: boolean = false;
  @Input('open') set openChanged(x: boolean) {
    this.open = x;
    if (x) {
      this.initComic();
    }
  }
  @Input('comicData') comicData: Comic = { id: 0, comics: [], display: false };
  currentIndex: number = 0;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnInit() {}

  initComic() {
    if (this.comicData) {
      this.comicData.display = true;
      console.log(this.comicData);
      this.comicData.comics[this.currentIndex].display = true;
    }
  }

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

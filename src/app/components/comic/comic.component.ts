import { playerService } from 'src/app/services/player.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  fadeOutOnLeaveAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations';
import { Comic } from 'src/app/models/level';

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
  currentBlackIndex: number = 0;
  interval: any;

  @Output() onCloseMenu = new EventEmitter<boolean>(false);
  @Output() onCloseMenuTest = new EventEmitter<boolean>(false);

  constructor(private playerService: playerService) {}

  ngOnInit() {}

  initComic() {
    if (this.comicData) {
      this.comicData.display = true;
      setTimeout(() => {
        this.nextStep();
      }, 500);
    }
  }

  nextStep() {
    // Show next comic section
    const isStillMore = this.comicData.comics[this.currentIndex].blackList.find(
      (x) => x.display === true
    );

    if (isStillMore) {
      let found = false;
      this.comicData.comics = this.comicData.comics.map((x, i) => {
        if (i === this.currentIndex) {
          return { ...x, display: true };
        }

        return { ...x, display: false };
      });
      this.comicData.comics[this.currentIndex].blackList =
        this.comicData.comics[this.currentIndex].blackList.map((x) => {
          if (!found && x.display) {
            found = true;
            return { ...x, display: false };
          }

          return x;
        });
    } else {
      // If no more black steps go to next page
      this.playerService.playSound('cardFlip.mp3');
      const nextPage = this.comicData.comics[this.currentIndex + 1];
      if (nextPage) {
        this.currentIndex = this.currentIndex + 1;
        this.currentBlackIndex = 0;
        this.nextStep();
      } else {
        // If no more pages end display
        this.comicData.display = false;
        this.onCloseMenuTest.emit(false);
      }
    }

    this.comicData.comics[this.currentIndex].display = true;
    this.comicData.comics[this.currentIndex].blackList[
      this.currentBlackIndex
    ].display = false;
  }

  trackById = (index: number, item: any) => item.id;

  closeMenu() {
    this.onCloseMenu.emit(false);
  }
}

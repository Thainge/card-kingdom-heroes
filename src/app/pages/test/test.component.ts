import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CampaignOverlayComponent } from 'src/app/components/campaign-overlay/campaign-overlay.component';
import { DifficultyOverlayComponent } from 'src/app/components/choose-difficulty-overlay/choose-difficulty-overlay.component';
import { CreditsOverlayComponent } from 'src/app/components/credits-overlay/credits-overlay.component';
import { MapOverlayComponent } from 'src/app/components/map-overlay/map-overlay.component';
import { ComicComponent } from 'src/app/components/comic/comic.component';
import { Comic } from 'src/app/models/level';
import { ComicDataZelda } from 'src/assets/data/comic/comicZelda';
import { FormsModule } from '@angular/forms';

type parameterBlack = 'width' | 'height' | 'left' | 'top';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DifficultyOverlayComponent,
    CampaignOverlayComponent,
    CreditsOverlayComponent,
    MapOverlayComponent,
    ComicComponent,
    FormsModule,
    NgFor,
  ],
})
export class TestComponent implements OnInit {
  showComic: boolean = true;
  allComics: Comic[] = [];
  currentComic: Comic = {
    comics: [],
    display: false,
    id: 0,
  };
  currentComicIndex: number = 0;

  // Dev
  devWidth: string = '0';
  devHeight: string = '0';
  devTop: string = '0';
  devLeft: string = '0';
  devIndex: number = 0;
  currentBlackList: any[] = [];

  constructor() {}

  ngOnInit() {
    this.allComics = ComicDataZelda;
    this.currentComic = this.allComics[this.currentComicIndex];
    this.updateInputs();
  }

  submitBox() {
    // const newObj = {
    // height: Number(this.devHeight),
    // width: Number(this.devWidth),
    // left: Number(this.devLeft),
    // top: Number(this.devTop),
    // };
    // this.devWidth = '0';
    // this.devHeight = '0';
    // this.devTop = '0';
    // this.devLeft = '0';
  }

  nextComic() {
    this.showComic = false;
    this.currentComicIndex = this.currentComicIndex + 1;

    setTimeout(() => {
      if (this.allComics[this.currentComicIndex]) {
        this.currentComic = this.allComics[this.currentComicIndex];
        this.showComic = true;
      } else {
        this.currentComic = {
          comics: [],
          display: false,
          id: 0,
        };
        this.showComic = false;
      }
      this.updateInputs();
    }, 1000);
  }

  updateInputs() {
    const currentBlacklist =
      this.allComics[this.currentComicIndex].comics[this.devIndex].blackList;
    this.currentBlackList = currentBlacklist;
  }

  updateBox(e: any, index: number, type: parameterBlack) {
    const value = e.target.value;
    this.currentBlackList = this.currentBlackList.map((x, i) => {
      if (index === i && type === 'width') {
        return { ...x, width: Number(value) };
      }

      if (index === i && type === 'height') {
        return { ...x, height: Number(value) };
      }

      if (index === i && type === 'top') {
        return { ...x, top: Number(value) };
      }

      if (index === i && type === 'left') {
        return { ...x, left: Number(value) };
      }

      return x;
    });
    this.currentComic.comics[this.devIndex].blackList = this.currentBlackList;
  }

  add() {
    this.currentBlackList.push({ width: 0, height: 0, top: 0, left: 0 });
    this.currentComic.comics[this.devIndex].blackList = this.currentBlackList;
  }

  updateIndex(value: number) {
    this.devIndex = value;
    this.updateInputs();
  }
}

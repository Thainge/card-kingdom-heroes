import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackgroundDto } from '../models/backgrounds';
import { playerService } from './player.service';

interface LoadingObject {
  loading: boolean;
  url: string;
  image: BackgroundDto;
  text: string;
}

interface Tip {
  title: string;
  header: string;
  text: string;
  img: string;
  tipRows: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly isLoading$ = new BehaviorSubject<LoadingObject>({
    loading: true,
    url: 'null',
    image: 'forest.png',
    text: 'Amazing, right?',
  });
  readonly isSurrendering$ = new BehaviorSubject<boolean>(false);
  readonly isRefreshing$ = new BehaviorSubject<boolean>(false);
  readonly displayOptions$ = new BehaviorSubject<boolean>(true);
  readonly difficultyIsOpen$ = new BehaviorSubject<boolean>(false);
  readonly showWheel$ = new BehaviorSubject<boolean>(false);
  readonly currentTip$ = new BehaviorSubject<Tip>({
    title: 'New Tip',
    header: 'Wild Cards',
    text: 'Wild cards can be any value or suite',
    img: 'wildImg.png',
    tipRows: [
      '- Use mousewheel to change value',
      '- Click the suite icons to change suite',
    ],
  });
  readonly showTip$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public navigate(url: string, image: BackgroundDto, text: string) {
    this.isLoading$.next({ loading: true, url: url, image: image, text: text });
  }
}

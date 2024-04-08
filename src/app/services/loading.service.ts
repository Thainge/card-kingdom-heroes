import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackgroundDto } from '../models/backgrounds';

interface LoadingObject {
  loading: boolean;
  url: string;
  image: BackgroundDto;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly isLoading$ = new BehaviorSubject<LoadingObject>({
    loading: true,
    url: 'null',
    image: 'forest.png',
  });
  readonly isSurrendering$ = new BehaviorSubject<boolean>(false);
  readonly isRefreshing$ = new BehaviorSubject<boolean>(false);
  readonly displayOptions$ = new BehaviorSubject<boolean>(true);
  readonly difficultyIsOpen$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public navigate(url: string, image: BackgroundDto) {
    this.isLoading$.next({ loading: true, url: url, image: image });
  }
}

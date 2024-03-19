import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface LoadingObject {
  loading: boolean;
  url: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly isLoading$ = new BehaviorSubject<LoadingObject>({
    loading: true,
    url: 'null',
    image: '',
  });
  readonly isSurrendering$ = new BehaviorSubject<boolean>(false);
  readonly isRefreshing$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public navigate(url: string, image: string) {
    this.isLoading$.next({ loading: true, url: url, image: image });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface LoadingObject {
  loading: boolean;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly isLoading$ = new BehaviorSubject<LoadingObject>({
    loading: true,
    url: 'null',
  });

  constructor() {}

  public navigate(url: string) {
    this.isLoading$.next({ loading: true, url: url });
  }
}

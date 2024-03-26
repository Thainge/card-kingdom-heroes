import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AchievementObject } from '../models/achievement';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  readonly achievements$ = new BehaviorSubject<AchievementObject>({
    id: 0,
    description: '',
    image: '',
    title: '',
    unlocked: false,
  });

  constructor() {}

  public pushNewAchievement(achievement: AchievementObject) {
    this.achievements$.next(achievement);
  }
}

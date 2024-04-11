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
    gemsUnlocked: false,
    reward: 150,
  });

  constructor() {
    this.achievements$.subscribe((x) => {
      if (x.id !== 0) {
        let current = JSON.parse(localStorage.getItem('achievements') ?? '[]');
        current.push(x);
        localStorage.setItem('achievements', JSON.stringify(current));
      }
    });
  }

  public pushNewAchievement(achievement: AchievementObject) {
    this.achievements$.next(achievement);
  }
}

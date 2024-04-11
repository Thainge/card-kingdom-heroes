import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AchievementObject } from '../models/achievement';
import { AchievementsData } from 'src/assets/data/achievements';

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
  readonly allAchievements$ = new BehaviorSubject<AchievementObject[]>([]);

  constructor() {
    this.achievements$.subscribe((x) => {
      if (x.id !== 0) {
        let current = JSON.parse(localStorage.getItem('achievements') ?? '[]');
        current.push(x);
        localStorage.setItem('achievements', JSON.stringify(current));
        this.allAchievements$.next(current);
      }
    });
    const cleanData = JSON.parse(localStorage.getItem('achievements') ?? '[]');
    if (cleanData.length < 1) {
      this.allAchievements$.next(AchievementsData);
    } else {
      this.allAchievements$.next(cleanData);
    }
  }

  public pushNewAchievement(achievement: AchievementObject) {
    this.achievements$.next(achievement);
  }
}

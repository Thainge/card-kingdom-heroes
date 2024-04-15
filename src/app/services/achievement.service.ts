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
    worldId: 1,
    description: '',
    image: '',
    title: '',
    unlocked: false,
    gemsUnlocked: false,
    reward: 150,
  });
  readonly allAchievements$ = new BehaviorSubject<AchievementObject[]>([]);

  constructor() {
    const cleanData = JSON.parse(localStorage.getItem('achievements') ?? '[]');
    if (cleanData.length < 1) {
      this.allAchievements$.next(AchievementsData);
      localStorage.setItem('achievements', JSON.stringify(AchievementsData));
    } else {
      this.allAchievements$.next(cleanData);
    }
  }

  public unlockNewAchievement(id: number) {
    const currentData: AchievementObject[] = JSON.parse(
      localStorage.getItem('achievements') ?? '[]'
    );
    let updated = false;
    let updateObj: AchievementObject | undefined;
    const newData = currentData.map((x) => {
      if (x.id === id && !x.unlocked && x.worldId === 1) {
        updated = true;
        updateObj = x;
        return { ...x, unlocked: true };
      }
      return x;
    });
    if (updated && updateObj) {
      localStorage.setItem('achievements', JSON.stringify(newData));
      this.pushNewAchievement(updateObj);
    }
  }

  private pushNewAchievement(achievement: AchievementObject) {
    this.achievements$.next(achievement);
  }
}

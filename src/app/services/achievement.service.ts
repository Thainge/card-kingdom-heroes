import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AchievementObject } from '../models/achievement';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  readonly achievements$ = new BehaviorSubject<AchievementObject>({
    id: 0,
    description: '',
    worldId: 0,
    image: '',
    title: '',
    unlocked: false,
    gemsUnlocked: false,
    reward: 150,
  });
  readonly allAchievements$ = new BehaviorSubject<AchievementObject[]>([]);

  constructor(private localStorageService: LocalStorageService) {
    const cleanData = this.localStorageService.getAchievements();
    this.allAchievements$.next(cleanData);
  }

  public unlockNewAchievement(id: number) {
    const currentData: AchievementObject[] =
      this.localStorageService.getAllAchievements();
    let updated = false;
    let updateObj: AchievementObject | undefined;
    const currentPage = this.localStorageService.getCurrentAchievementPage();
    const newData = currentData.map((x) => {
      if (x.id === id && !x.unlocked && x.worldId === currentPage) {
        updated = true;
        updateObj = x;
        return { ...x, unlocked: true };
      }
      return x;
    });
    if (updated && updateObj) {
      this.localStorageService.setAchievements(newData);
      this.pushNewAchievement(updateObj);
    }
  }

  private pushNewAchievement(achievement: AchievementObject) {
    this.achievements$.next(achievement);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AchievementObject } from '../models/achievement';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly showTip$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  //   getAchievements(): AchievementObject[] {
  //     const currentRoute = localStorage.getItem('currentRoute');
  //     return [];
  //   }

  //   setAchievements(data: AchievementObject[]) {
  //     const currentRoute = localStorage.getItem('currentRoute');
  //   }

  // abilityCards

  // achievements

  // flagsData

  // playerDeck

  // boosterPacks

  // currentLevel

  // currentDetails

  // challengeFlags

  // challengeLevels

  // specialLevelData

  // playerGold
}

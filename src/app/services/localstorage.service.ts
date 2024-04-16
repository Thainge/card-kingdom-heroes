import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AchievementObject } from '../models/achievement';
import { AchievementsData } from 'src/assets/data/achievements';
import { AbilityCard } from '../models/abilityCard';
import { AbilityData } from 'src/assets/data/ability';
import { FlagDto } from '../models/flag';
import { flagsData } from 'src/assets/data/flags';
import { DefaultAbilityData } from 'src/assets/data/defaultAbility';
import { BoosterPack } from '../models/boosterPack';
import { BoosterPacks } from 'src/assets/data/booster';
import { LevelDto } from '../models/level';
import { BackgroundDto } from '../models/backgrounds';
import { ChallengeFlags, ChallengeLevels } from 'src/assets/data/specialLevels';

type RouteUrl = 'cardkingdom-map' | 'zelda-map';

interface empty {}

interface MissionDetails {
  image: BackgroundDto;
  title: string;
  description: string;
  rewardMin: number;
  rewardMax: number;
}

interface SpecialLevels {
  wheelShow: boolean;
  wheelFinished: boolean;
  hero1Show: boolean;
  hero1Finished: boolean;
  hero2Show: boolean;
  hero2Finished: boolean;
  hero3Show: boolean;
  hero3Finished: boolean;
  hero4Show: boolean;
  hero4Finished: boolean;
}

const DefaultSpecialLevelsData: SpecialLevels = {
  wheelShow: false,
  wheelFinished: false,
  hero1Show: false,
  hero1Finished: false,
  hero2Show: false,
  hero2Finished: false,
  hero3Show: false,
  hero3Finished: false,
  hero4Show: false,
  hero4Finished: false,
};

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly showTip$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  private currentRoute = (): RouteUrl =>
    (localStorage.getItem('currentRoute') as RouteUrl) ?? 'cardkingdom-map';

  public getAchievements(): AchievementObject[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-achievements') ?? '[]'
      );
      if (data.length < 1) {
        this.setAchievements(AchievementsData);
        return AchievementsData;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setAchievements(data: AchievementObject[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-achievements', JSON.stringify(data));
    }
  }

  public getAbilityCards(): AbilityCard[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-abilityCards') ?? '[]'
      );
      if (data.length < 1) {
        this.setAbilityCards(AbilityData);
        return AbilityData;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setAbilityCards(data: AbilityCard[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-abilityCards', JSON.stringify(data));
    }
  }

  public getFlagsData(): FlagDto[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-flagsData') ?? '[]'
      );
      if (data.length < 1) {
        this.setFlagsData(flagsData);
        return flagsData;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setFlagsData(data: FlagDto[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-flagsData', JSON.stringify(data));
    }
  }

  public getPlayerDeck(): AbilityCard[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-playerDeck') ?? '[]'
      );
      if (data.length < 1) {
        this.setPlayerDeck(DefaultAbilityData);
        return DefaultAbilityData;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setPlayerDeck(data: AbilityCard[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-playerDeck', JSON.stringify(data));
    }
  }

  public getBoosterPacks(): BoosterPack[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-boosterPacks') ?? '[]'
      );
      if (data.length < 1) {
        this.setBoosterPacks(BoosterPacks);
        return BoosterPacks;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setBoosterPacks(data: BoosterPack[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-boosterPacks', JSON.stringify(data));
    }
  }

  public getCurrentBattle(): LevelDto | empty {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-currentBattle') ?? '{}'
      );
      if (data) {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return {};
    }

    return {};
  }

  public setCurrentBattle(data: LevelDto) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-currentBattle', JSON.stringify(data));
    }
  }

  public getCurrentDetails(): MissionDetails | empty {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-currentDetails') ?? '[]'
      );
      if (data) {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return {};
    }

    return {};
  }

  public setCurrentDetails(data: MissionDetails) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-currentDetails', JSON.stringify(data));
    }
  }

  public getChallengeFlags(): FlagDto[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-challengeFlags') ?? '[]'
      );
      if (data.length < 1) {
        this.setChallengeFlags(ChallengeFlags);
        return ChallengeFlags;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setChallengeFlags(data: FlagDto[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-challengeFlags', JSON.stringify(data));
    }
  }

  public getChallengeLevels(): LevelDto[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-challengeLevels') ?? '[]'
      );
      if (data.length < 1) {
        this.setChallengeLevels(ChallengeLevels);
        return ChallengeLevels;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setChallengeLevels(data: LevelDto[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-challengeLevels', JSON.stringify(data));
    }
  }

  public getSpecialLevelsData(): SpecialLevels {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-specialLevelsData') ?? '{}'
      );
      if (!data) {
        this.setSpecialLevelsData(DefaultSpecialLevelsData);
        return DefaultSpecialLevelsData;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return DefaultSpecialLevelsData;
  }

  public setSpecialLevelsData(data: SpecialLevels) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem(
        'cardkingdom-specialLevelsData',
        JSON.stringify(data)
      );
    }
  }

  public getPlayerGold(): number {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-playerGold') ?? '[]'
      );
      if (!data) {
        this.setPlayerGold(0);
        return 0;
      } else {
        return data;
      }
    }

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return 0;
  }

  public setPlayerGold(data: number) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-playerGold', JSON.stringify(data));
    }
  }
}

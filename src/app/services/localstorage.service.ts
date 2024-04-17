import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AchievementObject } from '../models/achievement';
import { AchievementsData } from 'src/assets/data/achievement/achievements';
import { AbilityCard } from '../models/abilityCard';
import { FlagDto } from '../models/flag';
import { flagsData } from 'src/assets/data/flagsData/flags';
import { DefaultAbilityData } from 'src/assets/data/defaultAbility/defaultAbility';
import { BoosterPack } from '../models/boosterPack';
import { BoosterPacks } from 'src/assets/data/booster/booster';
import { Comic, LevelDto } from '../models/level';
import { BackgroundDto } from '../models/backgrounds';
import {
  ChallengeFlags,
  ChallengeLevels,
} from 'src/assets/data/specialLevels/specialLevels';
import { WheelData } from 'src/assets/data/wheelData/wheel';
import { AbilityData } from 'src/assets/data/ability/ability';
import { LevelsData } from 'src/assets/data/levelData/level';
import { AchievementsDataZelda } from 'src/assets/data/achievement/achievementsZelda';
import { AbilityDataZelda } from 'src/assets/data/ability/abilityZelda';
import { BoosterPacksZelda } from 'src/assets/data/booster/boosterZelda';
import { DefaultAbilityDataZelda } from 'src/assets/data/defaultAbility/defaultAbilityZelda';
import { flagsDataZelda } from 'src/assets/data/flagsData/flagsZelda';
import { LevelsDataZelda } from 'src/assets/data/levelData/levelZelda';
import { WheelDataZelda } from 'src/assets/data/wheelData/wheelZelda';
import {
  ChallengeFlagsZelda,
  ChallengeLevelsZelda,
} from 'src/assets/data/specialLevels/specialLevelsZelda';

type RouteUrl = 'cardkingdom-map' | 'zelda-map';

interface empty {}

interface AbilityDeckCard extends AbilityCard {
  owned: boolean;
  inHand: boolean;
  index: number;
}

interface MissionDetails {
  image: BackgroundDto;
  title: string;
  description: string;
  rewardMin: number;
  rewardMax: number;
}

interface StarsData {
  cardKingdomTotal: number;
  cardKingdomStars: number;
  zeldaTotal: number;
  zeldaStars: number;
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

interface WheelItem {
  backgroundColor?: string;
  image?: string;
  imageOpacity?: number;
  imageRadius?: number;
  imageRotation?: number;
  imageScale?: number;
  label?: string;
  labelColor?: string;
  value?: number;
  weight?: number;

  text: string;
  textAmount: string;
  rewardImage: string;
  rewardType: RewardType;
  boosterPackId?: number;
  goldAmount: number;
}

type RewardType = 'gold' | 'booster';

interface WheelProps {
  borderColor?: string;
  borderWidth?: number;
  debug?: boolean;
  image?: string;
  isInteractive?: boolean;
  itemBackgroundColors?: string[];
  itemLabelAlign?: string;
  itemLabelBaselineOffset?: number;
  itemLabelColors?: string;
  itemLabelFont?: string;
  itemLabelFontSizeMax?: number;
  itemLabelRadius?: number;
  itemLabelRadiusMax?: number;
  itemLabelRotation?: number;
  itemLabelStrokeColor?: string;
  itemLabelStrokeWidth?: number;
  items?: WheelItem[];
  lineColor?: string;
  lineWidth?: number;
  pixelRatio?: number;
  radius?: number;
  rotation?: number;
  rotationResistance?: number;
  rotationSpeed?: number;
  rotationSpeedMax?: number;
  offset?: Offset;
  onCurrentIndexChange?: string;
  onRest?: any;
  onSpin?: any;
  overlayImage?: any;
  pointerAngle?: number;
}

interface Offset {
  w: number;
  h: number;
}

interface CampaignBox {
  id: number;
  image: string;
  url: RouteUrl;
  locked: boolean;
  stars: number;
  total: number;
}

interface RouteDataObj {
  ability: AbilityCard[];
  achievement: AchievementObject[];
  booster: BoosterPack[];
  defaultAbility: AbilityCard[];
  flagsData: FlagDto[];
  levelsData: LevelDto[];
  specialLevels: SpecialLevels;
  challengeLevels: LevelDto[];
  challengeFlags: FlagDto[];
  wheelData: WheelItem[];
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly showTip$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public currentRoute = (): RouteUrl =>
    (localStorage.getItem('currentRoute') as RouteUrl) ?? 'cardkingdom-map';

  private getRouteData(): RouteDataObj {
    if (this.currentRoute() === 'zelda-map') {
      return {
        ability: AbilityDataZelda,
        achievement: AchievementsDataZelda,
        booster: BoosterPacksZelda,
        defaultAbility: DefaultAbilityDataZelda,
        flagsData: flagsDataZelda,
        levelsData: LevelsDataZelda,
        specialLevels: DefaultSpecialLevelsData,
        challengeLevels: ChallengeLevels,
        challengeFlags: ChallengeFlags,
        wheelData: WheelDataZelda,
      };
    }

    return {
      ability: AbilityData,
      achievement: AchievementsData,
      booster: BoosterPacks,
      defaultAbility: DefaultAbilityData,
      flagsData: flagsData,
      levelsData: LevelsData,
      specialLevels: DefaultSpecialLevelsData,
      challengeLevels: ChallengeLevelsZelda,
      challengeFlags: ChallengeFlagsZelda,
      wheelData: WheelData,
    };
  }

  public getCampaignsData(): CampaignBox[] {
    const localData = JSON.parse(localStorage.getItem('campaignData') ?? '[]');
    if (localData.length < 1) {
      const defaultData: CampaignBox[] = [
        {
          id: 1,
          image: 'normalCampaign.png',
          url: 'cardkingdom-map',
          locked: false,
          stars: 0,
          total: 0,
        },
        {
          id: 2,
          image: 'linkCampaign.png',
          url: 'zelda-map',
          locked: true,
          stars: 0,
          total: 0,
        },
      ];
      this.setCampaignsData(defaultData);
      return defaultData;
    }

    return localData;
  }

  public setCampaignsData(data: CampaignBox[]) {
    localStorage.setItem('campaignData', JSON.stringify(data));
  }

  public getLevelsData(): LevelDto[] {
    return this.getRouteData().levelsData;
  }

  public getWheelItems(): WheelItem[] {
    return this.getRouteData().wheelData;
  }

  public getAbilityData(): AbilityCard[] {
    return this.getRouteData().ability;
  }

  public getAchievements(): AchievementObject[] {
    const RouteData = this.getRouteData().achievement;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-achievements') ?? '[]'
    );
    if (data.length < 1) {
      this.setAchievements(RouteData);
      return RouteData;
    } else {
      return data;
    }
  }

  public setAchievements(data: AchievementObject[]) {
    localStorage.setItem(
      this.currentRoute() + '-achievements',
      JSON.stringify(data)
    );
  }

  public getAbilityCards(): AbilityDeckCard[] {
    const RouteData = this.getRouteData().defaultAbility;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-abilityCards') ?? '[]'
    );
    if (data.length < 1) {
      const handCards: AbilityDeckCard[] = RouteData.map((x) => {
        return {
          ...x,
          isNew: false,
          inHand: true,
          numberOwned: 0,
          index: 0,
          owned: false,
        };
      });
      this.setAbilityCards(handCards);
      return handCards;
    } else {
      return data;
    }
  }

  public setAbilityCards(data: AbilityDeckCard[]) {
    localStorage.setItem(
      this.currentRoute() + '-abilityCards',
      JSON.stringify(data)
    );
  }

  public getStarsData(): StarsData {
    const cardKingdomFlags: FlagDto[] = JSON.parse(
      localStorage.getItem('cardkingdom-map-flagsData') ?? '[]'
    );
    const cardKingdomCompletedLevels = cardKingdomFlags.filter(
      (x) => x.levelStatus === 'finished' || x.levelStatus === 'justFinished'
    );
    const zeldaFlags: FlagDto[] = JSON.parse(
      localStorage.getItem('zelda-map-flagsData') ?? '[]'
    );
    const zeldaCompletedLevels = zeldaFlags.filter(
      (x) => x.levelStatus === 'finished' || x.levelStatus === 'justFinished'
    );

    return {
      cardKingdomTotal: cardKingdomFlags.length * 3,
      cardKingdomStars: cardKingdomCompletedLevels.length * 3,
      zeldaTotal: zeldaFlags.length * 3,
      zeldaStars: zeldaCompletedLevels.length * 3,
    };
  }

  public getFlagsData(): FlagDto[] {
    const RouteData = this.getRouteData().flagsData;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-flagsData') ?? '[]'
    );
    if (data.length < 1) {
      this.setFlagsData(RouteData);
      return RouteData;
    } else {
      return data;
    }
  }

  public setFlagsData(data: FlagDto[]) {
    localStorage.setItem(
      this.currentRoute() + '-flagsData',
      JSON.stringify(data)
    );
  }

  public getPlayerDeck(): AbilityDeckCard[] {
    const RouteData = this.getRouteData().defaultAbility;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-playerDeck') ?? '[]'
    );
    if (data.length < 1) {
      const deckCards: AbilityDeckCard[] = RouteData.map((x) => {
        return {
          ...x,
          isNew: false,
          inHand: false,
          numberOwned: 0,
          index: 0,
          owned: true,
        };
      });
      this.setPlayerDeck(deckCards);
      return deckCards;
    } else {
      return data;
    }
  }

  public setPlayerDeck(data: AbilityDeckCard[]) {
    localStorage.setItem(
      this.currentRoute() + '-playerDeck',
      JSON.stringify(data)
    );
  }

  public getBoosterPacks(): BoosterPack[] {
    const RouteData = this.getRouteData().booster;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-boosterPacks') ?? '[]'
    );
    if (data.length < 1) {
      this.setBoosterPacks(RouteData);
      return RouteData;
    } else {
      return data;
    }
  }

  public setBoosterPacks(data: BoosterPack[]) {
    localStorage.setItem(
      this.currentRoute() + '-boosterPacks',
      JSON.stringify(data)
    );
  }

  public getCurrentBattle(): LevelDto | empty {
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-currentBattle') ?? '{}'
    );
    if (data) {
      return data;
    } else {
      return {};
    }
  }

  public setCurrentBattle(data: LevelDto) {
    localStorage.setItem(
      this.currentRoute() + '-currentBattle',
      JSON.stringify(data)
    );
  }

  public getCurrentDetails(): MissionDetails | empty {
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-currentDetails') ?? '[]'
    );
    if (data) {
      return data;
    } else {
      return {};
    }
  }

  public setCurrentDetails(data: MissionDetails) {
    localStorage.setItem(
      this.currentRoute() + '-currentDetails',
      JSON.stringify(data)
    );
  }

  public getChallengeFlags(): FlagDto[] {
    const RouteData = this.getRouteData().challengeFlags;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-challengeFlags') ?? '[]'
    );
    if (data.length < 1) {
      this.setChallengeFlags(RouteData);
      return RouteData;
    } else {
      return data;
    }
  }

  public setChallengeFlags(data: FlagDto[]) {
    localStorage.setItem(
      this.currentRoute() + '-challengeFlags',
      JSON.stringify(data)
    );
  }

  public getChallengeLevels(): LevelDto[] {
    const RouteData = this.getRouteData().challengeLevels;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-challengeLevels') ?? '[]'
    );
    if (data.length < 1) {
      this.setChallengeLevels(RouteData);
      return RouteData;
    } else {
      return data;
    }
  }

  public setChallengeLevels(data: LevelDto[]) {
    localStorage.setItem(
      this.currentRoute() + '-challengeLevels',
      JSON.stringify(data)
    );
  }

  public getSpecialLevelsData(): SpecialLevels {
    const RouteData = this.getRouteData().specialLevels;
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-specialLevelsData') ?? '{}'
    );
    if (!data) {
      this.setSpecialLevelsData(RouteData);
      return RouteData;
    } else {
      return data;
    }
  }

  public setSpecialLevelsData(data: SpecialLevels) {
    localStorage.setItem(
      this.currentRoute() + '-specialLevelsData',
      JSON.stringify(data)
    );
  }

  public getPlayerGold(): number {
    const data = JSON.parse(
      localStorage.getItem(this.currentRoute() + '-playerGold') ?? '0'
    );
    if (!data) {
      this.setPlayerGold(0);
      return 0;
    } else {
      return data;
    }
  }

  public setPlayerGold(data: number) {
    localStorage.setItem(
      this.currentRoute() + '-playerGold',
      JSON.stringify(data)
    );
  }
}

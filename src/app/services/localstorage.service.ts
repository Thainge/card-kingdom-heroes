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
import { LevelDto } from '../models/level';
import { BackgroundDto } from '../models/backgrounds';
import {
  ChallengeFlags,
  ChallengeLevels,
} from 'src/assets/data/specialLevels/specialLevels';
import { WheelData } from 'src/assets/data/wheelData/wheel';
import { AbilityData } from 'src/assets/data/ability/ability';
import { LevelsData } from 'src/assets/data/levelData/level';

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

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  readonly showTip$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public currentRoute = (): RouteUrl =>
    (localStorage.getItem('currentRoute') as RouteUrl) ?? 'cardkingdom-map';

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
        // {
        //   id: 3,
        //   image: 'marioCampaign.png',
        //   url: 'mario-map',
        // },
        // {
        //   id: 4,
        //   image: 'tf2Campaign.png',
        //   url: 'tf2-map',
        // },
        // {
        //   id: 5,
        //   image: 'kirbyCampaign.png',
        //   url: 'kirby-map',
        // },
        // {
        //   id: 6,
        //   image: 'donkeyKongCampaign.png',
        //   url: 'donkeykong-map',
        // },
      ];
      this.setCampaignsData(defaultData);
    }

    return localData;
  }

  setCampaignsData(data: CampaignBox[]) {
    localStorage.setItem('campaignData', JSON.stringify(data));
  }

  public getLevelsData(): LevelDto[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      return LevelsData;
    }

    return [];
  }

  public getWheelItems(): WheelItem[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      return WheelData;
    }

    if (this.currentRoute() === 'zelda-map') {
    }

    return [];
  }

  public getAbilityData(): AbilityCard[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      return AbilityData;
    }

    return [];
  }

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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
    }
  }

  public getAbilityCards(): AbilityDeckCard[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-abilityCards') ?? '[]'
      );
      if (data.length < 1) {
        const handCards: AbilityDeckCard[] = DefaultAbilityData.map((x) => {
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

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setAbilityCards(data: AbilityDeckCard[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-abilityCards', JSON.stringify(data));
    }

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
    }
  }

  public getStarsData(): StarsData {
    const cardKingdomFlags = this.getFlagsData(1, true);
    const cardKingdomCompletedLevels = cardKingdomFlags.filter(
      (x) => x.levelStatus === 'finished' || x.levelStatus === 'justFinished'
    );
    const zeldaFlags = this.getFlagsData(2, true);
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

  public getFlagsData(
    routeNumber: number = -10,
    isCustom: boolean = false
  ): FlagDto[] {
    if (
      (this.currentRoute() === 'cardkingdom-map' && !isCustom) ||
      routeNumber === 1
    ) {
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

    if (
      (this.currentRoute() === 'zelda-map' && !isCustom) ||
      routeNumber === 2
    ) {
      // return [];
    }

    return [];
  }

  public setFlagsData(data: FlagDto[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-flagsData', JSON.stringify(data));
    }

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
    }
  }

  public getPlayerDeck(): AbilityDeckCard[] {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-playerDeck') ?? '[]'
      );
      if (data.length < 1) {
        const deckCards: AbilityDeckCard[] = DefaultAbilityData.map((x) => {
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

    if (this.currentRoute() === 'zelda-map') {
      // return [];
    }

    return [];
  }

  public setPlayerDeck(data: AbilityDeckCard[]) {
    if (this.currentRoute() === 'cardkingdom-map') {
      localStorage.setItem('cardkingdom-playerDeck', JSON.stringify(data));
    }

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
    }
  }

  public getPlayerGold(): number {
    if (this.currentRoute() === 'cardkingdom-map') {
      const data = JSON.parse(
        localStorage.getItem('cardkingdom-playerGold') ?? '0'
      );
      console.log(data);
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

    if (this.currentRoute() === 'zelda-map') {
      // localstorage.setItem('zelda-achievements', JSON.stringify(data));
    }
  }
}

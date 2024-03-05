import { Injectable } from '@angular/core';
import { CardDto } from '../models/card';
import { DetermineObject, DetermineWinnerObject } from '../models/determine';
import { PlayerDto } from '../models/player';
import { AbilityCard } from '../models/abilityCard';

interface suitValuesDto {
  hearts: number;
  diamonds: number;
  spades: number;
  clubs: number;
}

@Injectable({
  providedIn: 'root',
})
export class AbilityService {
  constructor() {}

  public checkCanUseAbility(ability: AbilityCard, array: CardDto[]): CardDto[] {
    let SuitsDetails = this.getSuitsDetails(array);

    let handValues: any = { diamonds: 0, spades: 0, clubs: 0, hearts: 0 };

    [...ability.cost].forEach((x: any) => {
      // Suits count are the values in hand

      // player would have 1 diamond for instance
      if (SuitsDetails[x] > 0) {
        handValues[x]++;
        SuitsDetails[x]--;
      }
    });
    const totalValidCards =
      handValues['hearts'] +
      handValues['diamonds'] +
      handValues['spades'] +
      handValues['clubs'];

    if ([...ability.cost].length === totalValidCards) {
      const foundCards: CardDto[] = [];
      const totalValidCardsArray = [...ability.cost];

      // Loop through cards array
      // Check what cards we still need

      [...array].forEach((x) => {
        const alreadyAdded = foundCards.find((a) => a.id === x.id);

        // ['hearts', 'spades']

        totalValidCardsArray.forEach((z, i) => {
          if (!alreadyAdded && z === x.suit) {
            foundCards.push(x);
            totalValidCardsArray.splice(i, 1);
          }
        });
      });

      return foundCards;
    }

    return [];
  }

  private getSuitsCount(array: CardDto[]) {
    const arrayValues: any[] = array.map((x) => x.suit);
    const detailedList = arrayValues.reduce((m, k) => {
      m[k] = m[k] + 1 || 1;
      return m;
    }, {});
    let valuesList: any[] = [];
    Object.values(detailedList).forEach(function (value) {
      valuesList.push(value);
    });
    return valuesList;
  }

  private getSuitsDetails(array: CardDto[]) {
    const arrayValues: any[] = array.map((x) => x.suit);
    const detailedList = arrayValues.reduce((m, k) => {
      m[k] = m[k] + 1 || 1;
      return m;
    }, {});
    return detailedList;
  }
}

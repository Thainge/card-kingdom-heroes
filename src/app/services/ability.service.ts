import { Injectable } from '@angular/core';
import { CardDto } from '../models/card';
import { AbilityCard } from '../models/abilityCard';

@Injectable({
  providedIn: 'root',
})
export class AbilityService {
  constructor() {}

  public checkCanUseAbility(ability: AbilityCard, array: CardDto[]): CardDto[] {
    let SuitsDetails = this.getSuitsDetails(array);

    let handValues: any = { diamonds: 0, spades: 0, clubs: 0, hearts: 0 };
    let foundValue = 0;

    [...ability.cost[ability.level]].forEach((x: any) => {
      // Suits count are the values in hand
      let keyIndex = x;

      if (foundValue !== [...ability.cost[ability.level]].length) {
        if (keyIndex === 'red') {
          // convert red to diamond or heart
          if (SuitsDetails['hearts'] > 0) {
            handValues['hearts']++;
            SuitsDetails['hearts']--;
            foundValue++;
          } else if (SuitsDetails['diamonds'] > 0) {
            handValues['diamonds']++;
            SuitsDetails['diamonds']--;
            foundValue++;
          }
        } else if (keyIndex === 'black') {
          // convert black to spade or club
          if (SuitsDetails['spades'] > 0) {
            handValues['spades']++;
            SuitsDetails['spades']--;
            foundValue++;
          } else if (SuitsDetails['clubs'] > 0) {
            handValues['clubs']++;
            SuitsDetails['clubs']--;
            foundValue++;
          }
        } else if (SuitsDetails[x] > 0) {
          handValues[x]++;
          SuitsDetails[x]--;
          foundValue++;
        }
      }
    });
    const totalValidCards =
      handValues['hearts'] +
      handValues['diamonds'] +
      handValues['spades'] +
      handValues['clubs'];

    if ([...ability.cost[ability.level]].length === totalValidCards) {
      const foundCards: CardDto[] = [];
      const totalValidCardsArray = [...ability.cost[ability.level]];

      // Loop through cards array
      // Check what cards we still need

      array.forEach((x) => {
        const alreadyAdded = foundCards.find((a) => a.id === x.id);
        let spliceIndex = -1;

        totalValidCardsArray.forEach((z, i) => {
          if (
            !alreadyAdded &&
            z === 'red' &&
            (x.suit === 'diamonds' || x.suit === 'hearts') &&
            spliceIndex === -1
          ) {
            // Add if red
            foundCards.push(x);
            spliceIndex = i;
          } else if (
            !alreadyAdded &&
            z === 'black' &&
            (x.suit === 'spades' || x.suit === 'clubs') &&
            spliceIndex === -1
          ) {
            // Add if black
            foundCards.push(x);
            spliceIndex = i;
          } else if (!alreadyAdded && z === x.suit && spliceIndex === -1) {
            // Else add if suit matches
            foundCards.push(x);
            spliceIndex = i;
          }
        });
        if (spliceIndex !== -1) {
          totalValidCardsArray.splice(spliceIndex, 1);
        }
      });

      return foundCards;
    }

    return [];
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

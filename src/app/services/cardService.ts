import { Injectable } from '@angular/core';
import { CardDto } from '../models/card';
import { HandDto } from '../models/hand';

interface DetermineObject {
  isTrue: boolean;
  highCard?: number;
}

interface BotDetermineObject {
  isTrue: boolean;
  cards: CardDto[];
}

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor() {}

  shuffle([...array]: any[]): any[] {
    let i = 0;
    let j = 0;
    let temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  determineHand(array: CardDto[]): HandDto {
    const isPair: DetermineObject = this.isPair(array);
    const isTwoPair: DetermineObject = this.isTwoPair(array);
    const isThreeOfAKind: DetermineObject = this.isThreeOfAKind(array);
    const isStraight: DetermineObject = this.isStraight(array);
    const isFlush: DetermineObject = this.isFlush(array);
    const isFullHouse: DetermineObject = this.isFullHouse(array);
    const isFourOfAKind: DetermineObject = this.isFourOfAKind(array);
    const isStraightFlush: DetermineObject = this.isStraightFlush(array);

    if (isStraightFlush.isTrue) {
      return {
        highCard: isStraightFlush.highCard,
        power: 5,
        valid: true,
      };
    } else if (isFourOfAKind.isTrue) {
      return {
        highCard: isFourOfAKind.highCard,
        power: 4,
        valid: true,
      };
    } else if (isFullHouse.isTrue) {
      return {
        highCard: isFullHouse.highCard,
        power: 5,
        valid: true,
      };
    } else if (isFlush.isTrue) {
      return {
        highCard: isFlush.highCard,
        power: 5,
        valid: true,
      };
    } else if (isStraight.isTrue) {
      return {
        highCard: isStraight.highCard,
        power: 5,
        valid: true,
      };
    } else if (isThreeOfAKind.isTrue) {
      return {
        highCard: isThreeOfAKind.highCard,
        power: 3,
        valid: true,
      };
    } else if (isTwoPair.isTrue) {
      return {
        highCard: isTwoPair.highCard,
        power: 4,
        valid: true,
      };
    } else if (isPair.isTrue) {
      return {
        highCard: isPair.highCard,
        power: 2,
        valid: true,
      };
    } else if (array.length === 1) {
      return {
        highCard: Number(array[0].value),
        power: 1,
        valid: true,
      };
    } else {
      return {
        valid: false,
      };
    }
  }

  isPair(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    if (array.length === 2 && valuesCount[0] === 2) {
      return {
        isTrue: true,
        highCard: Number(array[0].value),
      };
    }

    return {
      isTrue: false,
    };
  }

  isTwoPair(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    if (array.length === 4 && valuesCount[0] === 2 && valuesCount[1] === 2) {
      return {
        isTrue: true,
        highCard: Number(array[0].value),
      };
    }

    return {
      isTrue: false,
    };
  }

  isThreeOfAKind(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    if (array.length === 3 && valuesCount.includes(3)) {
      return {
        isTrue: true,
        highCard: Number(array[0].value),
      };
    }

    return {
      isTrue: false,
    };
  }

  isStraight(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesDetails(array);
    let keyArr: number[] = [];

    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (
      array.length === 5 &&
      keyArr[0] + 1 === keyArr[1] &&
      keyArr[1] + 1 === keyArr[2] &&
      keyArr[2] + 1 === keyArr[3] &&
      keyArr[3] + 1 === keyArr[4]
    ) {
      return {
        isTrue: true,
        highCard: keyArr[4],
      };
    }

    return {
      isTrue: false,
    };
  }

  isFlush(array: CardDto[]): DetermineObject {
    const suitsCount = this.getSuitsCount(array);
    const valuesCount = this.getValuesDetails(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (array.length === 5 && suitsCount.includes(5)) {
      return {
        isTrue: true,
        highCard: keyArr[4],
      };
    }

    return {
      isTrue: false,
    };
  }

  isFullHouse(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (
      array.length === 5 &&
      valuesCount.includes(3) &&
      valuesCount.includes(2)
    ) {
      return {
        isTrue: true,
        highCard: keyArr[4],
      };
    }

    return {
      isTrue: false,
    };
  }

  isFourOfAKind(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (array.length === 4 && valuesCount.includes(4)) {
      return {
        isTrue: true,
        highCard: keyArr[3],
      };
    }

    return {
      isTrue: false,
    };
  }

  isStraightFlush(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (
      array.length === 5 &&
      this.isStraight(array).isTrue &&
      this.isFlush(array).isTrue
    ) {
      return {
        isTrue: true,
        highCard: keyArr[4],
      };
    }

    return {
      isTrue: false,
    };
  }

  getValuesCount(array: CardDto[]) {
    const arrayValues: any[] = array.map((x) => x.value);
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

  getValuesDetails(array: CardDto[]) {
    const arrayValues: any[] = array.map((x) => x.value);
    const detailedList = arrayValues.reduce((m, k) => {
      m[k] = m[k] + 1 || 1;
      return m;
    }, {});
    return detailedList;
  }

  getSuitsCount(array: CardDto[]) {
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

  generateBotDefenseHand(array: CardDto[], defenseLength: number): CardDto[] {
    const pairInfo = this.botHandIncludesPair(array);
    const threeOfAKindInfo = this.botHandIncludesThreeOfAKind(array);
    const twoPair = this.botHandIncludesTwoPair(array);
    const fourOfAKindInfo = this.botHandIncludesFourOfAKind(array);
    const flushInfo = this.botHandIncludesFlush(array);
    const straightInfo = this.botHandIncludesStraight(array);
    const fullHouseInfo = this.botHandIncludesFullHouse(array);
    const royalFlushInfo = this.botHandIncludesRoyalFlush(array);

    // If attacking hand length is 5, look for royal flush
    if (defenseLength === 5 && royalFlushInfo.isTrue) {
      // Check hand for pair
      return royalFlushInfo.cards;
    }

    // If attacking hand length is 5, look for full house
    if (defenseLength === 5 && fullHouseInfo.isTrue) {
      // Check hand for pair
      return fullHouseInfo.cards;
    }

    // If attacking hand length is 5, look for straight
    if (defenseLength === 5 && straightInfo.isTrue) {
      // Check hand for pair
      return straightInfo.cards;
    }

    // If attacking hand length is 5, look for flush
    if (defenseLength === 5 && flushInfo.isTrue) {
      // Check hand for pair
      return flushInfo.cards;
    }

    // If attacking hand length is 4, look for four of a kind
    if (defenseLength === 4 && fourOfAKindInfo.isTrue) {
      // Check hand for pair
      return fourOfAKindInfo.cards;
    }

    // If attacking hand length is 4, look for 2 pair
    if (defenseLength === 4 && twoPair.isTrue) {
      // Check hand for pair
      return twoPair.cards;
    }

    // If attacking hand length is 3, look for 3 of a kind
    if (defenseLength === 3 && threeOfAKindInfo.isTrue) {
      // Check hand for pair
      return threeOfAKindInfo.cards;
    }

    // If attacking hand length is 2, look for 2 pair
    if (defenseLength === 2 && pairInfo.isTrue) {
      // Check hand for pair
      return pairInfo.cards;
    }

    // If attacking hand length is 1, use high card
    if (defenseLength === 1) {
      const maxCard = array.reduce(function (prev, current) {
        return prev && Number(prev.value) > Number(current.value)
          ? prev
          : current;
      });
      return [maxCard];
    }

    return [];
  }

  botHandIncludesPair(array: CardDto[]): BotDetermineObject {
    const valuesCount = this.getValuesCount(array);
    const includesPair =
      valuesCount.includes(2) ||
      valuesCount.includes(3) ||
      valuesCount.includes(4);

    if (includesPair) {
      var result: any = Object.values(
        array.reduce((c: any, v: any) => {
          let k = v.value;
          c[k] = c[k] || [];
          c[k].push(v);
          return c;
        }, {})
      ).reduce((c: any, v: any) => (v.length > 1 ? c.concat(v) : c), []);

      return {
        isTrue: true,
        cards: [result[0], result[1]],
      };
    }

    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesThreeOfAKind(array: CardDto[]): BotDetermineObject {
    const valuesCount = this.getValuesCount(array);
    const includesThree = valuesCount.includes(3) || valuesCount.includes(4);

    if (includesThree) {
      var result: any = Object.values(
        array.reduce((c: any, v: any) => {
          let k = v.value;
          c[k] = c[k] || [];
          c[k].push(v);
          return c;
        }, {})
      ).reduce((c: any, v: any) => (v.length > 1 ? c.concat(v) : c), []);

      return {
        isTrue: true,
        cards: [result[0], result[1], result[2]],
      };
    }

    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesTwoPair(array: CardDto[]): BotDetermineObject {
    const valuesCount = this.getValuesCount(array);
    let pairsFound = 0;
    valuesCount.forEach((x) => {
      if (x === 2) {
        pairsFound++;
      }
    });

    if (pairsFound === 2) {
      var result: any = Object.values(
        array.reduce((c: any, v: any) => {
          let k = v.value;
          c[k] = c[k] || [];
          c[k].push(v);
          return c;
        }, {})
      ).reduce((c: any, v: any) => (v.length > 1 ? c.concat(v) : c), []);

      return {
        isTrue: true,
        cards: [result[0], result[1], result[2], result[3]],
      };
    }

    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesFourOfAKind(array: CardDto[]): BotDetermineObject {
    const valuesCount = this.getValuesCount(array);
    const includesFour = valuesCount.includes(4);

    if (includesFour) {
      var result: any = Object.values(
        array.reduce((c: any, v: any) => {
          let k = v.value;
          c[k] = c[k] || [];
          c[k].push(v);
          return c;
        }, {})
      ).reduce((c: any, v: any) => (v.length > 1 ? c.concat(v) : c), []);

      return {
        isTrue: true,
        cards: [result[0], result[1], result[2], result[3]],
      };
    }

    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesFlush(array: CardDto[]): BotDetermineObject {
    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesStraight(array: CardDto[]): BotDetermineObject {
    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesFullHouse(array: CardDto[]): BotDetermineObject {
    return {
      isTrue: false,
      cards: [],
    };
  }

  botHandIncludesRoyalFlush(array: CardDto[]): BotDetermineObject {
    return {
      isTrue: false,
      cards: [],
    };
  }
}

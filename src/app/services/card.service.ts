import { Injectable } from '@angular/core';
import { CardDto } from '../models/card';
import { DetermineObject, DetermineWinnerObject } from '../models/determine';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor() {}

  public shuffle([...array]: any[]): any[] {
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

  public determineHand(array: CardDto[]): DetermineObject {
    const isPair: DetermineObject = this.isPair(array);
    const isTwoPair: DetermineObject = this.isTwoPair(array);
    const isThreeOfAKind: DetermineObject = this.isThreeOfAKind(array);
    const isStraight: DetermineObject = this.isStraight(array);
    const isFlush: DetermineObject = this.isFlush(array);
    const isFullHouse: DetermineObject = this.isFullHouse(array);
    const isFourOfAKind: DetermineObject = this.isFourOfAKind(array);
    const isFiveOfAKind: DetermineObject = this.isFiveOfAKind(array);
    const isStraightFlush: DetermineObject = this.isStraightFlush(array);

    if (isStraightFlush.valid) {
      return {
        name: 'Straight Flush',
        valid: true,
        power: 5,
        ranking: 10,
        highCard: isStraightFlush.highCard,
        cards: isStraightFlush.cards,
      };
    } else if (isFiveOfAKind.valid) {
      return {
        name: 'Five of a Kind',
        valid: true,
        power: 5,
        ranking: 9,
        highCard: isFiveOfAKind.highCard,
        cards: isFiveOfAKind.cards,
      };
    } else if (isFourOfAKind.valid) {
      return {
        name: 'Four of a Kind',
        valid: true,
        power: 4,
        ranking: 8,
        highCard: isFourOfAKind.highCard,
        cards: isFourOfAKind.cards,
      };
    } else if (isFullHouse.valid) {
      return {
        name: 'Full House',
        valid: true,
        power: 5,
        ranking: 7,
        highCard: isFullHouse.highCard,
        cards: isFullHouse.cards,
      };
    } else if (isFlush.valid) {
      return {
        name: 'Flush',
        valid: true,
        power: 5,
        ranking: 6,
        highCard: isFlush.highCard,
        cards: isFlush.cards,
      };
    } else if (isStraight.valid) {
      return {
        name: 'Straight',
        valid: true,
        power: 5,
        ranking: 5,
        highCard: isStraight.highCard,
        cards: isStraight.cards,
      };
    } else if (isThreeOfAKind.valid) {
      return {
        name: 'Three of a Kind',
        valid: true,
        power: 3,
        ranking: 4,
        highCard: isThreeOfAKind.highCard,
        cards: isThreeOfAKind.cards,
      };
    } else if (isTwoPair.valid) {
      return {
        name: 'Two Pair',
        valid: true,
        power: 4,
        ranking: 3,
        highCard: isTwoPair.highCard,
        cards: isTwoPair.cards,
      };
    } else if (isPair.valid) {
      return {
        name: 'Two of a Kind',
        valid: true,
        power: 2,
        ranking: 2,
        highCard: isPair.highCard,
        cards: isPair.cards,
      };
    } else if (array.length === 1) {
      return {
        name: 'High Card',
        valid: true,
        power: 1,
        ranking: 1,
        highCard: Number(array[0].value),
        cards: [array[0]],
      };
    }

    return {
      valid: false,
      name: 'High Card',
      highCard: 0,
      power: 1,
      ranking: 1,
      cards: [],
    };
  }

  private isPair(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    if (array.length === 2 && valuesCount[0] === 2) {
      return {
        valid: true,
        highCard: Number(array[0].value),
        cards: array,
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isTwoPair(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    if (array.length === 4 && valuesCount[0] === 2 && valuesCount[1] === 2) {
      return {
        valid: true,
        highCard: Number(array[0].value),
        cards: array,
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isThreeOfAKind(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    if (array.length === 3 && valuesCount.includes(3)) {
      return {
        valid: true,
        highCard: Number(array[0].value),
        cards: array,
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isStraight(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: array,
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isFlush(array: CardDto[]): DetermineObject {
    const suitsCount = this.getSuitsCount(array);
    const valuesCount = this.getValuesDetails(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (array.length === 5 && suitsCount.includes(5)) {
      return {
        valid: true,
        cards: array,
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isFullHouse(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: array,
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isFourOfAKind(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (array.length === 4 && valuesCount.includes(4)) {
      return {
        valid: true,
        cards: array,
        highCard: Number(array[0].value),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isFiveOfAKind(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (array.length === 5 && valuesCount.includes(5)) {
      return {
        valid: true,
        cards: array,
        highCard: Number(array[0].value),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private isStraightFlush(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (
      array.length === 5 &&
      this.isStraight(array).valid &&
      this.isFlush(array).valid
    ) {
      return {
        valid: true,
        cards: array,
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private getValuesCount(array: CardDto[]) {
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

  private getValuesDetails(array: CardDto[]) {
    const arrayValues: any[] = array.map((x) => x.value);
    const detailedList = arrayValues.reduce((m, k) => {
      m[k] = m[k] + 1 || 1;
      return m;
    }, {});
    return detailedList;
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

  public generateBotDefenseHand(
    array: CardDto[],
    defenseLength: number
  ): DetermineObject {
    const pairInfo = this.botHandIncludesPair(array);
    const twoPair = this.botHandIncludesTwoPair(array);
    const threeOfAKindInfo = this.botHandIncludesThreeOfAKind(array);
    const straightInfo = this.botHandIncludesStraight(array);
    const flushInfo = this.botHandIncludesFlush(array);
    const fullHouseInfo = this.botHandIncludesFullHouse(array);
    const fourOfAKindInfo = this.botHandIncludesFourOfAKind(array);
    const straightFlushInfo = this.botHandIncludesStraightFlush(array);

    if (defenseLength === 5 && straightFlushInfo.valid) {
      return {
        name: 'Straight Flush',
        valid: true,
        power: 5,
        ranking: 9,
        highCard: straightFlushInfo.highCard,
        cards: straightFlushInfo.cards,
      };
    } else if (defenseLength === 4 && fourOfAKindInfo.valid) {
      return {
        name: 'Four of a Kind',
        valid: true,
        power: 4,
        ranking: 8,
        highCard: fourOfAKindInfo.highCard,
        cards: fourOfAKindInfo.cards,
      };
    } else if (defenseLength === 5 && fullHouseInfo.valid) {
      return {
        name: 'Full House',
        valid: true,
        power: 5,
        ranking: 7,
        highCard: fullHouseInfo.highCard,
        cards: fullHouseInfo.cards,
      };
    } else if (defenseLength === 5 && flushInfo.valid) {
      return {
        name: 'Flush',
        valid: true,
        power: 5,
        ranking: 6,
        highCard: flushInfo.highCard,
        cards: flushInfo.cards,
      };
    } else if (defenseLength === 5 && straightInfo.valid) {
      return {
        name: 'Straight',
        valid: true,
        power: 5,
        ranking: 5,
        highCard: straightInfo.highCard,
        cards: straightInfo.cards,
      };
    } else if (defenseLength === 3 && threeOfAKindInfo.valid) {
      return {
        name: 'Three of a Kind',
        valid: true,
        power: 3,
        ranking: 4,
        highCard: threeOfAKindInfo.highCard,
        cards: threeOfAKindInfo.cards,
      };
    } else if (defenseLength === 4 && twoPair.valid) {
      return {
        name: 'Two Pair',
        valid: true,
        power: 4,
        ranking: 3,
        highCard: twoPair.highCard,
        cards: twoPair.cards,
      };
    } else if (defenseLength === 2 && pairInfo.valid) {
      return {
        name: 'Two of a Kind',
        valid: true,
        power: 2,
        ranking: 2,
        highCard: pairInfo.highCard,
        cards: pairInfo.cards,
      };
    } else if (defenseLength === 1) {
      const maxCard: CardDto = array.reduce(function (prev, current) {
        return prev && Number(prev.value) > Number(current.value)
          ? prev
          : current;
      });
      return {
        name: 'High Card',
        valid: true,
        power: 1,
        ranking: 1,
        highCard: Number(maxCard.value),
        cards: [maxCard],
      };
    }

    // Generate array of cards that fill since no match

    let defenseCards: CardDto[] = [];
    array.forEach((x, i) => {
      if (i < defenseLength) {
        defenseCards.push(x);
      }
    });

    return {
      valid: false,
      power: 0,
      ranking: 0,
      name: 'High Card',
      highCard: Number(
        [...defenseCards].reduce(function (prev, current) {
          return prev && Number(prev.value) > Number(current.value)
            ? prev
            : current;
        }).value
      ),
      cards: [...defenseCards],
    };
  }

  public generateBotOffenseHand(array: CardDto[]): DetermineObject {
    const pairInfo = this.botHandIncludesPair(array);
    const twoPair = this.botHandIncludesTwoPair(array);
    const threeOfAKindInfo = this.botHandIncludesThreeOfAKind(array);
    const straightInfo = this.botHandIncludesStraight(array);
    const flushInfo = this.botHandIncludesFlush(array);
    const fullHouseInfo = this.botHandIncludesFullHouse(array);
    const fourOfAKindInfo = this.botHandIncludesFourOfAKind(array);
    const fiveOfAKindInfo = this.botHandIncludesFiveOfAKind(array);
    const straightFlushInfo = this.botHandIncludesStraightFlush(array);

    if (straightFlushInfo.valid) {
      return {
        name: 'Straight Flush',
        valid: true,
        power: 5,
        ranking: 10,
        highCard: straightFlushInfo.highCard,
        cards: straightFlushInfo.cards,
      };
    } else if (fiveOfAKindInfo.valid) {
      return {
        name: 'Five of a Kind',
        valid: true,
        power: 5,
        ranking: 9,
        highCard: fiveOfAKindInfo.highCard,
        cards: fiveOfAKindInfo.cards,
      };
    } else if (fourOfAKindInfo.valid) {
      return {
        name: 'Four of a Kind',
        valid: true,
        power: 4,
        ranking: 8,
        highCard: fourOfAKindInfo.highCard,
        cards: fourOfAKindInfo.cards,
      };
    } else if (fullHouseInfo.valid) {
      return {
        name: 'Full House',
        valid: true,
        power: 5,
        ranking: 7,
        highCard: fullHouseInfo.highCard,
        cards: fullHouseInfo.cards,
      };
    } else if (flushInfo.valid) {
      return {
        name: 'Flush',
        valid: true,
        power: 5,
        ranking: 6,
        highCard: flushInfo.highCard,
        cards: flushInfo.cards,
      };
    } else if (straightInfo.valid) {
      return {
        name: 'Straight',
        valid: true,
        power: 5,
        ranking: 5,
        highCard: straightInfo.highCard,
        cards: straightInfo.cards,
      };
    } else if (threeOfAKindInfo.valid) {
      return {
        name: 'Three of a Kind',
        valid: true,
        power: 3,
        ranking: 4,
        highCard: threeOfAKindInfo.highCard,
        cards: threeOfAKindInfo.cards,
      };
    } else if (twoPair.valid) {
      return {
        name: 'Two Pair',
        valid: true,
        power: 4,
        ranking: 3,
        highCard: twoPair.highCard,
        cards: twoPair.cards,
      };
    } else if (pairInfo.valid) {
      return {
        name: 'Two of a Kind',
        valid: true,
        power: 2,
        ranking: 2,
        highCard: pairInfo.highCard,
        cards: pairInfo.cards,
      };
    }

    // Generate array of cards that fill since no match

    const maxCard: CardDto = array.reduce(function (prev, current) {
      return prev && Number(prev.value) > Number(current.value)
        ? prev
        : current;
    });
    return {
      name: 'High Card',
      valid: true,
      power: 1,
      ranking: 1,
      highCard: Number(maxCard.value),
      cards: [maxCard],
    };
  }

  private botHandIncludesPair(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: [result[0], result[1]],
        highCard: Number(result[0].value),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesThreeOfAKind(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: [result[0], result[1], result[2]],
        highCard: Number(result[0].value),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesTwoPair(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: [result[0], result[1], result[2], result[3]],
        highCard: Number(
          [result[0], result[1], result[2], result[3]].reduce(function (
            prev,
            current
          ) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesFourOfAKind(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: [result[0], result[1], result[2], result[3]],
        highCard: Number(result[0].value),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesFiveOfAKind(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);
    const includesFive = valuesCount.includes(5);

    if (includesFive) {
      var result: any = Object.values(
        array.reduce((c: any, v: any) => {
          let k = v.value;
          c[k] = c[k] || [];
          c[k].push(v);
          return c;
        }, {})
      ).reduce((c: any, v: any) => (v.length > 1 ? c.concat(v) : c), []);

      return {
        valid: true,
        cards: array,
        highCard: Number(result[0].value),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesFlush(array: CardDto[]): DetermineObject {
    const suitsCount = this.getSuitsCount(array);

    if (array.length === 5 && suitsCount.includes(5)) {
      return {
        valid: true,
        cards: [...array],
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesStraight(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: array.sort((x, a) => Number(x.value) - Number(a.value)),
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesFullHouse(array: CardDto[]): DetermineObject {
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
        valid: true,
        cards: array.sort((x, a) => Number(x.value) - Number(a.value)),
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  private botHandIncludesStraightFlush(array: CardDto[]): DetermineObject {
    const valuesCount = this.getValuesCount(array);

    let keyArr: number[] = [];
    Object.keys(valuesCount).forEach(function (key) {
      keyArr.push(Number(key));
    });

    if (
      array.length === 5 &&
      this.botHandIncludesStraight(array).valid &&
      this.botHandIncludesFlush(array).valid
    ) {
      return {
        valid: true,
        cards: array.sort((x, a) => Number(x.value) - Number(a.value)),
        highCard: Number(
          array.reduce(function (prev, current) {
            return prev && Number(prev.value) > Number(current.value)
              ? prev
              : current;
          }).value
        ),
      };
    }

    return {
      valid: false,
      cards: [],
      highCard: 0,
    };
  }

  public determineWinner(
    player1: DetermineObject,
    player2: DetermineObject
  ): DetermineWinnerObject {
    const player1Ranking = player1.ranking!;
    const player2Ranking = player2.ranking!;
    const player1HighCard = player1.highCard!;
    const player2HighCard = player2.highCard!;

    // Tie occured
    if (
      player1Ranking === player2Ranking &&
      player1HighCard === player2HighCard
    ) {
      return {
        tie: true,
        player1Winner: false,
        player1Determine: player1,
        player2Winner: false,
        player2Determine: player2,
      };
    }

    // Same ranking but player 1 high card wins
    if (
      player1Ranking === player2Ranking &&
      player1HighCard > player2HighCard
    ) {
      return {
        tie: false,
        player1Winner: true,
        player1Determine: player1,
        player2Winner: false,
        player2Determine: player2,
      };
    }

    // Same ranking but player 2 high card wins
    if (
      player1Ranking === player2Ranking &&
      player2HighCard > player1HighCard
    ) {
      return {
        tie: false,
        player1Winner: false,
        player1Determine: player1,
        player2Winner: true,
        player2Determine: player2,
      };
    }

    // Player 1 high ranking wins
    if (player1Ranking > player2Ranking) {
      return {
        tie: false,
        player1Winner: true,
        player1Determine: player1,
        player2Winner: false,
        player2Determine: player2,
      };
    }

    // Player 2 high ranking wins
    if (player2Ranking > player1Ranking) {
      return {
        tie: false,
        player1Winner: false,
        player1Determine: player1,
        player2Winner: true,
        player2Determine: player2,
      };
    }

    return {
      tie: true,
      player1Winner: false,
      player1Determine: player1,
      player2Winner: false,
      player2Determine: player2,
    };
  }
}

import { Comic } from 'src/app/models/level';

export const ComicData: Comic[] = [
  {
    id: 1,
    display: false,
    comics: [
      {
        id: 1,
        display: false,
        image: 'comic1.png',
        blackList: [
          { id: 1, height: 200, width: 200, x: 0, y: 0, displayed: false },
          { id: 2, height: 200, width: 200, x: 200, y: 200, displayed: false },
        ],
      },
    ],
  },
  {
    id: 2,
    display: false,
    comics: [
      {
        id: 1,
        display: false,
        image: 'comic1.png',
        blackList: [
          { id: 1, height: 200, width: 200, x: 0, y: 0, displayed: false },
          { id: 2, height: 200, width: 200, x: 200, y: 200, displayed: false },
        ],
      },
    ],
  },
];

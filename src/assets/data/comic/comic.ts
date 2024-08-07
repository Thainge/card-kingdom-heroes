import { Comic } from 'src/app/models/level';

export const ComicData: Comic[] = [
  {
    id: 1,
    display: false,
    comics: [
      {
        id: 1,
        display: false,
        image: 'cardkingdom1.png',
        blackList: [
          { id: 1, height: 355, width: 600, left: 0, top: 0, display: true },
          {
            id: 2,
            height: 357,
            width: 250,
            left: 606,
            top: 0,
            display: true,
          },
          {
            id: 3,
            height: 110,
            width: 260,
            left: 860,
            top: 0,
            display: true,
          },
          {
            id: 4,
            height: 233,
            width: 260,
            left: 860,
            top: 120,
            display: true,
          },
          {
            id: 5,
            height: 170,
            width: 1160,
            left: 0,
            top: 357,
            display: true,
          },
          {
            id: 6,
            height: 330,
            width: 1160,
            left: 0,
            top: 536,
            display: true,
          },
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
        image: 'cardkingdom2.png',
        blackList: [
          { id: 1, height: 418, width: 645, left: 0, top: 0, display: true },
          {
            id: 2,
            height: 418,
            width: 445,
            left: 665,
            top: 0,
            display: true,
          },
          {
            id: 3,
            height: 460,
            width: 1150,
            left: 0,
            top: 430,
            display: true,
          },
        ],
      },
    ],
  },
];

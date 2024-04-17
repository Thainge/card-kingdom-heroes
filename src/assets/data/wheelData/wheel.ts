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

export const WheelData: WheelItem[] = [
  {
    value: 1,
    image: './assets/wheelImages/gold3.png',
    imageScale: 0.3,
    backgroundColor: '#ffd700',
    weight: 0.5,
    rewardImage: 'goldReward.png',
    text: 'Gems',
    rewardType: 'gold',
    textAmount: '999x',
    goldAmount: 999,
  },
  {
    value: 2,
    image: './assets/wheelImages/booster1.png',
    imageScale: 0.15,
    weight: 0.75,
    rewardImage: 'boosterPackGreen.png',
    text: 'Green Booster Pack',
    rewardType: 'booster',
    boosterPackId: 1,
    textAmount: '1x',
    goldAmount: 1,
  },
  {
    value: 3,
    image: './assets/wheelImages/gold2.png',
    imageScale: 0.5,
    weight: 1,
    rewardImage: 'goldReward.png',
    text: 'Gems',
    rewardType: 'gold',
    textAmount: '150x',
    goldAmount: 150,
  },
  {
    value: 4,
    image: './assets/wheelImages/booster2.png',
    imageScale: 0.15,
    weight: 0.75,
    rewardImage: 'boosterPackBlue.png',
    text: 'Blue Booster Pack',
    rewardType: 'booster',
    boosterPackId: 2,
    textAmount: '1x',
    goldAmount: 1,
  },
  {
    value: 5,
    image: './assets/wheelImages/gold1.png',
    imageScale: 0.5,
    weight: 1,
    rewardImage: 'goldReward.png',
    text: 'Gems',
    rewardType: 'gold',
    textAmount: '150x',
    goldAmount: 150,
  },
  {
    value: 6,
    image: './assets/wheelImages/booster1.png',
    imageScale: 0.15,
    weight: 0.75,
    rewardImage: 'boosterPackYellow.png',
    text: 'Yellow Booster Pack',
    rewardType: 'booster',
    boosterPackId: 3,
    textAmount: '1x',
    goldAmount: 1,
  },
  {
    value: 7,
    image: './assets/wheelImages/gold2.png',
    imageScale: 0.5,
    weight: 1,
    rewardImage: 'goldReward.png',
    text: 'Gems',
    rewardType: 'gold',
    textAmount: '150x',
    goldAmount: 150,
  },
  {
    value: 8,
    image: './assets/wheelImages/booster2.png',
    imageScale: 0.15,
    weight: 0.75,
    rewardImage: 'boosterPackRed.png',
    text: 'Red Booster Pack',
    rewardType: 'booster',
    boosterPackId: 4,
    textAmount: '1x',
    goldAmount: 1,
  },

  {
    value: 9,
    image: './assets/wheelImages/gold1.png',
    imageScale: 0.5,
    weight: 1,
    rewardImage: 'goldReward.png',
    text: 'Gems',
    rewardType: 'gold',
    textAmount: '150x',
    goldAmount: 150,
  },
  {
    value: 10,
    image: './assets/wheelImages/booster1.png',
    imageScale: 0.15,
    weight: 0.75,
    rewardImage: 'boosterPackGreen.png',
    text: 'Green Booster Pack',
    rewardType: 'booster',
    boosterPackId: 1,
    textAmount: '1x',
    goldAmount: 1,
  },
];

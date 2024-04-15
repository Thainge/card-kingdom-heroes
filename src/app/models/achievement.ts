export interface AchievementObject {
  id: number;
  worldId: number;
  title: string;
  description: string;
  image: string;
  unlocked: boolean;
  gemsUnlocked: boolean;
  reward: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  isMe?: boolean;
}

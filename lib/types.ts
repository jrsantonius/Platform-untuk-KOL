export interface TweetImage {
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export interface GeneratedTweet {
  id: number;
  content: string;
  type: string;
  estimatedEngagement: string;
  imageQuery?: string;
  images?: TweetImage[];
  isThread?: boolean;
  threadParts?: string[];
}

export interface DailyContent {
  accountId: string;
  date: string;
  generatedAt: string;
  tweets: GeneratedTweet[];
}

export interface CustomAccount {
  id: string;
  username: string;
  displayName: string;
  niche: string;
  color: string;
  bgColor: string;
  emoji: string;
  description: string;
  isCustom: true;
}

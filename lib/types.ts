export interface XPost {
  content: string;
  author: string;
  timestamp?: string;
  engagement?: {
    likes?: number;
    retweets?: number;
  };
}

export interface UserAnalysis {
  username: string;
  mainTopics: string[];
  personalityTraits: string[];
  communicationStyle: string;
  keyInterests: string[];
  posts: XPost[];
}

export interface GenerateLetterRequest {
  username: string;
  analysis?: UserAnalysis;
}

export interface GenerateLetterResponse {
  letter: string;
  username: string;
  error?: string;
}

export interface SearchPostsResponse {
  posts: XPost[];
  analysis: UserAnalysis;
  error?: string;
}


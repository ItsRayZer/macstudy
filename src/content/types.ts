export interface Question {
  q: string;
  tags: string[];
  tagBase: "SURE MARK" | "REPEATED" | "IMPORTANT";
  years: string | null;
  a: string[];
}

export interface Topic {
  title: string;
  points: string[];
  questions: Question[];
}

export interface Module {
  num: string;
  title: string;
  examPattern: string | null;
  topics: Topic[];
}

export interface Subject {
  short: string;
  name: string;
  exam: string;
  examPattern: string | null;
  modules: Module[];
}

export interface VideoSlot {
  subject: string;
  module: string;
  topicHint: string;
  /** Exact topic title match. When set, the slot binds only to this topic. */
  topicTitle?: string | null;
  youtubeId: null;
  /** Drop-in video for the Learn phase. Null = "Video coming soon". */
  videoUrl: string | null;
  /** 'youtube' renders a tap-to-watch card (embeds get blocked by owners); 'notebooklm' renders a tap-to-watch link-out (no embed code exists). */
  videoSource: "youtube" | "notebooklm" | null;
  /** Display duration like "12:03". Null = unknown / coming soon. */
  duration: string | null;
}

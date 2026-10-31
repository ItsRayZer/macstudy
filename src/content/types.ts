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
  youtubeId: null;
}

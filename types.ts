export interface Email {
  id: string;
  type: 'phishing' | 'legitimate';
  sender_name: string;
  sender_email: string;
  subject: string;
  body: string;
  analysis_key: {
    [key: string]: string;
  };
}

export interface Analysis {
  verdict: 'phishing' | 'legitimate' | 'unsure';
  senderAnalysis: string;
  subjectAnalysis: string;
  linksAnalysis: string;
  grammarAnalysis: string;
  overallReasoning: string;
}

export interface Feedback {
  whatYouGotRight: string[];
  whatYouMissed: string[];
  expertAnalysis: string;
  keyTakeaways: string[];
}

export type ApiProvider = 'gemini' | 'openai' | 'openrouter' | 'claude' | 'xai';

export interface ApiSettings {
  provider: ApiProvider;
  apiKey: string;
  modelName: string;
}

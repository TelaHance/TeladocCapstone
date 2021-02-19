export type UserData = {
  user_id: string;
  given_name: string;
  family_name: string;
  phone: number;
  picture?: string;
};

export type AppointmentData = {
  consult_id: string;
  doctor: UserData;
  patient: UserData;
  start_time: number;
  end_time: number;
};

export type SentimentData = {
  [key: string]: number;
};

export type MedicalConditionData = {
  common_name: string;
  id: string;
  name: string;
  probability: number;
};

export type SymptomData = {
  choice_id: string;
  common_name: string;
  id: string;
  name: string;
  type: string;
};

export type MessageData = {
  type: 'message';
  children: WordData[];
  start: number;
  speaker: string;
  sentiment: number;
  fullText: string;
};

export type WordData = {
  start: number;
  end: number;
  text: string;
  confidence: number;
  splitIdx?: number;
};

export type TranscriptData = MessageData[];

export type ConsultData = AppointmentData & {
  call_sid: string;
  sentiment?: SentimentData;
  transcript: TranscriptData;
  medical_conditions: MedicalConditionData[];
  question: string;
  symptoms: SymptomData[];
  transcript_edited?: TranscriptData;
};

export type SymptomData = {
  id: string;
  name: string;
  common_name: string;
  sex_filter: string;
  category: string;
  seriousness: string;
  extras: {
    [key: string]: any;
  };
  children: {
    id: string;
    parent_relation: string;
  }[];
  image_url: string | null;
  image_source: string | null;
  parent_id: string | null;
  parent_relation: string | null;
};

export type ConditionData = {
  id: string;
  name: string;
  common_name: string;
  sex_filter: string;
  categories: string[];
  prevalence: string;
  acuteness: string;
  severity: string;
  extras: {
    icd10_code: string;
    hint: string;
  };
  triage_level: string;
  recommended_channel: string;
};

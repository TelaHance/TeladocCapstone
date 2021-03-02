/**
 *  AUTH0 API DATA
 */
export type UserData = {
  user_id: string;
  given_name: string;
  family_name: string;
  phone: number;
  picture?: string;
};

/**
 *  PERSPECTIVE API DATA
 */

export type SentimentData = {
  [key: string]: number;
};

/**
 *  INFERMEDICA API DATA
 */

export type ConditionData = {
  common_name: string;
  id: string;
  name: string;
  probability: number;
};

export type ConditionListData = {
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

export type SymptomData = {
  choice_id: string;
  common_name: string;
  id: string;
  name: string;
  type: string;
};

export type SymptomListData = {
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

/**
 *  DYNAMODB DATA STRUCTURES /
 *  USER-DEFINED TYPES
 */

export type ConsultKeyData = {
  consult_id: string;
  start_time: number;
};

export type AppointmentData = ConsultKeyData & {
  doctor: UserData;
  patient: UserData;
  end_time: number;
};

export type ConsultData = AppointmentData &
  InfermedicaData & {
    call_sid: string;
    sentiment?: SentimentData;
    transcript: TranscriptData;
    transcript_edited?: TranscriptData;
    purpose: string;
  };

export type LiveConsultData = ConsultKeyData & Partial<InfermedicaData>;

export type InfermedicaData = {
  medical_conditions: MedicalConditionData[];
  question: string;
  symptoms: SymptomData[];
};

export type TranscriptData = MessageData[];

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

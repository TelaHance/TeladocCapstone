// Types stored in DynamoDB

type Word = {
  start: number;
  end: number;
  text: string;
  confidence: number;
  splitIdx?: number;
}

type Message = {
  type: 'message';
  children: Word[];
  start: number;
  speaker: string;
  sentiment: number;
  fullText: string;
}

type Transcript = Message[];

type UserData = {
  given_name: string;
  family_name: string;
  user_id: string;
}

type Consult = {
  consult_id: string;
  doctor: UserData;
  patient: UserData;
  sentiment: number;
  timestamp: number;
  transcript: Transcript;
  'transcript-edited'?: Transcript;
}
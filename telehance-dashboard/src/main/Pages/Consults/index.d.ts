// Types stored in DynamoDB

type Word = {
  start: number;
  end: number;
  text: string;
  confidence: number;
  splitIdx?: number;
}

type Message = {
  speaker: string;
  start: number;
  type: 'message';
  children: Word[];
}

type Transcript = Message[];

type UserData = {
  given_name: string;
  user_id: string;
  family_name: string;
}

type Consult = {
  consult_id: string;
  patient: UserData;
  doctor: UserData;
  transcript: Transcript;
  sentiment: number;
  timestamp: number;
}
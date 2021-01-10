type BlockItem = {
  end_time: number;
  start_time: number;
  content: string;
}

type TranscriptBlock = {
  items: BlockItem[];
  speaker: string;
}

type Transcript = {
  blocks: TranscriptBlock[];
  text: string;
}

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
// AWS Transcribe Types

type AWS_Alternative = {
  content: string;
  confidence: string;
}

type AWS_Item = {
  start_time: string;
  end_time: string;
  alternatives: AWS_Alternative[]
  type: 'pronunciation' | 'punctuation';
}

type AWS_Channel = {
  channel_label: string;
  items: Item[];
}

type AWS_ChannelLabels = {
  channels: AWS_Channel[];
  number_of_channels: number;
}

type AWS_Results = {
  channel_labels: AWS_ChannelLabels;
  items: AWS_Item[];
  transcripts: [
    {
      transcript: string;
    }
  ]
}

type AWS_Transcript = {
  accountId: string;
  jobName: string;
  results: AWS_Results;
  status: string;
}

// Types stored in DynamoDB

type UserData = {
  given_name: string;
  user_id: string;
  family_name: string;
}

type Consult = {
  consult_id: string;
  patient: UserData;
  doctor: UserData;
  transcript: AWS_Transcript;
  sentiment: number;
  timestamp: number;
}

// Type(s) used to reformat data for display

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
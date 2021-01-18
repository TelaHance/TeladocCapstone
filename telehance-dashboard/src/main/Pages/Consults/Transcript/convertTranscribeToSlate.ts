/**
 * Converts AWS Transcribe Json to SlateJS format
 * Partially influenced by bbc/react-transcript-editor
 * @see https://github.com/bbc/react-transcript-editor/blob/6ebe48d3130343e8a4937a30c7a4213502550c15/packages/stt-adapters/amazon-transcribe/index.js
 */

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Normalize words into easier format.
 * 1. Times [String (in seconds) => Number (in milliseconds)]
 * 2. Replace alternatives with content and confidence
 * @param {AWS_Item} currentWord
 */
function normalizeWord(currentWord: AWS_Item): Word {
  return {
    start: Math.round(parseFloat(currentWord.start_time) * 1000),
    end: Math.round(parseFloat(currentWord.end_time) * 1000),
    text: ' ' + currentWord.alternatives[0].content,
    confidence: parseFloat(currentWord.alternatives[0].confidence),
  };
}

function reformat(transcript: AWS_Transcript) {
  const transcriptCopy = JSON.parse(JSON.stringify(transcript));
  const { channel_labels } = transcript.results;
  for (let i = 0; i < channel_labels.number_of_channels; i++) {
    let { items } = channel_labels.channels[i];
    const newItems: Word[] = [];
    items.forEach((item) => {
      if (item.type === 'pronunciation') {
        newItems.push(normalizeWord(item));
      } else {
        // Compress any punctuation into the previous word
        const prevContent = newItems[newItems.length - 1].text;
        newItems[newItems.length - 1].text = prevContent.concat(
          item.alternatives[0].content
        );
      }
    });

    transcriptCopy.results.channel_labels.channels[i].items = newItems;
  }
  return transcriptCopy;
}

function groupWordsInBlocks(transcript: AWS_Transcript) {
  const data = transcript.results.channel_labels;
  const doctor = data.channels[0];
  const patient = data.channels[1];

  const DOCTOR_LABEL = doctor.channel_label;
  const PATIENT_LABEL = patient.channel_label;

  let idx = {
    [DOCTOR_LABEL]: 0,
    [PATIENT_LABEL]: 0,
  };

  let doctorStartTime = doctor.items[0].start;
  let patientStartTime = doctor.items[0].start;
  let prevSpeaker =
    doctorStartTime < patientStartTime ? DOCTOR_LABEL : PATIENT_LABEL;

  const blocks = [];
  let block: Word[] = [];

  // Order all sentences between self and other while both have sentences to read from.
  while (
    idx[DOCTOR_LABEL] < doctor.items.length &&
    idx[PATIENT_LABEL] < patient.items.length
  ) {
    const next_words = {
      [DOCTOR_LABEL]: doctor.items[idx[DOCTOR_LABEL]],
      [PATIENT_LABEL]: patient.items[idx[PATIENT_LABEL]],
    };

    // start time is 0 when type is 'punctuation', since .start will be NULL
    doctorStartTime = next_words[DOCTOR_LABEL].start;
    patientStartTime = next_words[PATIENT_LABEL].start;

    const speaker =
      doctorStartTime < patientStartTime ? DOCTOR_LABEL : PATIENT_LABEL;

    const nextWord = next_words[speaker];
    if (speaker === prevSpeaker) {
      // Same speaker => Add to current block
      block.push(nextWord);
    } else {
      // Change speaker => End current block and make new block
      blocks.push({
        speaker: prevSpeaker,
        words: block,
      });
      block = [nextWord];
    }

    idx[speaker]++;
    prevSpeaker = speaker;
  }

  // Push last block from while loop.
  blocks.push({
    speaker: prevSpeaker,
    words: block,
  });
  block = [];

  // Concatenate all other sentences from either doctor or patient not reached in
  // the while loop all as one block.
  for (; idx[DOCTOR_LABEL] < doctor.items.length; idx[DOCTOR_LABEL]++) {
    const nextWord = doctor.items[idx[DOCTOR_LABEL]];
    block.push(nextWord);
    prevSpeaker = DOCTOR_LABEL;
  }
  for (; idx[PATIENT_LABEL] < patient.items.length; idx[PATIENT_LABEL]++) {
    const nextWord = patient.items[idx[PATIENT_LABEL]];
    block.push(nextWord);
    prevSpeaker = PATIENT_LABEL;
  }
  blocks.push({
    speaker: prevSpeaker,
    words: block,
  });

  // Capitalize first word of each block and remove beginning space.
  blocks.forEach((block) => {
    block.words[0].text = block.words[0].text.substring(1);
    block.words[0].text = capitalize(block.words[0].text);
  });

  return blocks;
}

export default function convertTranscribeToSlate(
  amazonTranscribeJson: AWS_Transcript
): Message[] {
  const transcript = reformat(amazonTranscribeJson);
  const wordsByParagraphs = groupWordsInBlocks(transcript);

  return wordsByParagraphs.map((paragraph) => {
    return {
      speaker: paragraph.speaker,
      start: paragraph.words[0].start,
      type: 'message',
      children: paragraph.words,
    };
  });
}

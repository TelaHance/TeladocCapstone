import { convertFromRaw, RawDraftContentBlock } from 'draft-js';
const generateRandomKey = require('draft-js/lib/generateRandomKey');

/**
 * Converts AWS Transcribe Json to DraftJs
 * Adapted from bbc/react-transcript-editor
 * @see https://github.com/bbc/react-transcript-editor/blob/6ebe48d3130343e8a4937a30c7a4213502550c15/packages/stt-adapters/amazon-transcribe/index.js
 */

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTextFromBlock(block: Word[]) {
  const blockContent: string[] = [];
  block.forEach(({ text }) => {
    blockContent.push(text);
  });
  return blockContent;
}

/**
 * Normalize words into easier format.
 * 1. Times [String (in seconds) => Number (in milliseconds)]
 * 2. Replace alternatives with content and confidence
 * @param {AWS_Item} currentWord
 */
function normalizeWord(currentWord: AWS_Item): Word {
  return {
    start_time: Math.round(parseFloat(currentWord.start_time) * 1000),
    end_time: Math.round(parseFloat(currentWord.end_time) * 1000),
    text: currentWord.alternatives[0].content,
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

/**
 * helper function to flatten a list.
 * converts nested arrays into one dimensional array
 * @param {array} list
 */
// @ts-ignore
const flatten = (list) =>
  // @ts-ignore
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

/**
 * helper function to create createEntityMap
 * @param {*} blocks - draftJs blocks
 */
function createEntityMap(blocks: RawDraftContentBlock[]) {
  const entityRanges = blocks.map((block) => block.entityRanges);
  const flatEntityRanges = flatten(entityRanges);

  const entityMap = {};

  // @ts-ignore
  flatEntityRanges.forEach((data) => {
    // @ts-ignore
    entityMap[data.key] = {
      type: 'WORD',
      mutability: 'MUTABLE',
      data,
    };
  });

  return entityMap;
}

function generateEntitiesRanges(words: Word[]) {
  let position = 0;

  return words.map((word) => {
    const result = {
      start: word.start_time,
      end: word.end_time,
      text: word.text,
      confidence: word.confidence,
      offset: position,
      length: word.text.length,
      key: generateRandomKey(),
    };
    // increase position counter - to determine word offset in paragraph
    position = position + word.text.length + 1;

    return result;
  });
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

  let doctorStartTime = doctor.items[0].start_time;
  let patientStartTime = doctor.items[0].start_time;
  let prevSpeaker =
    doctorStartTime < patientStartTime ? DOCTOR_LABEL : PATIENT_LABEL;

  const blocks = [];
  let block: Word[] = [];

  // Order all sentences between self and other while both have sentences to read from.
  while (
    idx[DOCTOR_LABEL] < doctor.items.length &&
    idx[PATIENT_LABEL] < patient.items.length
  ) {
    const next_items = {
      [DOCTOR_LABEL]: doctor.items[idx[DOCTOR_LABEL]],
      [PATIENT_LABEL]: patient.items[idx[PATIENT_LABEL]],
    };

    // start time is 0 when type is 'punctuation', since .start_time will be NULL
    doctorStartTime = next_items[DOCTOR_LABEL].start_time;
    patientStartTime = next_items[PATIENT_LABEL].start_time;

    const speaker =
      doctorStartTime < patientStartTime ? DOCTOR_LABEL : PATIENT_LABEL;

    if (speaker === prevSpeaker) {
      // Same speaker => Add to current block
      block.push(next_items[speaker]);
    } else {
      // Change speaker => End current block and make new block
      blocks.push({
        speaker: prevSpeaker,
        words: block,
        text: getTextFromBlock(block),
      });
      block = [next_items[speaker]];
    }

    idx[speaker]++;
    prevSpeaker = speaker;
  }

  // Push last block from while loop.
  blocks.push({
    speaker: prevSpeaker,
    words: block,
    text: getTextFromBlock(block),
  });
  block = [];

  // Concatenate all other sentences from either doctor or patient not reached in
  // the while loop all as one block.
  for (; idx[DOCTOR_LABEL] < doctor.items.length; idx[DOCTOR_LABEL]++) {
    block.push(doctor.items[idx[DOCTOR_LABEL]]);
    prevSpeaker = DOCTOR_LABEL;
  }
  for (; idx[PATIENT_LABEL] < patient.items.length; idx[PATIENT_LABEL]++) {
    block.push(patient.items[idx[PATIENT_LABEL]]);
    prevSpeaker = PATIENT_LABEL;
  }
  blocks.push({
    speaker: prevSpeaker,
    words: block,
    text: getTextFromBlock(block),
  });

  // Capitalize first word of each block
  blocks.forEach((block) => {
    block.words[0].text = capitalize(block.words[0].text);
  });

  return blocks;
}

export default function amazonTranscribeToDraft(amazonTranscribeJson: AWS_Transcript) {
  const results: RawDraftContentBlock[] = [];
  const transcript = reformat(amazonTranscribeJson);
  const wordsByParagraphs = groupWordsInBlocks(transcript);

  wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: paragraph.speaker,
        words: paragraph.words,
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words),
    };
    // @ts-ignore
    results.push(draftJsContentBlockParagraph);
  });

  return convertFromRaw({ blocks: results, entityMap: createEntityMap(results) });
};
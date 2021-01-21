import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import AudioPlayer from 'react-h5-audio-player';
import { Slate, Editable, RenderElementProps } from 'slate-react';
import useCustomEditor from './useCustomEditor';
import Controls from './Controls/Controls';
import Message from './Message';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';

function getWordsBetweenTimes(words: Word[], start: number, end: number) {
  return words.filter((word) => start <= word.start && word.end <= end);
}

function retimeSection(wordsBeforeSplit: Word[], wordsAfterSplit: Word[]) {
  const retimedWords = JSON.parse(JSON.stringify(wordsAfterSplit));
  // If before / after have same number of words, apply the timings from the
  // original.
  if (wordsBeforeSplit.length === wordsAfterSplit.length) {
    for (let i = 0; i < retimedWords.length; i++) {
      retimedWords[i].start = wordsBeforeSplit[i].start;
      retimedWords[i].end = wordsBeforeSplit[i].end;
      delete retimedWords[i].splitIdx;
    }
    return retimedWords;
  }

  // If before / after have different number of words, infer timings based on
  // relative length.
  let totalLength = 0;
  for (let word of wordsAfterSplit) {
    totalLength += word.text.length;
  }
  let start = wordsAfterSplit[0].start;
  const duration = wordsAfterSplit[wordsAfterSplit.length - 1].end - start;
  for (let word of retimedWords) {
    word.start = start;
    // Set start for next segment and as end of current segment.
    start += Math.round((word.text.length * duration) / totalLength);
    word.end = start;
  }

  return retimedWords;
}

function retimeAll(originalValue: Message[], value: Message[]) {
  const retimedValue: Message[] = [];

  for (let i = 0; i < value.length; i++) {
    let retimedWords: Word[] = []; // Keeps track of all new words, after retiming those in wordsAfterSplit.
    let wordsAfterSplit: Word[] = []; // Keeps track of words belonging to the same split segment.

    const origWords = originalValue[i].children;
    const newWords = value[i].children;

    for (let word of newWords) {
      const { splitIdx } = word;
      // Word is part of a split section.
      if (typeof splitIdx === 'number') {
        // Handle start of new split section.
        if (splitIdx === 0) {
          // End any previous split sections.
          if (wordsAfterSplit.length > 0) {
            const { start } = wordsAfterSplit[0];
            const { end } = wordsAfterSplit[wordsAfterSplit.length - 1];
            const wordsBeforeSplit = getWordsBetweenTimes(
              origWords,
              start,
              end
            );
            retimedWords = retimedWords.concat(
              retimeSection(wordsBeforeSplit, wordsAfterSplit)
            );
          }
          wordsAfterSplit = [word];
        }
        // Handle traversing the split section.
        else {
          wordsAfterSplit.push(word);
        }
      }
      // Word is not part of a split section.
      else {
        // Handle when the word directly follows a split section.
        if (wordsAfterSplit.length > 0) {
          const { start } = wordsAfterSplit[0];
          const { end } = wordsAfterSplit[wordsAfterSplit.length - 1];
          const wordsBeforeSplit = getWordsBetweenTimes(origWords, start, end);
          retimedWords = retimedWords.concat(
            retimeSection(wordsBeforeSplit, wordsAfterSplit)
          );
          wordsAfterSplit = [];
        }
        retimedWords.push(word);
      }
    }
    // Handle when the split section is at the end of the word collection.
    if (wordsAfterSplit.length > 0) {
      const { start } = wordsAfterSplit[0];
      const { end } = wordsAfterSplit[wordsAfterSplit.length - 1];
      const wordsBeforeSplit = getWordsBetweenTimes(origWords, start, end);
      retimedWords = retimedWords.concat(
        retimeSection(wordsBeforeSplit, wordsAfterSplit)
      );
    }
    const messageCopy = JSON.parse(JSON.stringify(value[i]));
    messageCopy.children = retimedWords;
    retimedValue.push(messageCopy);
  }

  return retimedValue;
}

function getStartTimes(value: Message[]) {
  const startTimes = value
    .map((message) => message.children.map((word) => word.start))
    .flat();

  // This will ensure that the first word is not highlighted when the playback begins.
  startTimes.unshift(0);
  // This will ensure that the last word is not highlighted when the playback ends.
  const lastMessage = value[value.length - 1].children;
  const transcriptEndTime = lastMessage[lastMessage.length - 1].end;
  startTimes.push(transcriptEndTime);

  return startTimes;
}

export default function Transcript({
  audioSrc,
  transcript,
  transcriptEdited = transcript,
  updateTranscript,
}: TranscriptProps) {
  const editor = useCustomEditor();

  // Transcript to Display
  const [isViewingEdited, setIsViewingEdited] = useState(true);
  // Keep track of saved edited transcript (avoid more API calls)
  const [localTranscriptEdited, setLocalTranscriptEdited] = useState(
    transcriptEdited
  );

  const [isEditing, setIsEditing] = useState(false);
  const player = useRef<AudioPlayer>(null);

  // States for keeping track of which word is active
  const [time, setTime] = useState(0); // Current playback time in ms (minimize float errors)
  const [currWordIdx, setCurrWordIdx] = useState(0); // Where in startTimes the current word lies
  const [startTimes, setStartTimes] = useState<number[]>( // List of each word's start time (w/ 0 at beginning and last word end time at the end)
    getStartTimes(transcript)
  );
  const [currWordStartTime, setCurrWordStartTime] = useState(0); // Start time of the word s.t. time[currWord] <= time (state) < time[nextWord]

  // If the display transcript changes, reset display states.
  useEffect(() => {
    if (isViewingEdited) {
      setStartTimes(getStartTimes(transcript));
    } else {
      setStartTimes(getStartTimes(localTranscriptEdited));
    }
  }, [isViewingEdited]);

  // Effect for updating the current word
  useEffect(() => {
    // Index of the closest *real* start time at least as large as it.
    const closestTimeIdx =
      startTimes.findIndex((startTime) => time < startTime) - 1;
    // If idx out of range (may occur due to floating point errors)
    const nextWordIdx =
      closestTimeIdx < 0 ? startTimes.length - 1 : closestTimeIdx;
    if (currWordIdx !== nextWordIdx) {
      setCurrWordIdx(nextWordIdx);
      setCurrWordStartTime(startTimes[nextWordIdx]);
    }
  }, [time, startTimes]);

  function getPlayerTime() {
    return Math.round(
      (player?.current?.audio?.current?.currentTime ?? 0) * 1000
    );
  }

  function setPlayerTime(newTime: number) {
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = newTime / 1000;
  }

  function setNewTime(newTime: number) {
    setTime(newTime);
    setPlayerTime(newTime);
  }

  function updateTime() {
    setTime(getPlayerTime());
  }

  function previous() {
    setTime(0);
    setPlayerTime(0);
  }

  function next() {
    setTime((player?.current?.audio?.current?.duration ?? 0) * 1000);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime =
        player.current.audio.current.duration;
  }

  function toggleEdit() {
    // TODO: Add readOnly prop set to true when user is a patient.
    if (isEditing && localTranscriptEdited) {
      const newTranscript = retimeAll(transcript, localTranscriptEdited); // Use transcript prop as original reference for retiming.
      newTranscript.forEach(message => {
        message.fullText = message.children.map(word => word.text).join('').trim();
      });
      setLocalTranscriptEdited(newTranscript);
      setStartTimes(getStartTimes(newTranscript));
      updateTranscript(newTranscript);
    }
    setIsEditing(!isEditing);
  }

  function toggleView() {
    if (isViewingEdited) {
      setStartTimes(getStartTimes(transcript));
    } else {
      setStartTimes(getStartTimes(localTranscriptEdited ?? transcript));
    }
    setIsViewingEdited(!isViewingEdited);
  }

  const DefaultElement = useCallback(({ attributes, children }) => {
    return <p {...attributes}>{children}</p>;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'message':
        return <Message {...props} userSpeakerLabel='ch_0' />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }) => {
      const isCurrent = leaf.start === currWordStartTime;
      const isFirst = leaf.text.charAt(0) !== ' ';

      return (
        <span
          className={clsx({
            [classes.first]: isFirst,
            [classes.highlight]: isCurrent,
            [classes.readonly]: !isEditing,
          })}
          onMouseDown={() => {
            if (!isEditing) setNewTime(leaf.start);
          }}
          onDoubleClick={() => {
            if (isEditing) setNewTime(leaf.start);
          }}
          data-start={leaf.start}
          data-end={leaf.end}
          {...attributes}
        >
          {children}
        </span>
      );
    },
    [currWordStartTime]
  );

  return (
    <section className={classes.container}>
      <Controls
        isEditing={isEditing}
        toggleEdit={toggleEdit}
        hasEditedCopy={!isEditing && localTranscriptEdited !== transcript}
        isEdited={isViewingEdited}
        toggleView={toggleView}
      />
      <Slate
        editor={editor}
        value={isViewingEdited ? localTranscriptEdited : transcript}
        onChange={(newValue) => setLocalTranscriptEdited(newValue as Message[])}
      >
        <Editable
          readOnly={!isEditing}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
      <AudioPlayer
        src={audioSrc}
        listenInterval={50}
        onListen={updateTime}
        showSkipControls
        onClickPrevious={previous}
        onClickNext={next}
        customAdditionalControls={[]}
        className={classes['audio-container']}
        ref={player}
      />
    </section>
  );
}

type TranscriptProps = {
  audioSrc: string;
  transcript: Transcript;
  transcriptEdited?: Transcript;
  updateTranscript: (transcript: Transcript) => void;
};

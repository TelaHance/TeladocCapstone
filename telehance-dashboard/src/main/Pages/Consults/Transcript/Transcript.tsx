import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import AudioPlayer from 'react-h5-audio-player';
import { Slate, Editable, RenderElementProps } from 'slate-react';
import useCustomEditor from './useCustomEditor';
import convertTranscribeToSlate from './convertTranscribeToSlate';
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

export default function Transcript({ transcript, audioSrc }: TranscriptProps) {
  const editor = useCustomEditor();

  const [time, setTime] = useState(0); // Time in milliseconds (minimize float errors)
  // Original state (used in maintaining time breakup)
  const [originalValue, setOriginalValue] = useState<Message[]>([]);
  const [value, setValue] = useState<Message[]>([]); // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const player = useRef<AudioPlayer>(null);

  // Executes ONCE (on mount)
  useEffect(() => {
    const slateTranscript = convertTranscribeToSlate(transcript);
    // TODO: Fetch original transcript
    setOriginalValue(slateTranscript);
    // TODO: Fetch edited transcript
    const editedTranscript = window.localStorage.getItem('editedTranscript');
    if (!editedTranscript) {
      setValue(slateTranscript);
    } else {
      setValue(JSON.parse(editedTranscript));
    }
  }, []);

  function setNewTime(newTime: number) {
    setTime(Math.round(newTime));
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = newTime / 1000;
  }

  function updateTime() {
    setTime(
      Math.round((player?.current?.audio?.current?.currentTime ?? 0) * 1000)
    );
  }

  function previous() {
    setTime(0);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = 0;
  }

  function next() {
    setTime((player?.current?.audio?.current?.duration ?? 0) * 1000);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime =
        player.current.audio.current.duration;
  }

  function toggleEdit() {
    if (isEditing) {
      const newValue = retimeAll(originalValue, value);
      setValue(newValue);
      // TODO: Replace with DynamoDB access
      window.localStorage.setItem('editedTranscript', JSON.stringify(newValue));
    }
    setIsEditing(!isEditing);
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
      const isCurrent = leaf.start <= time && time < leaf.end;
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
    [time]
  );

  return (
    <section className={classes.container}>
      <Controls isEditing={isEditing} toggleEdit={toggleEdit} />
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue as Message[])}
      >
        <Editable
          readOnly={!isEditing}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
      <AudioPlayer
        src={audioSrc}
        listenInterval={10}
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
  transcript: AWS_Transcript;
  audioSrc: string;
};

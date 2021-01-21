import React, { useState, useEffect, useRef, useCallback } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Slate,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import useCustomEditor from './useCustomEditor';
import Controls from './Controls';
import Message, { MessageData } from './Message';
import Word from './Word';
import { retimeAll, getStartTimes } from './retime';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';

// TODO: Refactor less relevant timing states and AudioPlayer to another component.

export default function Transcript({
  audioSrc,
  transcript,
  transcriptEdited,
  updateTranscript,
}: TranscriptProps) {
  const editor = useCustomEditor();

  // Transcript to Display
  const [isViewingEdited, setIsViewingEdited] = useState(!!transcriptEdited);
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
      setStartTimes(getStartTimes(localTranscriptEdited ?? transcript));
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

  function handleSave() {
    if (localTranscriptEdited) {
      const newTranscript = retimeAll(transcript, localTranscriptEdited); // Use transcript prop as original reference for retiming.
      newTranscript.forEach((message) => {
        message.fullText = message.children
          .map((word) => word.text)
          .join('')
          .trim();
      });
      // If full text is the same as the original, delete local and remote edited versions.
      if (
        transcript.map((message) => message.fullText).join('') ===
        newTranscript.map((message) => message.fullText).join('')
      ) {
        deleteEdited();
      }
      // Save new edit locally and update remote
      else {
        setLocalTranscriptEdited(newTranscript);
        setStartTimes(getStartTimes(newTranscript));
        updateTranscript(newTranscript);
      }
    }
    setIsEditing(false);
  }

  function handleEdit() {
    // Initialize new local transcript-edited with original transcript if one does not exist
    if (!localTranscriptEdited) {
      setLocalTranscriptEdited(transcript);
      toggleView();
    }
    setIsEditing(true);
  }

  function toggleView() {
    if (isViewingEdited) {
      setStartTimes(getStartTimes(transcript));
    } else {
      setStartTimes(getStartTimes(localTranscriptEdited ?? transcript));
    }
    setIsViewingEdited(!isViewingEdited);
  }

  function deleteEdited() {
    if (localTranscriptEdited) {
      setLocalTranscriptEdited(undefined);
      setStartTimes(getStartTimes(transcript));
      setIsViewingEdited(false);
      setIsEditing(false);
      if (transcriptEdited) {
        updateTranscript(undefined);
      }
    }
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
    ({ attributes, children, leaf }: RenderLeafProps) => {
      const isCurrent = leaf.start === currWordStartTime;

      return (
        <Word
          isEditing={isEditing}
          isCurrent={isCurrent}
          onClick={setNewTime}
          startTime={leaf.start as number}
          attributes={attributes}
        >
          {children}
        </Word>
      );
    },
    [currWordStartTime, isEditing]
  );

  return (
    <section className={classes.container}>
      <Controls
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        hasEditedCopy={!isEditing && !!localTranscriptEdited}
        isEdited={isViewingEdited}
        toggleView={toggleView}
        onDelete={deleteEdited}
      />
      <Slate
        editor={editor}
        value={
          isViewingEdited ? localTranscriptEdited ?? transcript : transcript
        }
        onChange={(newValue) => setLocalTranscriptEdited(newValue as TranscriptData)}
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

export type TranscriptProps = {
  audioSrc: string;
  transcript: TranscriptData;
  transcriptEdited?: TranscriptData;
  updateTranscript: (transcript: TranscriptData | undefined) => void;
};

export type TranscriptData = MessageData[];

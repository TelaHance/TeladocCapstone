import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Slate,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import useCustomEditor from './useCustomEditor';
import AudioPlayer from './AudioPlayer';
import Controls from './Controls';
import Message, { MessageData } from './Message';
import Word from './Word';
import { retimeAll, getStartTimes } from './retime';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';

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

  // States for keeping track of which word is active
  const [startFrom, setStartFrom] = useState(0);
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

  function handleEdit() {
    // Initialize new local transcript_edited with original transcript if one does not exist
    if (!localTranscriptEdited) {
      setLocalTranscriptEdited(transcript);
      toggleView();
    }
    setIsEditing(true);
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

  function handleCancel() {
    setLocalTranscriptEdited(transcriptEdited);
    setStartTimes(getStartTimes(transcriptEdited ?? transcript));
    setIsEditing(false);
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

      const word = useMemo(
        () => (
          <Word
            isEditing={isEditing}
            isCurrent={isCurrent}
            onClick={setStartFrom}
            startTime={leaf.start as number}
            attributes={attributes}
          >
            {children}
          </Word>
        ),
        [isEditing, isCurrent]
      );
      
      return word;
    },
    [currWordStartTime, isEditing]
  );

  return (
    <section className={classes.container}>
      <Controls
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={deleteEdited}
        hasEditedCopy={!isEditing && !!localTranscriptEdited}
        isEdited={isViewingEdited}
        toggleView={toggleView}
      />
      <Slate
        editor={editor}
        value={
          isViewingEdited ? localTranscriptEdited ?? transcript : transcript
        }
        onChange={(newValue) =>
          setLocalTranscriptEdited(newValue as TranscriptData)
        }
      >
        <Editable
          readOnly={!isEditing}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
      <AudioPlayer
        src={audioSrc}
        startFrom={startFrom}
        startTimes={startTimes}
        setCurrWordStartTime={setCurrWordStartTime}
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

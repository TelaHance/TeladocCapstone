import { useState, useEffect } from 'react';
import { retimeAll, getStartTimes } from 'Util/retime';
import { AudioPlayerProps } from 'Pages/Consult/AudioPlayer';
import { ControlsProps } from 'Pages/Consult/Controls';
import { TranscriptProps } from 'Components/Transcript';
import { TranscriptData } from 'Models';

export default function useFinishedTranscriptProps(
  updateTranscript: (transcript?: TranscriptData) => void,
  transcript?: TranscriptData,
  transcriptEdited?: TranscriptData
): useFinishedTranscriptProps {
  // Controls States
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingEdited, setIsViewingEdited] = useState(false);

  // Edited Transcript State
  const [
    localTranscriptEdited,
    setLocalTranscriptEdited,
  ] = useState<TranscriptData>();

  // Audio & Current Word States
  const [startFrom, setStartFrom] = useState(0);
  const [startTimes, setStartTimes] = useState<number[]>([]); // List of each word's start time (w/ 0 at beginning and last word end time at the end)
  const [currWordStartTime, setCurrWordStartTime] = useState(0); // Start time of the word s.t. time[currWord] <= time (state) < time[nextWord]

  // Intialize state when function args are no longer undefined.
  useEffect(() => {
    if (transcript) {
      setIsViewingEdited(!!transcriptEdited);
      setLocalTranscriptEdited(transcriptEdited);
    }
  }, [transcript, transcriptEdited]);

  // If the display transcript changes, reset display states.
  useEffect(() => {
    const nextTranscript = isViewingEdited
      ? localTranscriptEdited ?? transcript
      : transcript;
    if (nextTranscript) setStartTimes(getStartTimes(nextTranscript));
  }, [isViewingEdited, transcript, localTranscriptEdited]);

  /*
    Controls Props
  */

  function onEdit() {
    setIsEditing(true);
    setIsViewingEdited(true);
    // Initialize new local transcript_edited with original transcript if one does not exist
    if (!localTranscriptEdited) setLocalTranscriptEdited(transcript);
  }

  function onSave() {
    if (!transcript) return;
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
        onDelete();
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

  function onCancel() {
    if (!transcript) return;
    setIsEditing(false);
    setLocalTranscriptEdited(transcriptEdited);
    setStartTimes(getStartTimes(transcriptEdited ?? transcript));
  }

  function onDelete() {
    if (!transcript) return;
    if (localTranscriptEdited) {
      setIsEditing(false);
      setIsViewingEdited(false);
      setLocalTranscriptEdited(undefined);
      setStartTimes(getStartTimes(transcript));
      updateTranscript(undefined);
    }
  }

  function toggleView() {
    setIsViewingEdited(!isViewingEdited);
  }

  return {
    audioPlayerProps: {
      startFrom,
      startTimes,
      setCurrWordStartTime,
    },
    controlsProps: {
      isEditing,
      onEdit,
      onSave,
      onCancel,
      onDelete,
      hasEditedCopy: !isEditing && !!localTranscriptEdited,
      isEdited: isViewingEdited,
      toggleView,
    },
    transcriptProps: {
      transcript: isViewingEdited
        ? localTranscriptEdited ?? transcript
        : transcript,
      onChange: setLocalTranscriptEdited,
      isEditing,
      currWordStartTime,
      setStartFrom,
    },
  };
}

type useFinishedTranscriptProps = {
  audioPlayerProps: AudioPlayerProps;
  controlsProps: ControlsProps;
  transcriptProps: TranscriptProps;
};

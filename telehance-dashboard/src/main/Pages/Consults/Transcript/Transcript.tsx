import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Editor,
  EditorState,
  ContentState,
  ContentBlock,
  RawDraftContentBlock,
  convertToRaw,
} from 'draft-js';
import amazonTranscribeToDraft from './amazonTranscribeToDraft';
import Controls from './Controls/Controls';
import Message from './Message/Message';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';
import 'draft-js/dist/Draft.css';

type TranscriptProps = {
  transcript: AWS_Transcript;
  audioSrc: string;
};

export default function Transcript({ transcript, audioSrc }: TranscriptProps) {
  const [time, setTime] = useState(0); // Time in milliseconds (avoid float errors)
  const [isEditing, setIsEditing] = useState(false);
  const player = useRef<AudioPlayer>(null);

  // Populate Editor State with ContentBlocks
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const contentState = amazonTranscribeToDraft(transcript);
    setEditorState(EditorState.createWithContent(contentState));
  }, []);

  /*
    Makes a copy of editorState and sets the copy as the new editorState. This
    will ensure when actions like clicking a word or playing the audio change
    the time state, the changes are reflected in the transcript text.
  */
  function forceRender() {
    const contentState = editorState.getCurrentContent();
    const decorator = editorState.getDecorator();
    const newEditorState = EditorState.createWithContent(
      contentState,
      decorator
    );
    const editorStateCopy = EditorState.set(newEditorState, {
      selection: editorState.getSelection(),
      undoStack: editorState.getUndoStack(),
      redoStack: editorState.getRedoStack(),
      lastChangeType: editorState.getLastChangeType(),
    });
    setEditorState(editorStateCopy);
  }

  function setNewTime(newTime: number) {
    setTime(Math.round(newTime));
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = newTime / 1000;
    forceRender();
  }

  function updateTime() {
    setTime(
      Math.round((player?.current?.audio?.current?.currentTime ?? 0) * 1000)
    );
    forceRender();
  }

  function previous() {
    setTime(0);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = 0;
    forceRender();
  }

  function next() {
    setTime((player?.current?.audio?.current?.duration ?? 0) * 1000);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime =
        player.current.audio.current.duration;
    forceRender();
  }

  function toggleEdit() {
    // const rawContent = convertToRaw(editorState.getCurrentContent());
    if (isEditing) {
      // TODO: Save edits
    }
    setIsEditing(!isEditing);
  }

  function messageBlockRenderer(contentBlock: ContentBlock) {
    const data = contentBlock.getData() as any;
    if (data.length === 0) {
      return null;
    }
    return {
      component: Message,
      editable: isEditing,
      props: {
        currentTime: time,
        setCurrTime: setNewTime,
        userSpeakerLabel: 'ch_0',
      },
    };
  }

  return (
    <div className={classes.container}>
      <Controls isEditing={isEditing} toggleEdit={toggleEdit} />
      <div className={classes.messages}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          stripPastedStyles
          readOnly={isEditing}
          blockRendererFn={messageBlockRenderer}
        />
      </div>
      <AudioPlayer
        src={audioSrc}
        listenInterval={10}
        onListen={updateTime}
        showSkipControls
        onClickPrevious={previous}
        onClickNext={next}
        customAdditionalControls={[]}
        ref={player}
      />
    </div>
  );
}

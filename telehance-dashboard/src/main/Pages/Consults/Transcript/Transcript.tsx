import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Editor,
  EditorState,
  ContentState,
  ContentBlock,
  RawDraftContentBlock,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js';
import amazonTranscribeToDraft from './amazonTranscribeToDraft';
import Controls from './Controls/Controls';
import Message from './Message/Message';
import Word from './Message/Word/Word';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';
import 'draft-js/dist/Draft.css';

type TranscriptProps = {
  transcript: AWS_Transcript;
  audioSrc: string;
};

const getEntityStrategy = (mutability: string) => (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }

    return contentState.getEntity(entityKey).getMutability() === mutability;
  }, callback);
};

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: Word,
  }
])

export default function Transcript({ transcript, audioSrc }: TranscriptProps) {
  const [time, setTime] = useState(0); // Time in milliseconds (avoid float errors)
  const [isEditing, setIsEditing] = useState(false);
  const player = useRef<AudioPlayer>(null);

  // Populate Editor State with ContentBlocks
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

  // Load Transcript
  useEffect(() => {
    const contentState = amazonTranscribeToDraft(transcript);
    setEditorState(EditorState.createWithContent(contentState, decorator));
  }, []);

  /*
    Makes a copy of editorState and sets the copy as the new editorState. This
    will ensure when actions like clicking a word or playing the audio change
    the time state, the changes are reflected in the transcript text.
  */
  function forceRender() {
    const contentState = editorState.getCurrentContent();
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
    const rawContent = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    window.localStorage.setItem('editorContent', rawContent);
    if (isEditing) {
      // TODO: Save edits
    }
    setIsEditing(!isEditing);
    forceRender();
  }

  function messageBlockRenderer() {
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

  function handleDoubleClick(event: any) {
    // nativeEvent --> React giving you the DOM event
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute("data-start") && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute("data-start")) {
      const t = parseInt(element.getAttribute("data-start"));
      setNewTime(t);
    }
  };

  function getCurrentWord() {
    const currentWord = {
      start: 'NA',
      end: 'NA',
    };
    if (transcript) {
      const contentState = convertToRaw(editorState.getCurrentContent());
      const entityMap = contentState.entityMap;

      for (let key in entityMap) {
        const word = entityMap[key].data;
        if (word.start <= time && time < word.end) {
          currentWord.start = word.start;
          currentWord.end = word.end;
        }
      }
    }
    if (currentWord.start !== 'NA') {
      const currentWordElement = document.querySelector(
        `span.Word[data-start="${currentWord.start}"]`
      );
      currentWordElement?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
      });
    }
    return currentWord;
  }

  const currentWord = getCurrentWord();
  const highlightColor = '#4290da';

  return (
    <section className={classes.container} onDoubleClick={handleDoubleClick}>
      <style scoped>
        {`span.Word[data-start="${currentWord.start}"] { background-color: ${highlightColor}; text-shadow: 0 0 0.01px black }`}
        {`span.Word[data-start="${currentWord.start}"]+span { background-color: ${highlightColor} }`}
      </style>
      <Controls isEditing={isEditing} toggleEdit={toggleEdit} />
      <div className={classes.messages}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          stripPastedStyles
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
    </section>
  );
}

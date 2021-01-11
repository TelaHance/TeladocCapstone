import React, { useState, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Editor,
  EditorState,
  ContentState,
  ContentBlock,
  RawDraftContentBlock,
} from 'draft-js';
import Controls from './Controls/Controls';
import Message from './Message/Message';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';
import 'draft-js/dist/Draft.css';
const generateRandomKey = require('draft-js/lib/generateRandomKey');

function getTextFromItems(items: BlockItem[]) {
  const content: string[] = [];
  items.forEach((item) => {
    content.push(item.content);
  });
  return content.join(' ');
}

type EntityRange = {
  key: any;
  offset: number;
  length: number;
  start_time: number;
  end_time: number;
  text: string;
};

function generateEntityRanges(items: BlockItem[]): EntityRange[] {
  let position = 0;
  return items.map((item) => {
    const mapping = {
      key: generateRandomKey(),
      offset: position,
      length: item.content.length,
      start_time: item.start_time,
      end_time: item.end_time,
      text: item.content,
    };
    position += item.content.length + 1;
    return mapping;
  });
}

function createEntityMap(blocks: RawDraftContentBlock[]) {
  // @ts-ignore
  function flatten(list) {
    return list.reduce(
      // @ts-ignore
      (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b),
      []
    );
  }

  const entityRanges = blocks.map((block) => block.entityRanges);
  const flatRanges = flatten(entityRanges);
  const entityMap = {};

  // @ts-ignore
  flatRanges.forEach((data) => {
    // @ts-ignore
    entityMap[data.key] = {
      type: 'WORD',
      mutability: 'MUTABLE',
      data,
    };
  });

  return entityMap;
}

function getContentBlocks(transcript: Transcript) {
  const blocks: RawDraftContentBlock[] = [];
  transcript.blocks.forEach((block, idx) => {
    const draftJsContentBlock = new ContentBlock({
      key: idx,
      type: 'paragraph',
      text: getTextFromItems(block.items),
      data: block,
      entityRanges: generateEntityRanges(block.items),
    });
    // @ts-ignore
    blocks.push(draftJsContentBlock);
  });
  return blocks;
}

type TranscriptProps = {
  transcript: Transcript;
  audioSrc: string;
};

export default function Transcript({ transcript, audioSrc }: TranscriptProps) {
  const [time, setTime] = useState(0); // Time in milliseconds (avoid float errors)
  const [isEditing, setIsEditing] = useState(false);
  // TODO: Use setBlocks later to save edited content.
  // const [blocks, setBlocks] = useState(transcript.blocks);
  const player = useRef<AudioPlayer>(null);

  // Populate Editor State with ContentBlocks
  const [editorState, setEditorState] = useState(() => {
    const contentBlocks = getContentBlocks(transcript);
    // @ts-ignore
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    return EditorState.createWithContent(contentState);
  });

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
    if (isEditing) {
      // TODO: Save edits before toggling
    }
    setIsEditing(!isEditing);
  }

  function messageBlockRenderer(contentBlock: ContentBlock) {
    const data = (contentBlock.getData() as unknown) as TranscriptBlock;
    const isSelf = data.speaker === 'ch_0';
    return {
      component: Message,
      editable: false,
      props: {
        items: data.items,
        isSelf: isSelf,
        currentTime: time,
        setCurrTime: setNewTime,
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
        className={classes.audioplayer}
      />
    </div>
  );
}

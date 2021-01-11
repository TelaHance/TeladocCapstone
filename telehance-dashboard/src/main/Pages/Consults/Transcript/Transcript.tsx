import React, { useState, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Editor,
  EditorState,
  ContentState,
  ContentBlock,
  RawDraftContentBlock,
} from 'draft-js';
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
  // TODO: Use setBlocks later to save edited content.
  // TIME IN MS (avoid float errors)
  const [time, setTime] = useState(0);
  const [blocks, setBlocks] = useState(transcript.blocks);
  const player = useRef<AudioPlayer>(null);

  // Populate Editor State with ContentBlocks
  const [editorState, setEditorState] = useState(() => {
    const contentBlocks = getContentBlocks(transcript);
    // @ts-ignore
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    return EditorState.createWithContent(contentState);
  });

  function setNewTime(newTime: number) {
    setTime(newTime);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = newTime / 1000;
    forceRender();
  }

  function updateTime() {
    setTime((player?.current?.audio?.current?.currentTime ?? 0) * 1000);
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

  function messageBlockRenderer(contentBlock: ContentBlock) {
    const data = contentBlock.getData();
    // @ts-ignore
    const isSelf = data.speaker === 'ch_0';
    return {
      component: Message,
      editable: false,
      props: {
        // @ts-ignore
        items: data.items,
        isSelf: isSelf,
        currentTime: time,
        setCurrTime: setNewTime,
      },
    };
  }

  function forceRender() {
    const contentState = editorState.getCurrentContent();
    const decorator = editorState.getDecorator();
    const newEditorState = EditorState.createWithContent(contentState, decorator);
    const editorStateCopy = EditorState.set(newEditorState, {
      selection: editorState.getSelection(),
      undoStack: editorState.getUndoStack(),
      redoStack: editorState.getRedoStack(),
      lastChangeType: editorState.getLastChangeType(),
    });
    setEditorState(editorStateCopy);
  }

  return (
    <div className={classes.transcript}>
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
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        stripPastedStyles
        readOnly
        blockRendererFn={messageBlockRenderer}
      />
    </div>
  );
}

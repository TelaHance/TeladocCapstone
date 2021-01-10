import React, { useState, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
  ContentBlock,
} from 'draft-js';
import Message from './Message/Message';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';
import 'draft-js/dist/Draft.css';

function getTextFromItems(items: BlockItem[]) {
  const content: string[] = [];
  items.forEach((item) => {
    content.push(item.content);
  });
  return content.join(' ');
}

function generateEntityRanges(items: BlockItem[]) {
  let position = 0;
  return items.map((item, idx) => {
    const mapping = {
      key: Math.random()
        .toString(36)
        .substr(2, 5),
      offset: position,
      length: item.content.length,
      // Additional Data
      start_time: item.start_time,
      end_time: item.end_time,
      text: item.content,
    };
    position += item.content.length + 1;
    return mapping;
  });
}

// function createEntityMap(blocks: TranscriptBlock[]) {
//   const flatten = (list) =>
//     list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

//   const entityRanges = blocks.map((block) => block.entityRanges);
//   const flatRanges = flatten(entityRanges);
//   const entityMap = {};

//   flatRanges.forEach((data) => {
//     entityMap[data.key] = {
//       type: 'WORD',
//       mutability: 'MUTABLE',
//       data,
//     };
//   });

//   return entityMap;
// }

function getContentBlocks(transcript: Transcript) {
  const blocks: ContentBlock[] = [];
  transcript.blocks.forEach((block) => {
    const draftJsContentBlock = new ContentBlock({
      type: 'paragraph',
      text: getTextFromItems(block.items),
      data: block,
      entityRanges: generateEntityRanges(block.items),
    });
    blocks.push(draftJsContentBlock);
  });
  return blocks;
}

type TranscriptProps = {
  transcript: Transcript;
  audioSrc: string;
}

export default function Transcript({ transcript, audioSrc }: TranscriptProps) {
  // TODO: Use setBlocks later to save edited content.
  const [blocks, setBlocks] = useState(transcript.blocks);
  const [time, setTime] = useState(0);
  const player = useRef<AudioPlayer>(null);

  // Populate Editor State with ContentBlocks
  const [editorState, setEditorState] = useState(() => {
    const blocks = getContentBlocks(transcript);
    const contentState = ContentState.createFromBlockArray(blocks);
    return EditorState.createWithContent(contentState);
  });

  function setNewTime(newTime: number) {
    setTime(newTime);
    if (player?.current?.audio?.current?.currentTime)
      player.current.audio.current.currentTime = newTime;
  }

  function updateTime() {
    setTime(player?.current?.audio?.current?.currentTime ?? 0);
  }

  function previous() {
    setTime(0);
    if (player?.current?.audio?.current?.currentTime)
      player.current.audio.current.currentTime = 0;
  }

  function next() {
    setTime(player?.current?.audio?.current?.duration ?? 0);
    if (player?.current?.audio?.current?.currentTime)
      player.current.audio.current.currentTime = player.current.audio.current.duration;
  }

  return (
    <div className={classes.transcript}>
      <Editor editorState={editorState} onChange={setEditorState} />
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
      <div className={classes.messages}>
        {blocks
          ? blocks.map(({ speaker, items }, idx) => {
              // TODO: Allow speaker selection between ch_0 and ch_1.
              const isSelf = speaker === 'ch_0';
              return (
                <Message
                  key={idx}
                  items={items}
                  isSelf={isSelf}
                  currentTime={time}
                  setCurrTime={setNewTime}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
  ContentBlock,
} from 'draft-js';
import PropTypes from 'prop-types';
import Message from './Message/Message';
import classes from './Transcript.module.css';
import 'react-h5-audio-player/lib/styles.css';
import 'draft-js/dist/Draft.css';

function getTextFromItems(items) {
  const content = [];
  items.forEach((item) => {
    content.push(item.content);
  });
  return content.join(' ');
}

function generateEntityRanges(items) {
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

function createEntityMap(blocks) {
  const flatten = (list) =>
    list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

  const entityRanges = blocks.map((block) => block.entityRanges);
  const flatRanges = flatten(entityRanges);
  const entityMap = {};

  flatRanges.forEach((data) => {
    entityMap[data.key] = {
      type: 'WORD',
      mutability: 'MUTABLE',
      data,
    };
  });

  return entityMap;
}

function getContentBlocks(transcript) {
  const blocks = [];
  transcript.blocks.forEach((block) => {
    blocks.push({
      type: 'paragraph',
      text: getTextFromItems(block.items),
      data: block,
      entityRanges: generateEntityRanges(block.items),
    });
  });
  return convertFromRaw({ blocks, entityMap: createEntityMap(blocks) });
}

export default function Transcript(props) {
  const { transcript, audioSrc } = props;
  // TODO: Use setBlocks later to save edited content.
  const [blocks, setBlocks] = useState(transcript.blocks);
  const [time, setTime] = useState();
  const [player, setPlayer] = useState();

  // Populate Editor State with ContentBlocks
  const [editorState, setEditorState] = useState(() => {
    const blocks = getContentBlocks(transcript);
    const contentState = ContentState.createFromBlockArray(blocks);
    return EditorState.createWithContent(contentState);
  });

  function setNewTime(newTime) {
    setTime(newTime);
    player.audio.current.currentTime = newTime;
  }

  function updateTime() {
    setTime(player?.audio?.current?.currentTime.toFixed(2) ?? 0);
  }

  function previous() {
    setTime(0);
    player.audio.current.currentTime = 0;
  }

  function next() {
    setTime(player?.audio?.current?.duration ?? 0);
    player.audio.current.currentTime = player.audio.current.duration;
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
        ref={setPlayer}
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

Transcript.propTypes = {
  transcript: PropTypes.object.isRequired,
  audioSrc: PropTypes.string.isRequired,
};

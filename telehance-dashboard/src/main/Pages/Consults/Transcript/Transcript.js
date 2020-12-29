import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import PropTypes from 'prop-types';
import Message from './Message/Message';
import classes from './Transcript.module.css';

/**
 * Transcript React Component
 * @param {Object} props
 */
export default function Transcript(props) {
  const { transcript, audioSrc } = props;
  // TODO: Use setBlocks later to save edited content.
  const [blocks, setBlocks] = useState(transcript.blocks);
  const [time, setTime] = useState();
  const [player, setPlayer] = useState();

  function handleWordClick(item) {
    if (item.type !== 'punctuation') {
      player.audio.current.currentTime = parseFloat(item.start_time);
      updateTime();
    }
  }

  function updateTime() {
    setTime(player?.audio?.current?.currentTime ?? 0);
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
                  onWordClick={handleWordClick}
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

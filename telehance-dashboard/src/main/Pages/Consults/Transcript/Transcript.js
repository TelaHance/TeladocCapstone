import React, { useState, useEffect, createRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import PropTypes from 'prop-types';
import Message from './Message/Message';
import classes from './Transcript.module.css';

/**
 * Takes in two transcript objects and converts them into message blocks, split
 * by time. Both objects must have the required fields:
 *
 * channel_label: String
 *    Name of the patient/doctor.
 * items: Array(Object)
 *    List of words/punctuations of the transcript (each non-punctuation element
 *    should include a start_time field for proper functionality).
 *
 * @param {Object} self
 *    Object for the user's side of the consult.
 * @param {Object} other
 *    Object for the other side of the consult.
 */
function getMessageBlocks(self, other) {
  const SELF_LABEL = self.channel_label;
  const OTHER_LABEL = other.channel_label;

  let idx = {
    [SELF_LABEL]: 0,
    [OTHER_LABEL]: 0,
  };

  let selfStartTime = parseFloat(self.items[0].start_time) ?? 0;
  let otherStartTime = parseFloat(other.items[0].start_time) ?? 0;
  let prevSpeaker = selfStartTime < otherStartTime ? SELF_LABEL : OTHER_LABEL;

  const blocks = [];
  let block = [];

  // Order all sentences between self and other while both have sentences to read from.
  while (
    idx[SELF_LABEL] < self.items.length &&
    idx[OTHER_LABEL] < other.items.length
  ) {
    const next_items = {
      [SELF_LABEL]: self.items[idx[SELF_LABEL]],
      [OTHER_LABEL]: other.items[idx[OTHER_LABEL]],
    };

    // start time is 0 when type is 'punctuation', since .start_time will be NULL
    selfStartTime = parseFloat(next_items[SELF_LABEL].start_time ?? 0);
    otherStartTime = parseFloat(next_items[OTHER_LABEL].start_time ?? 0);

    const speaker = selfStartTime < otherStartTime ? SELF_LABEL : OTHER_LABEL;

    if (speaker === prevSpeaker) {
      // Same speaker => Add to current block
      block.push(next_items[speaker]);
    } else {
      // Change speaker => End current block and make new block
      blocks.push({
        speaker: prevSpeaker,
        items: block,
      });
      block = [next_items[speaker]];
    }

    idx[speaker]++;
    prevSpeaker = speaker;
  }

  // Push last block from while loop.
  blocks.push({
    speaker: prevSpeaker,
    items: block,
  });
  block = [];

  // Concatenate all other sentences from either doctor or patient not reached in
  // the while loop all as one block.
  for (; idx[SELF_LABEL] < self.items.length; idx[SELF_LABEL]++) {
    block.push(self.items[idx[SELF_LABEL]]);
    prevSpeaker = SELF_LABEL;
  }
  for (; idx[OTHER_LABEL] < other.items.length; idx[OTHER_LABEL]++) {
    block.push(other.items[idx[OTHER_LABEL]]);
    prevSpeaker = OTHER_LABEL;
  }
  blocks.push({
    speaker: prevSpeaker,
    items: block,
  });

  return blocks;
}

/**
 * Transcript React Component
 * @param {Object} props
 */
export default function Transcript(props) {
  const { self, other, audioSrc } = props;
  const [blocks, setBlocks] = useState();
  const [time, setTime] = useState();
  const [player, setPlayer] = useState();

  useEffect(() => {
    setBlocks(getMessageBlocks(self, other));
  }, [self, other]);

  function handleWordClick(item) {
    if (item.type !== 'punctuation') {
      player.audio.current.currentTime = parseFloat(item.start_time);
    }
  }

  function updateTime() {
    setTime(player ? player.audio.current.currentTime : 0);
  }

  return (
    <div className={classes.transcript}>
      {blocks
        ? blocks.map(({ speaker, items }, idx) => {
            const isSelf = speaker === props.self.channel_label;
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
      <AudioPlayer src={audioSrc} listenInterval={10} onListen={updateTime} customAdditionalControls={[]} ref={setPlayer}/>
    </div>
  );
}

Transcript.propTypes = {
  self: PropTypes.object.isRequired,
  other: PropTypes.object.isRequired,
  audioSrc: PropTypes.string.isRequired,
};

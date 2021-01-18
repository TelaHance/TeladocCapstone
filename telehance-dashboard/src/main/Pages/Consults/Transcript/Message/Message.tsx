import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ContentBlock, ContentState, EditorBlock } from 'draft-js';
import classes from './Message.module.css';
import './draftjs-overrides.css';

type MessageProps = {
  block: ContentBlock;
  contentState: ContentState;
  blockProps: {
    currentTime: number;
    setCurrTime: (newTime: number) => void;
    userSpeakerLabel: string;
  };
};

export default function Message(props: MessageProps) {
  const { block, contentState, blockProps } = props;
  const words = block.getData().get('words') as Word[];
  const speaker = block.getData().get('speaker') as string;

  // When first render cycle uses empty content state.
  if (words === undefined) {
    return null;
  }

  const { currentTime, setCurrTime, userSpeakerLabel } = blockProps;
  const [currWordIdx, setCurrWordIdx] = useState(-1);

  const isSelf = userSpeakerLabel === speaker;

  // Update current word when media is playing.
  // useEffect(() => {
  //   const messageStartTime = words[0].start;
  //   const messageEndTime = words[words.length - 1].end;

  //   // Determine if the current time is within this message block, and set the
  //   // state variables accordingly.
  //   if (messageStartTime <= currentTime && currentTime < messageEndTime) {
  //     const currIdx = words.findIndex(
  //       (word) => word.start_time <= currentTime && currentTime < word.end_time
  //     );
  //     setCurrWordIdx(currIdx);
  //   } else {
  //     setCurrWordIdx(-1);
  //   }
  // }, [currentTime, words]);

  // function handleWordClick(word: Word) {
  //   const newIdx = words.indexOf(word);
  //   setCurrWordIdx(newIdx);
  //   setCurrTime(word.start_time);
  // }

  return (
    <div
      className={clsx(classes.message, {
        [classes.self]: isSelf,
        [classes.other]: !isSelf,
      })}
    >
      <EditorBlock {...props} />
    </div>
  );

  // return (
  //   <div
  //     className={clsx(classes.message, {
  //       [classes.self]: isSelf,
  //       [classes.other]: !isSelf,
  //     })}
  //   >
  //     {words
  //       ? words.map((word, idx) => {
  //           // Put span with " " before words (except for first)
  //           const spacing = idx === 0 ? null : <span> </span>;
  //           return (
  //             <React.Fragment key={idx}>
  //               {spacing}
  //               <span
  //                 className={clsx(classes.item, {
  //                   [classes.highlight]: currWordIdx === idx,
  //                 })}
  //                 onDoubleClick={() => handleWordClick(word)}
  //               >
  //                 {word.text}
  //               </span>
  //             </React.Fragment>
  //           );
  //         })
  //       : null}
  //   </div>
  // );
}

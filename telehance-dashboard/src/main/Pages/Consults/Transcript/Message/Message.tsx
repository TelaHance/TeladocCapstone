import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import classes from './Message.module.css';
import './draftjs-overrides.css';

type BlockStyleProps = {
  blockProps: MessageProps;
};

type MessageProps = {
  items: BlockItem[];
  isSelf: boolean;
  currentTime: number;
  setCurrTime: (newTime: number) => void;
};

export default function Message({ blockProps }: BlockStyleProps) {
  const { items, isSelf, currentTime, setCurrTime } = blockProps;
  const [currWordIdx, setCurrWordIdx] = useState(-1);

  // Update current word when media is playing.
  useEffect(() => {
    const messageStartTime = items[0].start_time;
    const messageEndTime = items[items.length - 1].end_time;

    // Determine if the current time is within this message block, and set the
    // state variables accordingly.
    if (
      messageStartTime * 1000 <= currentTime &&
      currentTime < messageEndTime * 1000
    ) {
      const currIdx = items.findIndex(
        (item) =>
          item.start_time * 1000 <= currentTime &&
          currentTime < item.end_time * 1000
      );
      setCurrWordIdx(currIdx);
    } else {
      setCurrWordIdx(-1);
    }
  }, [currentTime, items]);

  function handleWordClick(item: BlockItem) {
    const newIdx = items.indexOf(item);
    setCurrWordIdx(newIdx);
    setCurrTime(item.start_time * 1000);
  }

  return (
    <div
      className={clsx(classes.message, {
        [classes.self]: isSelf,
        [classes.other]: !isSelf,
      })}
    >
      {items
        ? items.map((item, idx) => {
            // Put span with " " before words (except for first)
            const spacing = idx === 0 ? null : <span> </span>;
            return (
              <React.Fragment key={idx}>
                {spacing}
                <span
                  className={clsx(classes.item, {
                    [classes.highlight]: currWordIdx === idx,
                  })}
                  onDoubleClick={() => handleWordClick(item)}
                >
                  {item.content}
                </span>
              </React.Fragment>
            );
          })
        : null}
    </div>
  );
}

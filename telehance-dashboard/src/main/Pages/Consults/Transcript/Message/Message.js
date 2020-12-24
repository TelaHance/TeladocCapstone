import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import classes from './Message.module.css';

function getMessageEndTime(items) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].end_time) {
      return parseFloat(items[i].end_time);
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Message(props) {
  const { items, isSelf, currentTime, onWordClick } = props;
  const [currWordIdx, setCurrWordIdx] = useState();

  useEffect(() => {
    const messageStartTime = parseFloat(items[0].start_time);
    const messageEndTime = getMessageEndTime(items);

    // Determine if the current time is within this message block, and set the
    // state variables accordingly.
    if (messageStartTime <= currentTime && currentTime < messageEndTime) {
      const currIdx = items.findIndex(
        (item) =>
          item.type !== 'punctuation' &&
          item.start_time <= currentTime &&
          currentTime < item.end_time
      );
      setCurrWordIdx(currIdx);
    } else {
      setCurrWordIdx(-1);
    }
  }, [currentTime, items]);

  return (
    <div
      className={clsx(classes.message, {
        [classes.self]: isSelf,
        [classes.other]: !isSelf,
      })}
    >
      {items
        ? items.map((item, idx) => {
            const spacing =
              idx === 0 || item.type === 'punctuation' ? null : <span> </span>;
            const text = item.alternatives[0].content;
            return (
              <>
                {spacing}
                <span
                  key={idx}
                  className={clsx(classes.item, {
                    [classes.punctuation]: item.type === 'punctuation',
                    [classes.highlight]: currWordIdx === idx,
                  })}
                  onClick={() => onWordClick(item)}
                >
                  {idx === 0 ? capitalize(text) : text}
                </span>
              </>
            );
          })
        : null}
    </div>
  );
}

Message.propTypes = {
  items: PropTypes.array.isRequired,
  isSelf: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  onWordClick: PropTypes.func.isRequired,
};

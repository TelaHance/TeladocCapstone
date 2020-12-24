import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import classes from './Message.module.css';

function getMessageEndTime(items) {
  for (let i = items.length - 1; i > 0; i--) {
    if (items[i].end_time) return items[i].end_time;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function itemsToJSX(items, removeFirstSpace=false) {
  if (items === null) {
    return <span />;
  }
  return items.map((item, idx) => {
    const spacing = (removeFirstSpace && idx === 0) || item.type === 'punctuation' ? '' : ' ';
    const text = item.alternatives[0].content;
    return (
      <span>
        {spacing}
        {idx === 0 ? capitalize(text) : text}
      </span>
    );
  });
}

export default function Message(props) {
  const { items, isSelf, currentTime, onWordClick } = props;

  const [prevWords, setPrevWords] = useState([]);
  const [currWord, setCurrWord] = useState(null);
  const [nextWords, setNextWords] = useState([]);

  useEffect(() => {
    const messageStartTime = items[0].start_time;
    const messageEndTime = getMessageEndTime(items);

    // Determine if the current time is within this message block, and set the
    // state variables accordingly.
    if (messageStartTime <= currentTime && currentTime <= messageEndTime) {
      setPrevWords(items.filter((item) => item.end_time < currentTime));
      setCurrWord(items[prevWords.length]);
      setNextWords(items.filter((item) => item.end_time > currentTime));
    } else if (currentTime < messageStartTime) {
      setNextWords(items);
    } else {
      setPrevWords(items);
    }
  }, [currentTime, items]);

  // TODO: Apply styles to currWord
  return (
    <p
      className={clsx(classes.message, {
        [classes.self]: isSelf,
        [classes.other]: !isSelf,
      })}
    >
      {itemsToJSX(prevWords, true)}
      {itemsToJSX(currWord)}
      {itemsToJSX(nextWords)}
    </p>
  );
}

Message.propTypes = {
  items: PropTypes.object.isRequired,
  isSelf: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  onWordClick: PropTypes.func.isRequired,
};

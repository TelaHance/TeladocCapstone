import React, { useState, useEffect, useRef } from 'react';
import H5AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import classes from './AudioPlayer.module.css';
import 'react-h5-audio-player/lib/styles.css';
import './overrides.css';

export default function AudioPlayer({
  src,
  startFrom,
  startTimes,
  setCurrWordStartTime,
}: AudioPlayerProps) {
  const player = useRef<H5AudioPlayer>(null);

  // States for keeping track of which word is active
  const [time, setTime] = useState(0); // Current playback time in ms (minimize float errors)
  const [currWordIdx, setCurrWordIdx] = useState(0); // Where in startTimes the current word lies

  useEffect(() => {
    setTime(startFrom);
    setPlayerTime(startFrom);
  }, [startFrom]);

  // Effect for updating the current word
  useEffect(() => {
    // Index of the closest *real* start time at least as large as it.
    const closestTimeIdx =
      startTimes.findIndex((startTime) => time < startTime) - 1;
    // If idx out of range (may occur due to floating point errors)
    const nextWordIdx =
      closestTimeIdx < 0 ? startTimes.length - 1 : closestTimeIdx;
    if (currWordIdx !== nextWordIdx) {
      setCurrWordIdx(nextWordIdx);
      setCurrWordStartTime(startTimes[nextWordIdx]);
    }
  }, [time, startTimes]);

  function getPlayerTime() {
    return Math.round(
      (player?.current?.audio?.current?.currentTime ?? 0) * 1000
    );
  }

  function setPlayerTime(newTime: number) {
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime = newTime / 1000;
  }

  function updateTime() {
    setTime(getPlayerTime());
  }

  function previous() {
    setTime(0);
    setPlayerTime(0);
  }

  function next() {
    setTime((player?.current?.audio?.current?.duration ?? 0) * 1000);
    if (player?.current?.audio?.current?.currentTime !== undefined)
      player.current.audio.current.currentTime =
        player.current.audio.current.duration;
  }

  return (
    <H5AudioPlayer
      src={src}
      listenInterval={50}
      onListen={updateTime}
      customProgressBarSection={[
        RHAP_UI.MAIN_CONTROLS,
        RHAP_UI.CURRENT_TIME,
        RHAP_UI.PROGRESS_BAR,
        RHAP_UI.DURATION,
        RHAP_UI.VOLUME_CONTROLS,
      ]}
      customControlsSection={[]}
      customAdditionalControls={[]}
      showJumpControls={false}
      className={classes.container}
      ref={player}
      // layout='horizontal'
    />
  );
}

export type AudioPlayerProps = {
  src?: string;
  startFrom: number;
  startTimes: number[];
  setCurrWordStartTime: React.Dispatch<React.SetStateAction<number>>;
};

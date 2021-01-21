function getWordsBetweenTimes(words: Word[], start: number, end: number) {
  return words.filter((word) => start <= word.start && word.end <= end);
}

function retimeSection(wordsBeforeSplit: Word[], wordsAfterSplit: Word[]) {
  const retimedWords = JSON.parse(JSON.stringify(wordsAfterSplit)); // Deep Copy
  // If before / after have same number of words, apply the timings from the original.
  if (wordsBeforeSplit.length === wordsAfterSplit.length) {
    for (let i = 0; i < retimedWords.length; i++) {
      retimedWords[i].start = wordsBeforeSplit[i].start;
      retimedWords[i].end = wordsBeforeSplit[i].end;
      delete retimedWords[i].splitIdx;
    }
    return retimedWords;
  }

  // If before / after have different number of words, infer timings based on
  // relative length.
  let totalLength = 0;
  for (let word of wordsAfterSplit) {
    totalLength += word.text.length;
  }
  let start = wordsAfterSplit[0].start;
  const duration = wordsAfterSplit[wordsAfterSplit.length - 1].end - start;
  for (let word of retimedWords) {
    word.start = start;
    // Set start for next segment and as end of current segment.
    start += Math.round((word.text.length * duration) / totalLength);
    word.end = start;
  }

  return retimedWords;
}

export function retimeAll(originalValue: Message[], value: Message[]) {
  const retimedValue: Message[] = [];

  for (let i = 0; i < value.length; i++) {
    let retimedWords: Word[] = []; // Keeps track of all new words, after retiming those in wordsAfterSplit.
    let wordsAfterSplit: Word[] = []; // Keeps track of words belonging to the same split segment.

    const origWords = originalValue[i].children;
    const newWords = value[i].children;

    for (let word of newWords) {
      const { splitIdx } = word;
      // Word is part of a split section.
      if (typeof splitIdx === 'number') {
        // Handle start of new split section.
        if (splitIdx === 0) {
          // End any previous split sections.
          if (wordsAfterSplit.length > 0) {
            const { start } = wordsAfterSplit[0];
            const { end } = wordsAfterSplit[wordsAfterSplit.length - 1];
            const wordsBeforeSplit = getWordsBetweenTimes(
              origWords,
              start,
              end
            );
            retimedWords = retimedWords.concat(
              retimeSection(wordsBeforeSplit, wordsAfterSplit)
            );
          }
          wordsAfterSplit = [word];
        }
        // Handle traversing the split section.
        else {
          wordsAfterSplit.push(word);
        }
      }
      // Word is not part of a split section.
      else {
        // Handle when the word directly follows a split section.
        if (wordsAfterSplit.length > 0) {
          const { start } = wordsAfterSplit[0];
          const { end } = wordsAfterSplit[wordsAfterSplit.length - 1];
          const wordsBeforeSplit = getWordsBetweenTimes(origWords, start, end);
          retimedWords = retimedWords.concat(
            retimeSection(wordsBeforeSplit, wordsAfterSplit)
          );
          wordsAfterSplit = [];
        }
        retimedWords.push(word);
      }
    }
    // Handle when the split section is at the end of the word collection.
    if (wordsAfterSplit.length > 0) {
      const { start } = wordsAfterSplit[0];
      const { end } = wordsAfterSplit[wordsAfterSplit.length - 1];
      const wordsBeforeSplit = getWordsBetweenTimes(origWords, start, end);
      retimedWords = retimedWords.concat(
        retimeSection(wordsBeforeSplit, wordsAfterSplit)
      );
    }
    const messageCopy = JSON.parse(JSON.stringify(value[i]));
    messageCopy.children = retimedWords;
    retimedValue.push(messageCopy);
  }

  return retimedValue;
}

export function getStartTimes(value: Message[]) {
  const startTimes = value
    .map((message) => message.children.map((word) => word.start))
    .flat();

  // This will ensure that the first word is not highlighted when the playback begins.
  startTimes.unshift(0);
  // This will ensure that the last word is not highlighted when the playback ends.
  const lastMessage = value[value.length - 1].children;
  const transcriptEndTime = lastMessage[lastMessage.length - 1].end;
  startTimes.push(transcriptEndTime);

  return startTimes;
}
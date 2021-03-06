import React from 'react';
import Stat from '../stat/Stat'


const calculateAverageDialogueLength = a => {
  const dialogues = a.filter(a => a.type === 'dialogue');
  // Gets average, and rounds. Sums wordCounts, and devides by length.
  return Math.round(dialogues.reduce((a, c) => a + c.wordCount, 0) / dialogues.length);
}

const DialogLength = props =>
  <Stat.Text title="Words Per Balloon">
    {calculateAverageDialogueLength(props.stats) || "0"}
  </Stat.Text>

export default DialogLength;

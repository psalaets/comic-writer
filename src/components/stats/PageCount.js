import React from 'react';
import Stat from '../stat/Stat'

const calculatePageCount = a => a.filter(a => a.type === 'page').length;

const PageCount = props =>
  <Stat.Text title="Page Count">
    {calculatePageCount(props.stats)}
  </Stat.Text>

export default PageCount;

import React from 'react';
import './FormattingGuide.css';

import FormattingGuideData, { GuideItem } from '../../documentation/FormattingGuideData';

function toElements(data: Array<GuideItem>): Array<Array<React.ReactNode>> {
  return data.map((a, i) => [
    <dt key={i} className="c-formatting-guide__title u-font-size--saya">{a.title}</dt>,
    <dd key={i + 1} className="c-formatting-guide__description">
      <pre className="c-formatting-guide__code">{a.code}</pre>
    </dd>
  ]);
}

const FormattingGuide = () => (
  <>
    <dl className="c-formatting-guide">
      {toElements(FormattingGuideData)}
    </dl>
    <hr/>
    <a href="https://gitlab.com/comic-writer/comic-writer/blob/master/src/documentation/readme.md"
      rel="noopener noreferrer"
      target="_blank"
    >Need More Help?</a>
  </>
);

export default FormattingGuide;

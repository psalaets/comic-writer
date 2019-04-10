import React from 'react';
import './FormattingGuide.css';

import FormattingGuideData from '../../documentation/FormattingGuideData'

const GuideDataToJSX = data => data.map((a, i) => [
  <dt key={i} className="c-formatting-guide__title u-font-size--saya">{a.title}</dt>,
  <dd key={i + 1} className="c-formatting-guide__description">
    <pre className="c-formatting-guide__code">{a.code}</pre>
  </dd>
]);

const FormattingGuide = props => (
  <>
    <dl className="c-formatting-guide">
      {GuideDataToJSX(FormattingGuideData)}
    </dl>
    <hr/>
    <a href="https://gitlab.com/psalaets/comic-writer/blob/master/src/documentation/readme.md"
      rel="noopener noreferrer"
      target="_blank"
    >Need More Help?</a>
  </>
);

export default FormattingGuide;

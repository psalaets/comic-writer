import React from 'react';
import Button from '../button/Button';
import MenuBar from '../menu-bar/MenuBar';
import Script from '../pdf/Script';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export default function TopBar(props) {
  const {
    parseResult,
    onGuideClick,
    onInsightsClick,
    drawerOpen
  } = props;

  function handlePdfClick() {
    pdf(<Script nodes={parseResult} />)
      .toBlob()
      .then(blob => saveAs(blob, 'script.pdf'));
  }

  return (
    <MenuBar.Container primary>
      <h1 className="u-font-size--maria">Comic Writer <sup aria-hidden="true" className="u-font-size--saya">αlρhα</sup></h1>
      <MenuBar.Spacer />
      <Button onClick={onGuideClick} transparent>Guide</Button>
      <Button onClick={onInsightsClick} isActive={drawerOpen} transparent>Insights</Button>
      <Button onClick={handlePdfClick} transparent>PDF</Button>
    </MenuBar.Container>
  );
}

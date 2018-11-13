// parser state - keeps track of stuff while parsing through script input

export function create() {
  let pageNumber = 0;
  let panelNumber = 0;
  let letteringNumber = 0;

  let metadataNumber = 0;
  let paragraphNumber = 0;

  return {
    startNewPage() {
      pageNumber += 1;
      panelNumber = 0;
      letteringNumber = 0;
    },
    startNewPanel() {
      panelNumber += 1;
    },
    startNewLettering() {
      letteringNumber += 1;
    },
    startNewMetadata() {
      metadataNumber += 1;
    },
    startNewParagraph() {
      paragraphNumber += 1;
    },
    get currentLetteringNumber() {
      return letteringNumber;
    },
    get currentPageId() {
      return String(pageNumber);
    },
    get currentPanelId() {
      return `${this.currentPageId}.${panelNumber}`;
    },
    get currentLetteringId() {
      return `${this.currentPanelId}.${letteringNumber}`;
    },
    get currentMetadataId() {
      return `metadata-${metadataNumber}`;
    },
    get currentParagraphId() {
      return `paragraph-${paragraphNumber}`;
    }
  };
}
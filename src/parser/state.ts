// parser state - keeps track of stuff while parsing through script input

export interface ParserState {
  currentSpreadLabel: string;
  currentSpreadId: string;
  currentLetteringNumber: number;
  currentPageId: string;
  currentPanelId: string;
  currentLetteringId: string;
  currentMetadataId: string;
  currentParagraphId: string;

  startNewSpread(pageCount: number): void;
  startNewPage(): void;
  startNewPanel(): void;
  startNewLettering(): void;
  startNewMetadata(): void;
  startNewParagraph(): void;
}

export function create(): ParserState {
  let pagesSeen = 0;
  let pageNumber = 0;
  let panelNumber = 0;
  let letteringNumber = 0;

  let metadataNumber = 0;
  let paragraphNumber = 0;

  let spreadLabel = '';

  return {
    startNewSpread(pageCount) {
      spreadLabel = pageCount === 1
        ? String(pagesSeen + 1)
        : `${pagesSeen + 1}-${pagesSeen + pageCount}`;

      pagesSeen += pageCount;
      panelNumber = 0;
      letteringNumber = 0;
    },
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
    get currentSpreadLabel() {
      return spreadLabel;
    },
    get currentSpreadId() {
      return this.currentSpreadLabel;
    },
    get currentLetteringNumber() {
      return letteringNumber;
    },
    get currentPageId() {
      return String(pageNumber);
    },
    get currentPanelId() {
      return `${this.currentSpreadId}.${panelNumber}`;
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
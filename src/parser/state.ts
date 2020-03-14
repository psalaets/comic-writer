// parser state - keeps track of stuff while parsing through script input

export class ParserState {
  pagesSeen = 0;
  spreadLabel = '';

  spreadNumber = 0;
  panelNumber = 0;
  letteringNumber = 0;
  metadataNumber = 0;
  paragraphNumber = 0;

  startNewSpread(pageCount: number): void {
    this.spreadLabel = pageCount === 1
      ? String(this.pagesSeen + 1)
      : `${this.pagesSeen + 1}-${this.pagesSeen + pageCount}`;

    this.pagesSeen += pageCount;

    this.spreadNumber += 1;
    this.panelNumber = 0;
    this.letteringNumber = 0;
  }

  startNewPanel(): void {
    this.panelNumber += 1;
  }

  startNewLettering(): void {
    this.letteringNumber += 1;
  }

  startNewMetadata(): void {
    this.metadataNumber += 1;
  }

  startNewParagraph(): void {
    this.paragraphNumber += 1;
  }

  get currentSpreadLabel(): string {
    return this.spreadLabel;
  }

  get currentLetteringNumber(): number {
    return this.letteringNumber;
  }

  get currentSpreadId(): string {
    return `spread-${this.spreadNumber}`;
  }

  get currentPanelId(): string {
    return `panel-${this.panelNumber}`;
  }

  get currentLetteringId(): string {
    return `lettering-${this.letteringNumber}`;
  }

  get currentMetadataId(): string {
    return `metadata-${this.metadataNumber}`;
  }

  get currentParagraphId(): string {
    return `paragraph-${this.paragraphNumber}`;
  }
}

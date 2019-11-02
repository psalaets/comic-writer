export default function createAutoNumber() {
  let pagesInComic = 0;
  let panelsInPage = 0;

  return function autoNumber(lineClassification) {
    const { line, type, count } = lineClassification;

    if (type === 'single-page') {
      pagesInComic += 1;
      panelsInPage = 0;

      return `Page ${pagesInComic}`;
    }

    if (type ===  'multi-page') {
      const startPage = pagesInComic + 1;
      panelsInPage = 0;

      if (count > 1) {
        pagesInComic += count;

        return `Pages ${startPage}-${pagesInComic}`;
      } else {
        return line;
      }
    }

    if (type === 'invalid-page-range') {
      pagesInComic += 2;
      panelsInPage = 0;

      return line;
    }

    if (type === 'partial-page-range') {
      pagesInComic += 1;
      panelsInPage = 0;

      return `Pages ${pagesInComic}-`;
    } else if (type === 'panel') {
      panelsInPage += 1;

      return `Panel ${panelsInPage}`;
    } else {
      return line;
    }
  };
}

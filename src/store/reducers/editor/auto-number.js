export default function createAutoNumber() {
  let pagesInComic = 0;
  let panelsInPage = 0;

  return function autoNumber(lineClassification) {
    const { line, type, count } = lineClassification;

    if (type === 'page') {
      pagesInComic += 1;
      panelsInPage = 0;

      const startPage = pagesInComic;

      if (count === 1) {
        return `Page ${startPage}`;
      } else if (count > 1) {
        pagesInComic += count - 1;
        const endPage = pagesInComic;

        return `Pages ${startPage}-${endPage}`;
      } else {
        return line;
      }
    } else if (type === 'partial-page') {
      pagesInComic += 1;
      panelsInPage = 0;

      const startPage = pagesInComic;

      return `Page ${startPage}-`;
    } else if (type === 'panel') {
      panelsInPage += 1;

      return `Panel ${panelsInPage}`;
    } else {
      return line;
    }
  };
}

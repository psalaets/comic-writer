export function capitalizeLetteringMetadata(line: string): string {
  if (line[0] === '\t') {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      return line.slice(0, colonIndex).toUpperCase() + line.slice(colonIndex);
    }
  }

  return line;
}

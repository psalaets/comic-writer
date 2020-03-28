export function* iterator<T>(
  preSpreadNodes: Array<T>,
  nodesBySpread: Array<Array<T>>
) {
  for (const node of preSpreadNodes) {
    yield node;
  }

  for (const nodes of nodesBySpread) {
    for (const node of nodes) {
      yield node;
    }
  }
}

export function* iterator<T>(
  preSpreadNodes: Array<T>,
  nodesBySpread: Array<Array<T>>
) {
  for (const node of preSpreadNodes) {
    yield node;
  }

  for (const nodesOfSpread of nodesBySpread) {
    for (const node of nodesOfSpread) {
      yield node;
    }
  }
}

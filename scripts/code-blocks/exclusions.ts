const exclusionMarkers = new Set(["// exclude-from-type-checking", "# exclude-from-type-checking"]);
const markerText = "exclude-from-type-checking";

export interface ExclusionMarkers {
  isExcluded: boolean;
  misplacedLineIndexes: number[];
}

export function parseExclusionMarkers(value: string): ExclusionMarkers {
  const lines = value.split("\n");
  const isExcluded = exclusionMarkers.has(lines[0]);
  const misplacedLineIndexes: number[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].includes(markerText) && !(index === 0 && isExcluded)) {
      misplacedLineIndexes.push(index);
    }
  }

  return { isExcluded, misplacedLineIndexes };
}

export function isExcludedFromTypeChecking(value: string): boolean {
  return parseExclusionMarkers(value).isExcluded;
}

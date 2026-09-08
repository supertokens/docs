const exclusionMarkers = new Set(["// exclude-from-type-checking", "# exclude-from-type-checking"]);
const markerText = "exclude-from-type-checking";

export interface CheckableCodeBlock {
  meta: string | undefined;
  value: string;
}

export interface FenceMetadataAttribute {
  name: string;
  value: string | undefined;
  quote: '"' | "'" | undefined;
  closed: boolean;
}

export interface FenceMetadataParseResult {
  attributes: FenceMetadataAttribute[];
  errors: string[];
}

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

export function parseFenceMetadata(meta: string | undefined): FenceMetadataParseResult {
  if (!meta) return { attributes: [], errors: [] };

  const attributes: FenceMetadataAttribute[] = [];
  const errors: string[] = [];
  let index = 0;

  while (index < meta.length) {
    while (index < meta.length && /\s/.test(meta[index])) index += 1;
    if (index >= meta.length) break;

    if (meta[index] === "{") {
      const closingBrace = meta.indexOf("}", index + 1);
      if (closingBrace === -1) {
        errors.push("unclosed code fence metadata group");
        break;
      }
      index = closingBrace + 1;
      if (index < meta.length && !/\s/.test(meta[index])) {
        errors.push("code fence metadata entries must be separated by whitespace");
        while (index < meta.length && !/\s/.test(meta[index])) index += 1;
      }
      continue;
    }

    if (!/[A-Za-z_]/.test(meta[index])) {
      errors.push(`unexpected code fence metadata punctuation '${meta[index]}'`);
      while (index < meta.length && !/\s/.test(meta[index])) index += 1;
      continue;
    }

    const nameStart = index;
    index += 1;
    while (index < meta.length && /[\w-]/.test(meta[index])) index += 1;
    const name = meta.slice(nameStart, index);

    if (index >= meta.length || /\s/.test(meta[index])) {
      attributes.push({ name, value: undefined, quote: undefined, closed: true });
      continue;
    }
    if (meta[index] !== "=") {
      errors.push(`unexpected punctuation after code fence metadata attribute '${name}'`);
      while (index < meta.length && !/\s/.test(meta[index])) index += 1;
      continue;
    }

    index += 1;
    if (index >= meta.length || /\s/.test(meta[index])) {
      attributes.push({ name, value: "", quote: undefined, closed: true });
      continue;
    }

    const quote = meta[index] === '"' || meta[index] === "'" ? meta[index] : undefined;
    if (!quote) {
      const valueStart = index;
      while (index < meta.length && !/\s/.test(meta[index])) index += 1;
      attributes.push({ name, value: meta.slice(valueStart, index), quote: undefined, closed: true });
      continue;
    }

    index += 1;
    const valueStart = index;
    while (index < meta.length && !(meta[index] === quote && !isEscaped(meta, index))) index += 1;
    const closed = index < meta.length;
    attributes.push({ name, value: meta.slice(valueStart, index), quote, closed });

    if (!closed) {
      errors.push(`unclosed quoted value for code fence metadata attribute '${name}'`);
      break;
    }

    index += 1;
    if (index < meta.length && !/\s/.test(meta[index])) {
      errors.push("code fence metadata entries must be separated by whitespace");
      while (index < meta.length && !/\s/.test(meta[index])) index += 1;
    }
  }

  return { attributes, errors };
}

function isEscaped(value: string, index: number): boolean {
  let backslashCount = 0;
  for (let cursor = index - 1; cursor >= 0 && value[cursor] === "\\"; cursor -= 1) backslashCount += 1;
  return backslashCount % 2 === 1;
}

const safeReasonPattern = /^[A-Za-z0-9][A-Za-z0-9 .,;:!?()/_+-]*$/;

export function getFenceMetadataViolations(meta: string | undefined): string[] {
  const parsed = parseFenceMetadata(meta);
  const violations = [...parsed.errors];
  const checkAttributes = parsed.attributes.filter((attribute) => attribute.name === "check");
  const reasonAttributes = parsed.attributes.filter((attribute) => attribute.name === "reason");

  if (checkAttributes.length > 1) violations.push("code fence metadata must contain exactly one check attribute");
  for (const attribute of checkAttributes) {
    if (attribute.value !== "false" || attribute.quote !== undefined || !attribute.closed) {
      violations.push("unsupported check metadata value; use check=false");
    }
  }

  if (reasonAttributes.length > 0 && checkAttributes.length === 0) {
    violations.push("reason metadata requires check=false");
  }
  if (checkAttributes.length > 0 && reasonAttributes.length !== 1) {
    violations.push('check=false requires exactly one reason="..." attribute');
  }
  for (const attribute of reasonAttributes) {
    if (
      attribute.quote !== '"' ||
      !attribute.closed ||
      !attribute.value?.trim() ||
      !safeReasonPattern.test(attribute.value)
    ) {
      violations.push(
        "reason must be a closed, non-empty double-quoted value using only letters, numbers, spaces, and . , ; : ! ? ( ) / _ + -",
      );
    }
  }

  return violations;
}

function hasValidMetadataExclusion(meta: string | undefined): boolean {
  const { attributes } = parseFenceMetadata(meta);
  const checkAttributes = attributes.filter((attribute) => attribute.name === "check");
  const reasonAttributes = attributes.filter((attribute) => attribute.name === "reason");
  return (
    checkAttributes.length === 1 &&
    checkAttributes[0].value === "false" &&
    checkAttributes[0].quote === undefined &&
    reasonAttributes.length === 1
  );
}

export function isExcludedFromChecking(block: CheckableCodeBlock): boolean {
  if (getFenceMetadataViolations(block.meta).length > 0) return false;
  return hasValidMetadataExclusion(block.meta) || isExcludedFromTypeChecking(block.value);
}

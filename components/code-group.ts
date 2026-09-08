export type CodeGroupMaxHeight = `${number}${"px" | "rem" | "em" | "vh" | "dvh" | "svh" | "lvh"}`;

const codeGroupMaxHeightPattern = /^(?:0|[1-9]\d*)(?:\.\d+)?(?:px|rem|em|vh|dvh|svh|lvh)$/u;

export const validateCodeGroupMaxHeight = (value: string | undefined): CodeGroupMaxHeight | undefined => {
  if (value === undefined) return undefined;
  if (codeGroupMaxHeightPattern.test(value)) return value as CodeGroupMaxHeight;

  throw new Error(
    `Invalid CodeGroup maxHeight "${value}". Expected a non-negative number followed by px, rem, em, vh, dvh, svh, or lvh.`,
  );
};

export type Repository = {
  url: string;
  // Files from where references should be extracted
  files: {
    path: string;
    // An alias that will be used to prefix references from this file
    alias?: string;
    // Specific symbols to extract
    extract?: string[];
  }[];
  name: string;
  language: "typescript";
};

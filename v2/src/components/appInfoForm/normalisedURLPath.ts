// this is the same path normalisation code as used in the supertokens-node SDK
// for reference: https://github.com/supertokens/supertokens-node/blob/master/lib/ts/normalisedURLPath.ts

export default class NormalisedURLPath {
  private value: string;

  constructor(url: string) {
    this.value = normaliseURLPathOrThrowError(url);
  }

  startsWith = (other: NormalisedURLPath) => {
    return this.value.startsWith(other.value);
  };

  appendPath = (other: NormalisedURLPath) => {
    return new NormalisedURLPath(this.value + other.value);
  };

  getAsStringDangerous = () => {
    return this.value;
  };

  equals = (other: NormalisedURLPath) => {
    return this.value === other.value;
  };

  isARecipePath = () => {
    return this.value === "/recipe" || this.value.startsWith("/recipe/");
  };
}

function normaliseURLPathOrThrowError(input: string): string {
  input = input.trim().toLowerCase();

  try {
    if (!input.startsWith("http://") && !input.startsWith("https://")) {
      throw new Error("converting to proper URL");
    }
    let urlObj = new URL(input);
    input = urlObj.pathname;

    if (input.charAt(input.length - 1) === "/") {
      return input.substr(0, input.length - 1);
    }

    return input;
  } catch (err) { }
  // not a valid URL

  // If the input contains a . it means they have given a domain name.
  // So we try assuming that they have given a domain name + path
  if (
    (domainGiven(input) || input.startsWith("localhost")) &&
    !input.startsWith("http://") &&
    !input.startsWith("https://")
  ) {
    input = "http://" + input;
    return normaliseURLPathOrThrowError(input);
  }

  if (input.charAt(0) !== "/") {
    input = "/" + input;
  }

  // at this point, we should be able to convert it into a fake URL and recursively call this function.
  try {
    // test that we can convert this to prevent an infinite loop
    new URL("http://example.com" + input);

    return normaliseURLPathOrThrowError("http://example.com" + input);
  } catch (err) {
    throw Error("Please provide a valid URL path");
  }
}

function domainGiven(input: string): boolean {
  // If no dot, return false.
  if (input.indexOf(".") === -1 || input.startsWith("/")) {
    return false;
  }

  try {
    let url = new URL(input);
    return url.hostname.indexOf(".") !== -1;
  } catch (ignored) { }

  try {
    let url = new URL("http://" + input);
    return url.hostname.indexOf(".") !== -1;
  } catch (ignored) { }

  return false;
}
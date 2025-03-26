import * as fs from "fs";
import * as util from "util";

import { file } from "bun";

// Synchronous version
function readFileSegmentSync(filePath: string, startOffset: number, endOffset: number): string | null {
  try {
    // Open file
    const fileDescriptor = fs.openSync(filePath, "r");

    // Calculate segment length
    const segmentLength = endOffset - startOffset;

    // Create buffer to read segment
    const buffer = Buffer.alloc(segmentLength);

    // Read segment
    fs.readSync(fileDescriptor, buffer, 0, segmentLength, startOffset);

    // Close file descriptor
    fs.closeSync(fileDescriptor);

    // Convert buffer to string
    return buffer.toString("utf-8");
  } catch (error) {
    console.error("Error reading file segment:", error);
    return null;
  }
}

// Asynchronous version using Promises
async function readFileSegment(filePath: string, startOffset: number, endOffset: number): Promise<string | null> {
  const fileHandle = file(filePath);
  const segmentLength = endOffset - startOffset;

  const fileArrayBuffer = await fileHandle.arrayBuffer();

  const content = fileArrayBuffer.slice(startOffset, endOffset);
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(content);
}

// Example usage
async function demonstrateUsage() {
  // Synchronous usage
  // const syncContent = readFileSegmentSync(
  //   "/Users/bogdan/src/supertokens/docs/v3/docs/quickstart/backend-setup.mdx",
  //   10880,
  //   11506,
  // );
  // console.log("Sync content:", syncContent);

  // Asynchronous usage
  const asyncContent = await readFileSegment(
    "/Users/bogdan/src/supertokens/docs/v3/docs/quickstart/backend-setup.mdx",
    10880 + 4 + 6,
    11506,
  );
  console.log(asyncContent);
}

demonstrateUsage();

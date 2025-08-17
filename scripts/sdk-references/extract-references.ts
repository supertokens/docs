import { $, file, write } from "bun";
import { mkdir, exists } from "node:fs/promises";

import { Repository } from "./types";

const TMP_DIR_PATH = "./tmp";

export abstract class ExtractSDKReferences {
  repository: Repository;

  //  Extracts references and writes the to a json file
  async extract() {}

  async cloneRepository(repository: Repository): Promise<void> {
    const repositoryDirectoryPath = `./${TMP_DIR_PATH}/${repository.name}`;
    const repositoryDirectoryExists = await exists(repositoryDirectoryPath);
    if (repositoryDirectoryExists) {
      return;
    }
    console.log(`Cloning ${repository.url}`);
    await $`git clone ${repository.url} ${repository.name} --depth 1`.cwd(TMP_DIR_PATH);
  }
}

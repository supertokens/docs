import { writeFileSync } from "fs";
import { TypeScriptSymbolExtractor } from "./typescript-symbol-extractor";

const extractor = new TypeScriptSymbolExtractor();

const symbols = extractor.extract("/Users/bogdan/src/supertokens/docs/scripts/sdk-indexer/samples");

console.log(symbols);
writeFileSync("./result.json", JSON.stringify(symbols, null, 2));

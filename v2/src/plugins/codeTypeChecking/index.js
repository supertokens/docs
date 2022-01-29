let fs = require('fs');
let path = require('path');
var exec = require('child_process').exec;
var crypto = require('crypto');

async function addCodeSnippetToEnv(mdFile) {
    if (mdFile.includes("/v2/change_me/") || mdFile.includes("/v2/contribute/") ||
        mdFile.includes("/v2/nodejs") || mdFile.includes("/v2/golang") || mdFile.includes("/v2/python") ||
        mdFile.includes("/v2/auth-react") || mdFile.includes("/v2/website") || mdFile.includes("/v2/react-native")) {
        return;
    }
    return new Promise((res, rej) => {
        fs.readFile(mdFile, 'utf8', async (err, data) => {
            if (err) {
                return rej(err);
            }
            let fileNameCounter = 0;
            let originalData = data;

            let lines = originalData.split("\n");

            let currentCodeSnippet = "";
            let currentCodeLanguage = "";
            let startAppendingToCodeSnippet = false;
            for (let i = 0; i < lines.length; i++) {
                let currLine = lines[i].trim();
                if (startAppendingToCodeSnippet && !currLine.startsWith("```")) {
                    currentCodeSnippet = currentCodeSnippet + "\n" + currLine;
                }
                if (currLine.startsWith("```")) {
                    startAppendingToCodeSnippet = !startAppendingToCodeSnippet;
                    if (!startAppendingToCodeSnippet) {
                        if (currLine !== "```") {
                            return rej(new Error(`Something wrong in how a code snippet has ended in ${mdFile}`));
                        }
                        // we just finished copying a code snippet
                        if (currentCodeLanguage !== "ignore") {
                            await addCodeSnippetToEnvHelper(currentCodeSnippet, currentCodeLanguage, mdFile + fileNameCounter);
                            fileNameCounter++;
                        }
                        currentCodeSnippet = "";
                        currentCodeLanguage = "";
                    } else {
                        // we are starting a code block
                        if (currLine === "```js" || currLine.startsWith("```js ") ||
                            currLine === "```tsx" || currLine.startsWith("```tsx ") ||
                            currLine === "```ts" || currLine.startsWith("```ts ") ||
                            currLine === "```tsx" || currLine.startsWith("```tsx ")) {
                            currentCodeLanguage = "typescript";
                        } else if (currLine === "```go" || currLine.startsWith("```go ")) {
                            currentCodeLanguage = "go";
                        } else if (currLine === "```python" || currLine.startsWith("```python ")) {
                            currentCodeLanguage = "python";
                        } else if (currLine.includes("bash") || currLine.includes("yaml") || currLine.includes("cql") || currLine.includes("sql") || currLine.includes("batch") ||
                            currLine.includes("text") || currLine.includes("json")) {
                            currentCodeLanguage = "ignore"
                        } else {
                            return rej(new Error(`UNABLE TO RECOGNISE LANGUAGE in file ${mdFile}.`));
                        }
                    }
                }
            }
            res();
        });
    });
}

async function checkCodeSnippets() {
    // typescript..
    await new Promise((res, rej) => {
        exec("cd src/plugins/codeTypeChecking/jsEnv/ && npm run test", function (err, stdout, stderr) {
            if (err) {
                console.log('\x1b[31m%s\x1b[0m', stdout);
                return rej(err);
            }
            res();
        });
    })

    // TODO: other languages
}

async function addCodeSnippetToEnvHelper(codeSnippet, language, mdFile) {
    if (language === "typescript") {
        codeSnippet = "export { }\n" + codeSnippet; // see https://www.aritsltd.com/blog/frontend-development/cannot-redeclare-block-scoped-variable-the-reason-behind-the-error-and-the-way-to-resolve-it/

        let folderName = mdFile.replaceAll("~", "");
        await new Promise((res, rej) => {
            fs.mkdir('src/plugins/codeTypeChecking/jsEnv/snippets/' + folderName, { recursive: true }, (err) => {
                if (err) {
                    rej(err);
                } else {
                    fs.writeFile('src/plugins/codeTypeChecking/jsEnv/snippets/' + folderName + "/index.tsx", codeSnippet, function (err) {
                        if (err) {
                            rej(err);
                        } else {
                            res();
                        }
                    });
                }
            });
        });
    } else {
        // TODO: other languages...
    }
}

module.exports = { addCodeSnippetToEnv, checkCodeSnippets }
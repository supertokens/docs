let fs = require('fs');
let path = require('path');
var exec = require('child_process').exec;
var crypto = require('crypto');
let mdVars = require("../markdownVariables.json");

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
                            await addCodeSnippetToEnvHelper(currentCodeSnippet, currentCodeLanguage, mdFile, fileNameCounter);
                            fileNameCounter++;
                        }
                        currentCodeSnippet = "";
                        currentCodeLanguage = "";
                    } else {
                        // we are starting a code block
                        if (currLine === "```js" || currLine.startsWith("```js ") ||
                            currLine === "```jsx" || currLine.startsWith("```jsx ")) {
                            return rej(new Error(`Please do not use js or jsx in code snippets. Only ts or tsx. Error in ` + mdFile));
                        } else if (currLine === "```ts" || currLine.startsWith("```ts ") ||
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

async function checkCodeSnippets(language) {
    // typescript..
    if (language === "typescript") {
        await new Promise((res, rej) => {
            exec("cd src/plugins/codeTypeChecking/jsEnv/ && npm run test", function (err, stdout, stderr) {
                if (err) {
                    console.log('\x1b[31m%s\x1b[0m', stdout);
                    return rej(err);
                }
                res();
            });
        })
    } else if (language === "go") {
        await new Promise((res, rej) => {
            exec("cd src/plugins/codeTypeChecking/goEnv/ && go build ./...", function (err, stdout, stderr) {
                if (err) {
                    console.log('\x1b[31m%s\x1b[0m', stdout);
                    return rej(err);
                }
                res();
            });
        })
    } else {
        // TODO: other langs..
    }
}

function getRecipeName(mdFile) {
    let postV2 = mdFile.split("docs/v2/")[1];
    return postV2.split("/")[0];
}

async function addCodeSnippetToEnvHelper(codeSnippet, language, mdFile, codeBlockCountInFile) {
    // we replace all the variables here so that the code can compile:

    codeSnippet = codeSnippet.replaceAll("^{coreInjector_connection_uri_comment}", "");
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_uri}", "\"\",");
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_api_key_commented}", "");
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_api_key}", "\"\"");

    let recipeName = getRecipeName(mdFile);
    let replaceMap = mdVars[recipeName];
    if (replaceMap !== undefined) {
        let keys = Object.keys(replaceMap);
        for (let i = 0; i < keys.length; i++) {
            if (codeSnippet.includes(`^{${keys[i]}}`)) {
                codeSnippet = codeSnippet.replaceAll(`^{${keys[i]}}`, replaceMap[keys[i]]);
            }
        }
    }


    if (language === "typescript") {
        if (codeSnippet.includes("require(")) {
            throw new Error("Do not use 'require' in TS code. Error in " + mdFile);
        }
        codeSnippet = "export { }\n" + codeSnippet; // see https://www.aritsltd.com/blog/frontend-development/cannot-redeclare-block-scoped-variable-the-reason-behind-the-error-and-the-way-to-resolve-it/

        let folderName = mdFile.replaceAll("~", "") + codeBlockCountInFile;
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
    } else if (language === "go") {
        // we change the last folder path dir to be a valid go module name
        let folderName = mdFile.replaceAll("~", "") + codeBlockCountInFile;
        let splittedFolder = folderName.split("/");
        let lastDir = splittedFolder[splittedFolder.length - 1];
        lastDir = lastDir.replaceAll("-", "").replaceAll(".", "");
        splittedFolder[splittedFolder.length - 1] = lastDir;
        let newFolderName = splittedFolder.join("/");

        // adding package on top of go file
        codeSnippet = `package ${lastDir}\n` + codeSnippet;

        await new Promise((res, rej) => {
            fs.mkdir('src/plugins/codeTypeChecking/goEnv/snippets/' + newFolderName, { recursive: true }, (err) => {
                if (err) {
                    rej(err);
                } else {
                    fs.writeFile('src/plugins/codeTypeChecking/goEnv/snippets/' + newFolderName + "/main.go", codeSnippet, function (err) {
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
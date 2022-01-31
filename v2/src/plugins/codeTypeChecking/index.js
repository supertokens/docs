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
                let currLineTrimmed = lines[i].trim();
                if (startAppendingToCodeSnippet && !currLineTrimmed.startsWith("```")) {
                    currentCodeSnippet = currentCodeSnippet + "\n" + lines[i];
                }
                if (currLineTrimmed.startsWith("```")) {
                    startAppendingToCodeSnippet = !startAppendingToCodeSnippet;
                    if (!startAppendingToCodeSnippet) {
                        if (currLineTrimmed !== "```") {
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
                        if (currLineTrimmed === "```js" || currLineTrimmed.startsWith("```js ") ||
                            currLineTrimmed === "```jsx" || currLineTrimmed.startsWith("```jsx ")) {
                            return rej(new Error(`Please do not use js or jsx in code snippets. Only ts or tsx. Error in ` + mdFile));
                        } else if (currLineTrimmed === "```ts" || currLineTrimmed.startsWith("```ts ") ||
                            currLineTrimmed === "```tsx" || currLineTrimmed.startsWith("```tsx ")) {
                            currentCodeLanguage = "typescript";
                        } else if (currLineTrimmed === "```go" || currLineTrimmed.startsWith("```go ")) {
                            currentCodeLanguage = "go";
                        } else if (currLineTrimmed === "```python" || currLineTrimmed.startsWith("```python ")) {
                            currentCodeLanguage = "python";
                        } else if (currLineTrimmed.includes("bash") || currLineTrimmed.includes("yaml") || currLineTrimmed.includes("cql") || currLineTrimmed.includes("sql") || currLineTrimmed.includes("batch") ||
                            currLineTrimmed.includes("text") || currLineTrimmed.includes("json")) {
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
                    console.log('\x1b[31m%s\x1b[0m', err);
                    console.log("=======SETUP INSTRS========\n");
                    console.log('\x1b[36m%s\x1b[0m', `To setup a JS env, run the following (from v2 folder):
    - cd src/plugins/codeTypeChecking/jsEnv/
    - npm i
    - npm run test (to make sure that it's setup correctly)`)
                    console.log("==========================\n");
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
                    console.log('\x1b[31m%s\x1b[0m', err);
                    console.log("=======SETUP INSTRS========\n");
                    console.log('\x1b[36m%s\x1b[0m', `Make sure that you have go installed on your system and try this command again`)
                    console.log("==========================\n");
                    return rej(err);
                }
                res();
            });
        })
    } else if (language === "python") {
        await new Promise((res, rej) => {
            exec("cd src/plugins/codeTypeChecking/pythonEnv/ && source venv/bin/activate && pylint ./snippets", function (err, stdout, stderr) {
                if (err) {
                    console.log('\x1b[31m%s\x1b[0m', stdout);
                    console.log('\x1b[31m%s\x1b[0m', err);
                    console.log("=======SETUP INSTRS========\n");
                    console.log('\x1b[36m%s\x1b[0m', `To setup a python env, run the following (from v2 folder):
    - cd src/plugins/codeTypeChecking/pythonEnv/
    - virtualenv ./venv
    - source venv/bin/activate
    - pip install -r requirements.txt
    - pylint ./snippets (to make sure that it's setup correctly)`)
                    console.log("==========================\n");
                    return rej(err);
                }
                res();
            });
        })
    } else {
        throw new Error("Unsupported language in checkCodeSnippets");
    }
}

let rootDir = undefined; // uptil v2

async function getRecipeName(mdFile) {
    if (rootDir === undefined) {
        rootDir = await new Promise(res => exec("pwd", function (err, stdout, stderr) {
            res(stdout);
        }));
        rootDir = rootDir.trim() + "/";
        // at this point, rootDir is /Users/.../main-website/docs/v2/ or if only cloned docs, then its /Users/.../docs/v2/
    }
    let postV2 = mdFile.replace(rootDir, "");
    return postV2.split("/")[0];
}

async function addCodeSnippetToEnvHelper(codeSnippet, language, mdFile, codeBlockCountInFile) {
    // we replace all the variables here so that the code can compile:

    let ogCodeSnippet = codeSnippet;
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_connection_uri_comment}", "");
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_uri}", "\"\",");
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_api_key_commented}", "");
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_api_key}", "\"\"");

    let recipeName = await getRecipeName(mdFile);
    let replaceMap = mdVars[recipeName];
    if (replaceMap !== undefined) {
        let keys = Object.keys(replaceMap);
        for (let i = 0; i < keys.length; i++) {
            if (codeSnippet.includes(`^{${keys[i]}}`)) {
                codeSnippet = codeSnippet.replaceAll(`^{${keys[i]}}`, replaceMap[keys[i]]);
            }
        }
    }

    // this block is there so that the dev knows that the resulting block should use variable code snippets.
    if (ogCodeSnippet !== codeSnippet) {
        for (let i = 0; i < 50; i++) {
            if (language === "typescript" || language === "go") {
                codeSnippet = "// THIS FILE CONTAINS DOCS VARIABLES. PLEASE DO NOT FORGET TO USE THOSE\n" + codeSnippet;
            } else if (language === "python") {
                codeSnippet = "# THIS FILE CONTAINS DOCS VARIABLES. PLEASE DO NOT FORGET TO USE THOSE\n" + codeSnippet;
            } else {
                throw new Error("language not supported");
            }
        }
    }


    if (language === "typescript") {
        if (codeSnippet.includes("require(")) {
            throw new Error("Do not use 'require' in TS code. Error in " + mdFile);
        }
        codeSnippet = "export { }\n" + codeSnippet; // see https://www.aritsltd.com/blog/frontend-development/cannot-redeclare-block-scoped-variable-the-reason-behind-the-error-and-the-way-to-resolve-it/

        let folderName = mdFile.replaceAll("~", "") + codeBlockCountInFile;
        await new Promise(async (res, rej) => {
            fs.mkdir('src/plugins/codeTypeChecking/jsEnv/snippets/' + folderName, { recursive: true }, async (err) => {
                if (err) {
                    rej(err);
                } else {
                    await assertThatUserIsNotRemovedDocsVariableByMistake('src/plugins/codeTypeChecking/jsEnv/snippets/' + folderName + "/index.tsx", codeSnippet);
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
        if (codeSnippet.includes("/supertokens-go/") || codeSnippet.includes("/supertokens-go\n")) {
            throw new Error("Do not use supertokens-go package. Use supertokens-golang package. Error in " + mdFile);
        }
        // we change the last folder path dir to be a valid go module name
        let folderName = mdFile.replaceAll("~", "") + codeBlockCountInFile;
        let splittedFolder = folderName.split("/");
        let lastDir = splittedFolder[splittedFolder.length - 1];
        lastDir = lastDir.replaceAll("-", "").replaceAll(".", "");
        splittedFolder[splittedFolder.length - 1] = lastDir;
        let newFolderName = splittedFolder.join("/");

        // adding package on top of go file
        codeSnippet = `package ${lastDir}\n` + codeSnippet;

        await new Promise(async (res, rej) => {
            fs.mkdir('src/plugins/codeTypeChecking/goEnv/snippets/' + newFolderName, { recursive: true }, async (err) => {
                if (err) {
                    rej(err);
                } else {
                    await assertThatUserIsNotRemovedDocsVariableByMistake('src/plugins/codeTypeChecking/goEnv/snippets/' + newFolderName + "/main.go", codeSnippet);
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
    } else if (language === "python") {
        let folderName = mdFile.replaceAll("~", "") + codeBlockCountInFile;
        await new Promise(async (res, rej) => {
            fs.mkdir('src/plugins/codeTypeChecking/pythonEnv/snippets/' + folderName, { recursive: true }, async (err) => {
                if (err) {
                    rej(err);
                } else {
                    await assertThatUserIsNotRemovedDocsVariableByMistake('src/plugins/codeTypeChecking/pythonEnv/snippets/' + folderName + "/main.py", codeSnippet);
                    fs.writeFile('src/plugins/codeTypeChecking/pythonEnv/snippets/' + folderName + "/main.py", codeSnippet, function (err) {
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
        throw new Error("Unsupported language in addCodeSnippetToEnvHelper");
    }
}

async function assertThatUserIsNotRemovedDocsVariableByMistake(path, codeSnippet) {
    /* first we try and read the contents to see if this has 
                    THIS FILE CONTAINS DOCS VARIABLES. PLEASE DO NOT FORGET TO USE THOSE and if the new code snippet doesn't then, the dev has made a mistake of removing variables...*/
    return new Promise((res, rej) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (data !== undefined) {
                if (data.includes("THIS FILE CONTAINS DOCS VARIABLES. PLEASE DO NOT FORGET TO USE THOSE") && !codeSnippet.includes("THIS FILE CONTAINS DOCS VARIABLES. PLEASE DO NOT FORGET TO USE THOSE")) {
                    return rej(new Error("DID YOU FORGET TO USE DOCS VARIABLES IN A RECENT CODE CHANGE? PLEASE CHECK"));
                }
                res();
            }

        });
    })
}

function replaceTSIgnoreWithEmptyLine(child, exportedVariables) {
    // A child will either have value properties or more children

    // If it has a value, check if it is using a variable. If it is then replace otherwise skip
    if (child.value) {
        var valueCopy = child.value;

        let eachLine = valueCopy.split("\n");
        let newLines = [];
        for (let i = 0; i < eachLine.length; i++) {
            if (eachLine[i].includes("@ts-ignore")) {
                continue;
            }
            newLines.push(eachLine[i]);
        }

        child.value = newLines.join("\n");
    }

    // If it has children then repeat recursively
    if (child.children) {
        child.children = child.children.map(subChild => {
            return replaceTSIgnoreWithEmptyLine(subChild, exportedVariables);
        })
    }

    return child;
}

module.exports = { addCodeSnippetToEnv, checkCodeSnippets, replaceTSIgnoreWithEmptyLine }
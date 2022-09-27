let fs = require('fs');
let readdir = require("fs").promises.readdir
let path = require('path');
var exec = require('child_process').exec;
var crypto = require('crypto');
let mdVars = require("../markdownVariables.json");

function hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

async function addCodeSnippetToEnv(mdFile) {
    if (mdFile.includes("/v2/change_me/") || mdFile.includes("/v2/contribute/") ||
        mdFile.includes("/v2/nodejs") || mdFile.includes("/v2/golang") || mdFile.includes("/v2/python") ||
        mdFile.includes("/v2/auth-react") || mdFile.includes("/v2/website") || mdFile.includes("/v2/react-native") || mdFile.includes("/codeTypeChecking/")) {
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
                        } else if (currLineTrimmed === "```kotlin" || currLineTrimmed.startsWith("```kotlin ")) {
                            currentCodeLanguage = "kotlin";
                        } else if (currLineTrimmed.includes("bash") || currLineTrimmed.includes("yaml") || currLineTrimmed.includes("cql") || currLineTrimmed.includes("sql") || currLineTrimmed.includes("batch") ||
                            currLineTrimmed.includes("text") || currLineTrimmed.includes("json")
                            || currLineTrimmed.includes("html")) {
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

async function getFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

function cleanEmptyFoldersRecursively(folder) {
    if (!fs.existsSync(folder)) {
        return;
    }
    var isDir = fs.statSync(folder).isDirectory();
    if (!isDir) {
        return;
    }
    var files = fs.readdirSync(folder);
    if (files.length > 0) {
        files.forEach(function (file) {
            var fullPath = path.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = fs.readdirSync(folder);
    }

    if (files.length == 0) {
        fs.rmdirSync(folder);
        return;
    }
}

async function deleteFilesWithoutErrorsTypescript(stdout) {
    let errors = stdout.split("\n");
    let fileNames = [];

    /**
     * NOTE that because of how typescript reports file paths, all paths in 
     * fileNames will start from /snippets and not from the root (~/)
     */
    errors.forEach(error => {
        // tsc output has some other lines + info that we are not interested in
        if (error !== "" && error.includes("snippets")) {
            fileNames.push(error.split("(")[0]);
        }
    })

    let snippetsPathPrefix = "src/plugins/codeTypeChecking/jsEnv/snippets/";
    let files = await getFiles(snippetsPathPrefix);
    await getRootDir();

    files.forEach(file => {
        let actualPath = file.replace(rootDir, "");

        // We replace the path from project root to snippets with just snippets/ to match the format that tsc outputs
        if (!fileNames.includes(actualPath.replace(snippetsPathPrefix, "snippets/"))) {
            let exists = fs.existsSync(actualPath);
            if (exists) {
                fs.rmSync(actualPath);
            }
        }
    });

    cleanEmptyFoldersRecursively("src/plugins/codeTypeChecking/jsEnv/snippets");
}


async function deleteFilesWithoutErrorsPython(stdout) {
    let errors = stdout.split("\n");
    let fileNames = [];

    errors.forEach(error => {
        if (error !== "" && error.includes("snippets")) {
            fileNames.push(error.split(":")[0].trim());
        }
    })

    let snippetsPathPrefix = "src/plugins/codeTypeChecking/pythonEnv/snippets/";
    let files = await getFiles(snippetsPathPrefix);
    await getRootDir();

    files.forEach(file => {
        if (!fileNames.includes(file)) {
            let exists = fs.existsSync(file);
            if (exists) {
                fs.rmSync(file);
            }
        }
    });

    cleanEmptyFoldersRecursively("src/plugins/codeTypeChecking/pythonEnv/snippets");
}

async function checkCodeSnippets(language) {
    // typescript..
    if (language === "typescript") {
        await new Promise((res, rej) => {
            exec("cd src/plugins/codeTypeChecking/jsEnv/ && npm run test", async function (err, stdout, stderr) {
                await deleteFilesWithoutErrorsTypescript(stdout);
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
            exec("cd src/plugins/codeTypeChecking/pythonEnv/ && ./checkSnippets.sh", async function (err, stdout, stderr) {
                await deleteFilesWithoutErrorsPython(stdout);
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
    } else if (language === "kotlin") {
        await new Promise((res, rej) => {
            exec("cd src/plugins/codeTypeChecking/kotlinEnv/ && ./gradlew build", async function (err, stdout, stderr) {
                if (err) {
                    console.log('\x1b[31m%s\x1b[0m', stdout);
                    console.log('\x1b[31m%s\x1b[0m', err);
                    console.log("=======SETUP INSTRS========\n");
                    console.log('\x1b[36m%s\x1b[0m', `Make sure that you have kotlin installed on your system and try this command again`)
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

async function getRootDir() {
    if (rootDir === undefined) {
        rootDir = await new Promise(res => exec("pwd", function (err, stdout, stderr) {
            res(stdout);
        }));
        rootDir = rootDir.trim() + "/";
        // at this point, rootDir is /Users/.../main-website/docs/v2/ or if only cloned docs, then its /Users/.../docs/v2/
    }

    return rootDir;
}

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
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_connection_uri_comment_with_hash}", "")
    codeSnippet = codeSnippet.replaceAll("^{coreInjector_api_key_commented_with_hash}", "")

    codeSnippet = codeSnippet.replaceAll("^{form_flowType}", "USER_INPUT_CODE_AND_MAGIC_LINK");
    codeSnippet = codeSnippet.replaceAll("^{form_contactMethod}", "PHONE");
    codeSnippet = codeSnippet.replaceAll("^{form_contactMethod_initialize_Python}", "ContactPhoneOnlyConfig");
    codeSnippet = codeSnippet.replaceAll("^{form_contactMethod_import_Python}", "from supertokens_python.recipe.passwordless import ContactPhoneOnlyConfig");
    codeSnippet = codeSnippet.replaceAll("^{form_contactMethod_sendCB_Go}",
        `ContactMethodPhone: plessmodels.ContactMethodPhoneConfig{
Enabled: true,
},`);

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
            if (language === "typescript" || language === "go" || language === "kotlin") {
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
        codeSnippet = `export { }\n// Original: ${mdFile}\n${codeSnippet}`; // see https://www.aritsltd.com/blog/frontend-development/cannot-redeclare-block-scoped-variable-the-reason-behind-the-error-and-the-way-to-resolve-it/

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
        codeSnippet = `package ${lastDir}\n/*\n${mdFile}\n*/\n${codeSnippet}`;

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
        codeSnippet = `# ${mdFile}\n${codeSnippet}`
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
    } else if (language === "kotlin") {
        let folderName = mdFile.replaceAll("~", "") + codeBlockCountInFile;
        let packageNameSplitted = folderName.split("/");
        packageNameSplitted = packageNameSplitted.map(i => {
            if (i.includes("-")) {
                return "`" + i + "`"
            }
            return i;
        })
        codeSnippet = `package com.example.myapplication${packageNameSplitted.join(".")}\n\n// Original: ${mdFile}\n${codeSnippet}`;
        await new Promise(async (res, rej) => {
            fs.mkdir('src/plugins/codeTypeChecking/kotlinEnv/app/src/main/java/com/example/myapplication/' + folderName, { recursive: true }, async (err) => {
                if (err) {
                    rej(err);
                } else {
                    await assertThatUserIsNotRemovedDocsVariableByMistake('src/plugins/codeTypeChecking/kotlinEnv/app/src/main/java/com/example/myapplication/' + folderName + "/Code.kt", codeSnippet);
                    fs.writeFile('src/plugins/codeTypeChecking/kotlinEnv/app/src/main/java/com/example/myapplication/' + folderName + "/Code.kt", codeSnippet, function (err) {
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
                    let message = "DID YOU FORGET TO USE DOCS VARIABLES IN A RECENT CODE CHANGE? PLEASE CHECK"
                        + "\n\nIf you think this error is unrelated to your changes, try deleting the `snippets` folder for all languages and run again\n"
                    return rej(new Error(message));
                }
            }
            res();
        });
    })
}

function replaceCustomPlaceholdersInLine(child, exportedVariables) {
    // A child will either have value properties or more children

    // If it has a value, check if it is using a variable. If it is then replace otherwise skip
    if (child.value) {
        var valueCopy = child.value;

        let eachLine = valueCopy.split("\n");
        let newLines = [];
        for (let i = 0; i < eachLine.length; i++) {
            let line = eachLine[i];
            // If the line contains ts-ignore or ends with a comment indicating it should be removed
            if (line.includes("@ts-ignore") || /(\/\/|#) typecheck-only, removed from output$/.test(line)) {
                continue;
            }

            /**
             * For snippets that use an older version of supertokens-node we use supertokens-node7 to import
             * If the import contains supertokens-node7 we replace it with supertokens-node for the final
             * rendered snippet
             */
            if (line.includes("supertokens-node7")) {
                line = line.split("supertokens-node7").join("supertokens-node");
                newLines.push(line);
                continue;
            }

            /**
             * For snippets that use v5 react-router-dom we use react-router-dom5 to import
             * If the import contains react-router-dom5 we replace it with react-router-dom for the final
             * rendered snippet
             */
            if (line.includes("react-router-dom5")) {
                line = line.split("react-router-dom5").join("react-router-dom");
                newLines.push(line);
                continue;
            }

            /**
             * For python code snippets that contain "# type: ignore", we remove that
             * string snippet from the line
             */
            if (line.includes("# type: ignore")) {
                line = line.split("# type: ignore").join("");
                newLines.push(line);
                continue;
            }
            if (line.includes("#type: ignore")) {
                line = line.split("#type: ignore").join("");
                newLines.push(line);
                continue;
            }
            if (line.includes("# type:ignore")) {
                line = line.split("# type:ignore").join("");
                newLines.push(line);
                continue;
            }
            if (line.includes("#type:ignore")) {
                line = line.split("#type:ignore").join("");
                newLines.push(line);
                continue;
            }

            // if the line contains "# pyright: ", then we remove that line
            if (line.includes("# pyright:") || line.includes("#pyright:")) {
                continue;
            }

            /**
             * For snippets that use supertokens-web-js as an HTML script we import supertokens-web-js-script for types.
             * If the line contains this we skip adding the line
             */
            if (line.includes("supertokens-web-js-script")) {
                continue;
            }

            newLines.push(eachLine[i]);
        }

        child.value = newLines.join("\n");
    }

    // If it has children then repeat recursively
    if (child.children) {
        child.children = child.children.map(subChild => {
            return replaceCustomPlaceholdersInLine(subChild, exportedVariables);
        })
    }

    return child;
}

module.exports = { addCodeSnippetToEnv, checkCodeSnippets, replaceCustomPlaceholdersInLine }
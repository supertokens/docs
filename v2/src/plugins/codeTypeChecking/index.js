let fs = require('fs');
let path = require('path');

async function doCodeTypeChecking(mdFile) {
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
                            if (!await checkCodeSnippet(currentCodeSnippet, currentCodeLanguage)) {
                                return rej(new Error(`CODE TYPING FAILED in file ${mdFile}`));
                            }
                        }
                        currentCodeSnippet = "";
                        currentCodeLanguage = "";
                    } else {
                        // we are starting a code block
                        if (currLine === "```js" || currLine.startsWith("```js ") ||
                            currLine === "```jsx" || currLine.startsWith("```jsx ") ||
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

async function checkCodeSnippet(codeSnippet, language) {
    // console.log("///////////START///// " + language)
    // console.log(codeSnippet);
    // console.log("///////////END//////////////")
    return true;
}

module.exports = { doCodeTypeChecking }

// async function getDataToCopyFromFile(pathLine, lines) {
//     return new Promise((res, rej) => {
//         fs.readFile(pathLine, 'utf8', function (err, toCopyData) {
//             if (err) {
//                 return rej(err);
//             }

//             toCopyData = toCopyData.trim();

//             let finalData = "";

//             for (let i = 0; i < lines.length; i++) {
//                 finalData += lines[i] + "\n";
//                 if (lines[i].trim() === "<!-- COPY DOCS -->") {
//                     finalData += lines[i + 1] + "\n";
//                     break;
//                 }
//             }

//             let copyLines = toCopyData.split("\n");
//             let startCopying = false;
//             for (let i = 0; i < copyLines.length; i++) {
//                 if (copyLines[i].trim() === "<!-- COPY DOCS -->") {
//                     startCopying = true;
//                     i++;
//                     continue;
//                 }
//                 if (!startCopying) {
//                     continue;
//                 }
//                 finalData += copyLines[i] + "\n";
//             }
//             res(finalData);
//         });
//     });
// }
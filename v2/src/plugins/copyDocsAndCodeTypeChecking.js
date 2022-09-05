let fs = require('fs');
let path = require('path');
let { addCodeSnippetToEnv, checkCodeSnippets } = require("./codeTypeChecking");
var exec = require('child_process').exec;

if (typeof String.prototype.replaceAll === "undefined") {
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    String.prototype.replaceAll = function (find, replace) {
        var target = this;
        return target.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
}

module.exports = function (context, opts) {

    return {
        name: 'copy-docs-and-code-type-checking',

        async loadContent() {
            const skipCopies = process.env.SKIP_COPIES === "true";
            const origDocs = [];
            // copy docs..
            await new Promise((res, rej) => {
                walk(__dirname + "/../../", async (err, results) => {
                    if (err) {
                        return rej(err);
                    }
                    results = results.filter(r => r.endsWith(".md") || r.endsWith(".mdx"));
                    for (const mdPath of results) {
                        const isCopy = await doCopyDocs(mdPath);
                        if (!skipCopies || !isCopy) {
                            origDocs.push(mdPath);
                        }
                    }
                    res();
                });
            })

            let check = process.env.CODE_TYPE_CHECK;
            if (check === undefined && process.env.MODE === "production") {
                check = "all";
            }

            if (check !== undefined && check !== "nothing") {
                // add code snippets to their respective env..
                for (const mdPath of origDocs) {
                    await addCodeSnippetToEnv(mdPath);
                }
            }

            // now we compile code snippets to make sure their types are correct..
            try {
                // modify this block to add a new language
                if (check !== undefined && check !== "nothing") {
                    let splittedCheck = check.split(",");
                    if (splittedCheck.filter(i => i === "all").length >= 1 ||
                        splittedCheck.filter(i => i === "typescript").length >= 1) {
                        await checkCodeSnippets("typescript");
                    }
                    if (splittedCheck.filter(i => i === "all").length >= 1 ||
                        splittedCheck.filter(i => i === "go").length >= 1) {
                        await checkCodeSnippets("go");
                    }
                    if (splittedCheck.filter(i => i === "all").length >= 1 ||
                        splittedCheck.filter(i => i === "python").length >= 1) {
                        await checkCodeSnippets("python");
                    }
                }
            } catch (err) {
                if (process.env.MODE === "production") {
                    throw err;
                }
            }
        },
    };
};


async function doCopyDocs(mdFile) {
    return new Promise((res, rej) => {
        fs.readFile(mdFile, 'utf8', async (err, data) => {
            if (err) {
                return rej(err);
            }

            let originalData = data;

            let lines = originalData.split("\n");

            let pathLine = undefined;
            let copyType = undefined;
            // TODO: there can be multiple sources for each section as well..
            let copyIDs = [];
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.trim() === "<!-- COPY DOCS -->" || line.trim() === "<!-- COPY SECTION -->") {
                    pathLine = lines[i + 1]
                    if (line.trim() === "<!-- COPY SECTION -->") {
                        copyType = "SECTION"
                        copyIDs.push(lines[i + 2])
                    } else {
                        copyType = "DOCS"
                    }
                }
            }

            if (pathLine === undefined) {
                return res(false);
            }

            pathLine = path.resolve(__dirname + "/../../" + pathLine.replace(/ /g, '').replace("<!--", "").replace("-->", ""));

            if (pathLine === mdFile) {
                return res(false);
            }

            if (copyType === "DOCS") {
                let sourceData = await getDataToCopyFromFile(pathLine, lines);

                let destinationData = await getDataToCopyFromFile(mdFile, lines);

                if (sourceData === destinationData) {
                    return res(true);
                } else {
                    fs.writeFile(mdFile, sourceData, 'utf8', function (err) {
                        if (err) {
                            return rej(err);
                        }
                        res(true);
                    });
                }
            } else {
                let sourceData = await getDataToCopySectionFromFile(pathLine, lines, copyIDs);

                let destinationData = await getDataToCopySectionFromFile(mdFile, lines, copyIDs);

                if (sourceData === destinationData) {
                    return res(false);
                } else {
                    fs.writeFile(mdFile, sourceData, 'utf8', function (err) {
                        if (err) {
                            return rej(err);
                        }
                        res(false);
                    });
                }
            }
        });
    });
}

async function getDataToCopySectionFromFile(pathLine, lines, copyIDs) {
    return new Promise((res, rej) => {
        fs.readFile(pathLine, 'utf8', function (err, toCopyData) {
            if (err) {
                return rej(err);
            }

            toCopyData = toCopyData.trim();

            let finalData = [];
            finalDataIndex = 0;

            for (let copyIdIndex = 0; copyIdIndex < copyIDs.length; copyIdIndex++) {
                finalDataIndex = 0;
                for (let i = 0; i < lines.length; i++, finalDataIndex++) {
                    if (lines[i].trim() === "<!-- COPY SECTION -->") {
                        finalData[finalDataIndex] = lines[i]
                        if (lines[i + 2].trim() === copyIDs[copyIdIndex]) {
                            finalData[finalDataIndex + 1] = lines[i + 1];
                            finalData[finalDataIndex + 2] = lines[i + 2];
                            finalDataIndex += 3;
                            break;
                        } else {
                            // do nothing..
                        }
                    } else {
                        finalData[finalDataIndex] = lines[i];
                    }
                }

                let copyLines = toCopyData.split("\n");
                let startCopying = false;
                for (let i = 0; i < copyLines.length; i++) {
                    if (startCopying && copyLines[i].trim() === "<!-- !COPY SECTION -->") {
                        finalData[finalDataIndex] = copyLines[i];
                        break;
                    }
                    if (copyLines[i].trim() === "<!-- COPY SECTION -->" &&
                        copyLines[i + 2].trim() === copyIDs[copyIdIndex]) {
                        startCopying = true;
                        i++;
                        i++;
                        continue;
                    }
                    if (!startCopying) {
                        continue;
                    }
                    finalData[finalDataIndex] = copyLines[i];
                    finalDataIndex++
                }
            }
            res(finalData.join("\n"));
        });
    });
}

async function getDataToCopyFromFile(pathLine, lines) {
    return new Promise((res, rej) => {
        fs.readFile(pathLine, 'utf8', function (err, toCopyData) {
            if (err) {
                return rej(err);
            }

            toCopyData = toCopyData.trim();

            let finalData = "";

            for (let i = 0; i < lines.length; i++) {
                finalData += lines[i] + "\n";
                if (lines[i].trim() === "<!-- COPY DOCS -->") {
                    finalData += lines[i + 1] + "\n";
                    break;
                }
            }

            let copyLines = toCopyData.split("\n");
            let startCopying = false;
            for (let i = 0; i < copyLines.length; i++) {
                if (copyLines[i].trim() === "<!-- COPY DOCS -->") {
                    startCopying = true;
                    i++;
                    continue;
                }
                if (!startCopying) {
                    continue;
                }
                finalData += copyLines[i] + "\n";
            }
            res(finalData);
        });
    });
}

let walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                let name = file.toString();
                if (stat && stat.isDirectory() && !name.endsWith("node_modules") &&
                    !name.endsWith(".docusaurus") && !name.endsWith("build")) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if (!name.endsWith("/v2/HOW_TO_NEW_DOCS.md") && !name.endsWith("/v2/README.md")) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
};
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


async function doCopyDocs(mdFile, ignore) {
    return new Promise((res, rej) => {
        fs.readFile(mdFile, 'utf8', async (err, data) => {
            if (err) {
                return rej(err);
            }

            let originalData = data;

            let lines = originalData.split("\n");

            let pathLine = undefined;
            let copyType = undefined;
            let containsBoth = false;
            let copyPathsAndIDs = [];
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.trim() === "<!-- COPY DOCS -->" || line.trim() === "<!-- COPY SECTION -->") {
                    if (line.trim() === "<!-- COPY SECTION -->" && ignore === "SECTION") {
                        continue;
                    }
                    if (line.trim() === "<!-- COPY DOCS -->" && ignore === "DOCS") {
                        continue;
                    }
                    if (line.trim() === "<!-- COPY SECTION -->") {
                        if (copyType === "DOCS") {
                            containsBoth = true;
                        } else {
                            copyType = "SECTION"
                            copyPathsAndIDs.push({
                                path: lines[i + 1],
                                id: lines[i + 2]
                            })
                        }
                    } else {
                        if (copyType === "SECTION") {
                            containsBoth = true;
                            pathLine = lines[i + 1]
                        } else {
                            pathLine = lines[i + 1]
                            copyType = "DOCS"
                        }
                    }
                }
            }

            if (copyType === undefined) {
                return res(false);
            }

            if (containsBoth && ignore === undefined) {
                let originalDocsPath = path.resolve(__dirname + "/../../" + pathLine.replace(/ /g, '').replace("<!--", "").replace("-->", ""));
                // first we want to resolve all the sections of the originalDocs
                await doCopyDocs(originalDocsPath, "DOCS"); // ignore copy docs..

                // then we want to do copy docs on this file
                let resp = await doCopyDocs(mdFile, "SECTION"); // ignore copy section.
                return res(resp);
            }

            if (copyType === "DOCS") {

                pathLine = path.resolve(__dirname + "/../../" + pathLine.replace(/ /g, '').replace("<!--", "").replace("-->", ""));

                if (pathLine === mdFile) {
                    return res(false);
                }

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
                let sourceData = await getDataToCopySectionFromFile(lines, copyPathsAndIDs);

                let destinationData = await new Promise((res, rej) => {
                    fs.readFile(mdFile, 'utf8', function (err, toCopyData) {
                        if (err) {
                            return rej(err)
                        }
                        res(toCopyData)
                    })
                });

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

async function getDataToCopySectionFromFile(lines, copyPathsAndIDs) {
    let finalData = [...lines];
    for (let k = 0; k < copyPathsAndIDs.length; k++) {
        await new Promise((res, rej) => {
            let ogPathLine = copyPathsAndIDs[k].path
            let ogId = copyPathsAndIDs[k].id
            let pathLine = ogPathLine
            pathLine = path.resolve(__dirname + "/../../" + pathLine.replace(/ /g, '').replace("<!--", "").replace("-->", ""));
            fs.readFile(pathLine, 'utf8', async function (err, toCopyData) {
                if (err) {
                    return rej(err);
                }

                toCopyData = toCopyData.trim();

                finalDataIndex = 0;

                for (; finalDataIndex < finalData.length; finalDataIndex++) {
                    if (finalData[finalDataIndex].trim() === "<!-- COPY SECTION -->") {
                        if (finalData[finalDataIndex + 1].trim() === ogPathLine && finalData[finalDataIndex + 2].trim() === ogId) {
                            finalDataIndex += 3;
                            break;
                        } else {
                            // do nothing..
                        }
                    }
                }

                let toRemoveIndex = finalDataIndex;
                for (let i = finalDataIndex; i < finalData.length; i++) {
                    if (finalData[i] === "<!-- END COPY SECTION -->") {
                        toRemoveIndex = i;
                        break;
                    }
                }
                finalData = [...finalData.slice(0, finalDataIndex), ...finalData.slice(toRemoveIndex)]

                let copyLines = toCopyData.split("\n");
                let startCopying = false;
                for (let i = 0; i < copyLines.length; i++) {
                    if (startCopying && copyLines[i].trim() === "<!-- END COPY SECTION -->") {
                        break;
                    }
                    if (copyLines[i].trim() === "<!-- COPY SECTION -->" &&
                        copyLines[i + 1].trim() === ogPathLine &&
                        copyLines[i + 2].trim() === ogId) {
                        startCopying = true;
                        i++;
                        i++;
                        continue;
                    }
                    if (!startCopying) {
                        continue;
                    }
                    finalData = [...finalData.slice(0, finalDataIndex), copyLines[i], ...finalData.slice(finalDataIndex)]
                    finalDataIndex++
                }
                res();
            });
        });
    }
    return finalData.join("\n")
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
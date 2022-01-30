let fs = require('fs');
let path = require('path');
let { addCodeSnippetToEnv, checkCodeSnippets } = require("./codeTypeChecking");

module.exports = function (context, opts) {

    return {
        name: 'copy-docs-and-code-type-checking',

        async loadContent() {
            // copy docs..
            await new Promise((res, rej) => {
                walk(__dirname + "/../../", async (err, results) => {
                    if (err) {
                        return rej(err);
                    }
                    results = results.filter(r => r.endsWith(".md") || r.endsWith(".mdx"));
                    for (let i = 0; i < results.length; i++) {
                        await doCopyDocs(results[i]);
                    }
                    res();
                });
            })

            // add code snippets to their respective env..
            await new Promise((res, rej) => {
                walk(__dirname + "/../../", async (err, results) => {
                    if (err) {
                        return rej(err);
                    }
                    results = results.filter(r => r.endsWith(".md") || r.endsWith(".mdx"));
                    for (let i = 0; i < results.length; i++) {
                        try {
                            await addCodeSnippetToEnv(results[i]);
                        } catch (err) {
                            return rej(err);
                        }
                    }
                    res();
                });
            });

            // now we compile code snippets to make sure their types are correct..
            try {
                // await checkCodeSnippets("typescript");
                await checkCodeSnippets("go")
            } catch (err) {
                console.log('\x1b[31m%s\x1b[0m', err);
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
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (line.trim() === "<!-- COPY DOCS -->") {
                    pathLine = lines[i + 1]
                }
            }

            if (pathLine === undefined) {
                return res();
            }

            pathLine = __dirname + "/../../" + pathLine.replace(/ /g, '').replace("<!--", "").replace("-->", "");

            let sourceData = await getDataToCopyFromFile(pathLine, lines);

            let destinationData = await getDataToCopyFromFile(mdFile, lines);

            if (sourceData === destinationData) {
                return res();
            } else {
                fs.writeFile(mdFile, sourceData, 'utf8', function (err) {
                    if (err) {
                        return rej(err);
                    }
                    res();
                });
            }
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
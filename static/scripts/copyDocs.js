// this is used in the buildDocs script.
// It takes a .md file location and is used to add spaces after or 
// before code highlight tags

let fs = require('fs')

let mdFile = process.argv[2];

fs.readFile(mdFile, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
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

    pathLine = __dirname + "/../../" + pathLine.replace(/ /g, '').replace("<!--", "").replace("-->", "");

    fs.readFile(pathLine, 'utf8', function (err, toCopyData) {
        if (err) {
            return console.log(err);
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

        fs.writeFile(mdFile, finalData, 'utf8', function (err) {
            if (err) return console.log(err);
        });

    });
});
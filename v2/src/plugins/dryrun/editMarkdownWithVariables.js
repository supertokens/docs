let fs = require('fs');
let path = require('path');
let configuredVariables = require("../markdownVariables.json");

module.exports = function (context, opts) {

    return {
        name: 'edit-markdown-variables',

        async loadContent() {
            return new Promise((res, rej) => {
                walk(__dirname + "/../../../", async (err, results) => {
                    if (err) {
                        return rej(err);
                    }
                    results = results.filter(r => r.endsWith(".md") || r.endsWith(".mdx"));
                    for (let i = 0; i < results.length; i++) {
                        await editFileWIthVariables(results[i]);
                    }
                    res();
                });
            })
        },
    };
};

async function editFileWIthVariables(file) {
    return new Promise((resolve, reject) => {
        var recipeName = file.split("/v2/")[1].split("/")[0]
        var fileSplit = file.split("/");
        var fileName = fileSplit[fileSplit.length - 1].replace(".mdx", "").replace(".md", "");

        let configObjectForRecipe = configuredVariables[recipeName];

        // If there is no config entry for the recipe, exit early
        if (!configObjectForRecipe) {
            return resolve();
        }

        let configObjectForFile = configObjectForRecipe[fileName];

        // If the config entry for recipe has no entry for the file name, exit early
        if (!configObjectForFile) {
            return resolve();
        }

        fs.readFile(file, 'utf8', async (err, data) => {
            if (err) {
                return reject(err);
            }

            var dataCopy = data;

            Object.keys(configObjectForFile).forEach(key => {
                dataCopy = dataCopy.split(`^{${key}}`).join(`${configObjectForFile[key]}`)
            });

            if (dataCopy === data) {
                return resolve();
            } else {
                fs.writeFile(file, dataCopy, 'utf8', function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve();
                });
            }
        })
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
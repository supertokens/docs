const path = require("path");
const fs = require("fs");

module.exports = () => {
    async function readHTML(filePath) {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async function writeToHTML(filePath,modifiedContent) {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFile(filePath, modifiedContent, "utf8", err => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                });
            } catch (error) {
                rej(error);
            }
        });
    }
    return {
        name: "transform-opensearch-link",
        async postBuild({ routesPaths, outDir }) {
            for (let i = 0; i < routesPaths.length; i++) {
                const route = routesPaths[i]
                if (route === "/") {
                    continue;
                }
                const trailingExtention = route.endsWith(".html") ? "" : ".html";
                try {
                    const filePath = path.join(outDir + route + trailingExtention);
                    const htmlString = await readHTML(filePath);
                    const modifiedContent = htmlString.replace(/opensearch.xml/g, "docs/opensearch.xml");
                    await writeToHTML(filePath, modifiedContent);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };
};

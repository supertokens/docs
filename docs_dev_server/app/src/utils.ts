import * as fs from "fs";
import * as htmlparser2 from "htmlparser2";

import { hardcodedLinksMapper, gettingStartedLinks, } from "./backendConstants";

export interface ErrorConstructor {
    statusCode: number;
    reason: string;
    currentTimeStamp: number;
}

export class ErrorConstructor implements ErrorConstructor {
    constructor(statusCode: number, reason: string) {
        this.statusCode = statusCode;
        this.reason = reason;
        this.currentTimeStamp = Date.now();
    }
}

export const assertFileExists = (filepath: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.access(filepath, err => {
            if (err) {
                const error = new ErrorConstructor(404, "Sorry, nothing exsist here");
                reject(error);
            } else {
                return resolve(true);
            }
        });
    });
};

export const readFileContent = (filepath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, "utf8", function(err, html) {
            if (err) {
                return reject(err);
            } else {
                return resolve(html);
            }
        });
    });
};

export const deleteFile = (filepath: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, err => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

export const writeData = (filepath: string, data: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, "utf8", err => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

export const doubleDocsFix = (paths: string) => {
    const hrefPaths = paths.split("/");
    if (hrefPaths.filter(path => path === "docs").length > 1) {
        const reverseArr = hrefPaths.reverse();
        let index = reverseArr.indexOf("docs");
        const newArr = [...reverseArr.slice(0, index), ...reverseArr.slice(index + 1)];
        const newHref = newArr.reverse().join("/");
        return newHref;
    } else {
        return paths;
    }
};

export const HtmlParser = (htmlFile: string) => {
    const replaceString: any = {};
    let parser = new htmlparser2.Parser(
        {
            onopentag(name, attribs) {
                if (name === "a" && attribs.href) {
                    const currentPath: string = attribs.href;
                    const fixDoubleDocLinks = doubleDocsFix(currentPath);
                    // Checking if new href does not produces any invalid link
                    const fixedLink = checkAndfixLink(fixDoubleDocLinks);
                    if (fixedLink !== currentPath) {
                        replaceString[`"${currentPath}"`] = fixedLink;
                    }
                }
                if (name === "meta" && attribs.content && attribs.property === "og:url") {
                    // comments same as that of href links
                    const currentPath: string = attribs.content;
                    const fixedLink = checkAndfixLink(currentPath);
                    if (fixedLink !== currentPath) {
                        replaceString[`"${currentPath}"`] = fixedLink;
                    }
                }
            }
        },
        { decodeEntities: true }
    );
    parser.write(htmlFile);
    parser.end();
    return replaceString;
};

function checkAndfixLink(currentPath: string): string {
    // if the url contains "/" in the end we are removing it (some url's may contain and some may not, making them consistent)
    let uniformPath: string =
        currentPath[currentPath.length - 1] === "/" ? currentPath.slice(0, currentPath.length - 1) : currentPath;
    // check if substring contains https://www.supertokens.io || http://wwww.supertokens.io  || https://supertokens.io || http://upertokens.io
    // if it does contain then remove it
    Object.keys(hardcodedLinksMapper).forEach(url => {
        if (uniformPath.includes(url)) {
            uniformPath = uniformPath.replace(url, "");
        }
    });
    const hrefPaths = uniformPath.split("/");
    // if the length of href is 3 ([''. 'docs', 'community']) then we know it is incorrect url
    if (hrefPaths.length === 3 && hrefPaths[1] === "docs") {
        // We append /getting-started/about since that is the valid url
        // if it is community or pro document we are going to show getting started
        if (gettingStartedLinks.hasOwnProperty(hrefPaths[2])) {
            uniformPath = uniformPath + "/getting-started/about";
        } else {
            // else we are going to show installation
            uniformPath = uniformPath + "/installation";
        }
        // this is fixed url with proper insertion
        return uniformPath;
    }
    // if nothing needs to be changed then we are going to return current path
    return currentPath;
}

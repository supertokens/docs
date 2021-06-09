import * as compression from "compression";
import * as express from "express";
import * as http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { assertFileExists, readFileContent, HtmlParser } from "./utils";
import * as bodyParser from "body-parser";
import { addCodeHighlighting } from "./codeHighlight";

let app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const nonDocsProxyOptions = {
    target: "https://supertokens.io",
    changeOrigin: true
};
const nonDocsProxy = createProxyMiddleware(nonDocsProxyOptions);

app.get("/docs/auth-react*", async function(req, res, next) {
    let filePath = req.path;
    let paths = req.path.split("/");
    let lastElem = paths[paths.length - 1];
    if (lastElem === "") {
        filePath = req.path.substring(0, req.path.length - 1);
        paths = req.path.split("/");
        lastElem = paths[paths.length - 1];
    }
    if (!lastElem.includes(".")) {
        try {
            filePath = "docs/auth-react/index.html"
            // This should throw error if file does not exsist
            await assertFileExists(filePath);
            const htmlFileContent = await readFileContent(filePath);
            res.set("Content-Type", "text/html");
            return res.send(htmlFileContent);
        } catch (error) {
            return next(error)
        }
    }
    return res.sendFile(filePath, {
        root: process.env.PROJECT_DIR,
        maxAge: 3600
    });
})

app.get("/docs/*", async function(req, res, next) {
    if (req.path === "/docs/") {
        return next();
    }
    let filePath = req.path;
    let paths = req.path.split("/");
    let lastElem = paths[paths.length - 1];
    if (lastElem === "") {
        filePath = req.path.substring(0, req.path.length - 1);
        paths = req.path.split("/");
        lastElem = paths[paths.length - 1];
    }
    if (!lastElem.includes(".")) {
        filePath += ".html";
        try {
            filePath = filePath.substring(1);
            // This should throw error if file does not exsist
            await assertFileExists(filePath);
            const htmlFileContent = await readFileContent(filePath);

            const replaceString = HtmlParser(htmlFileContent);
            const re = new RegExp(Object.keys(replaceString).join("|"), "gi");

            const docsLinkedFixed = htmlFileContent.replace(re, function(matched) {
                return replaceString[matched];
            });

            let outputHtml = addCodeHighlighting(docsLinkedFixed);

            res.set("Content-Type", "text/html");
            return res.send(outputHtml);
        } catch (error) {
            if (error.statusCode && error.statusCode === 404) {
                (req as any).show404 = true;
                return next();
            } else {
                return next(error);
            }
        }
    }
    return res.sendFile(filePath, {
        root: process.env.PROJECT_DIR,
        maxAge: 3600
    });
});

app.use("/docs", nonDocsProxy);
app.use("/static/*", nonDocsProxy);
app.use("*", async function (req, res, next) {
    return res.redirect("/docs")
})

app.use(async function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    sendSimpleInternalErrorPage(req, res, err);
});

let server = http.createServer(app);
(server as any).listen(process.env.PORT, "0.0.0.0");

async function sendSimpleInternalErrorPage(req: express.Request, res: express.Response, error: any) {
    if (error && error.statusCode && error.reason) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(error.statusCode).send(error.reason);
    } else {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(500).send("Sorry, something went wrong!");
    }
}

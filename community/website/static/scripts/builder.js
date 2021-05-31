
let userId = undefined;
let sessionId = undefined;
let infoFormFilledStorageKey = "st-info-filled";
let isInfoFormSubmitting = false;

function addCommonDocsScript() {
    let commonDocsScript = document.createElement("script");
    commonDocsScript.type = "text/javascript";
    commonDocsScript.src = "/docs/static/scripts/commonDocsBuilder.js";

    document.head.appendChild(commonDocsScript);
}

function addCommonStyleLink() {
    let commonCssScript = document.createElement("link");
    commonCssScript.rel = "stylesheet";
    commonCssScript.href = "/docs/static/style/commonDocs.css";

    document.head.appendChild(commonCssScript);
}

function goToGithub() {
    window.open("https://github.com/supertokens/supertokens-core", "_blank");
}

function changeVersionUIInHeader() {
    let links = document.getElementsByTagName("a");
    Array.from(links).forEach(link => {
        let splitLink = link.href.split("/");
        if (splitLink[splitLink.length - 1] === "versions") {
            let versionNumber = "";
            link.childNodes.forEach(child => {
                if (child.tagName === "H3") {
                    versionNumber = child.textContent;
                }
            });

            link.style.textDecoration = "none !important";

            link.innerHTML = `
                <div
                    style="display: flex; flex-direction: row; padding-left: 16px; padding-right: 16px; padding-top: 4px; padding-bottom: 4px;
                    align-items: center; border-radius: 6px; background-color: #1375ff">
                        <div
                            style="font-size: 16px; font-weight: bold; color: #ffffff; font-style: normal; white-space: nowrap;">
                                •  Community
                        </div>

                        <div
                            style="font-size: 16px; text-decoration: underline; color: #ffffff; margin-left: 10px; font-style: normal; white-space: nowrap;">
                                ${versionNumber}
                        </div>
                </div>
            `;
        }
    });
}

function addLinkToPro() {
    let a = document.getElementsByTagName("header")[0].childNodes[1];
    let header = document.getElementsByTagName("header")[0];

    let newElem = document.createElement("div");
    newElem.style.display = "flex";
    newElem.style.flexDirection = "row";
    newElem.style.alignItems = "center";
    newElem.innerHTML = `
        <a href="/docs/community/versions" class="header-version-text">
            ${a.innerHTML}    
        </a>
        <a href="/docs/pro/getting-started/installation" class="header-version-text"
            style="padding-left: 16px; padding-right: 16px; padding-top: 4px; padding-bottom: 4px; align-items: center; align-content: center">
            <div
                style="font-size: 16px; color: #222222; text-decoration: underline; font-style: normal; white-space: nowrap;">
                See Pro
            </div>
        </a>
    `;

    header.replaceChild(newElem, header.children[1])
}

document.addEventListener("DOMContentLoaded", () => {
    let body = document.getElementsByTagName("body")[0];

    // The common script does the following
    // - adds page footer
    // - for every elements with class specialNote, renders the note block
    // - for all elements with class additionalInformation, renders the collapsable additional information block
    addCommonDocsScript();
    addCommonStyleLink();
    // Changes the UI of the version number in the header
    // changeVersionUIInHeader();

    // addLinkToPro();

    // End of render, no rendering after this point
});

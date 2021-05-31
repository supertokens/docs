
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
    window.open("https://github.com/supertokens/supertokens-flask", "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    let body = document.getElementsByTagName("body")[0];

    // The common script does the following
    // - adds page footer
    // - for every elements with class specialNote, renders the note block
    // - for all elements with class additionalInformation, renders the collapsable additional information block
    addCommonDocsScript();
    addCommonStyleLink();

    // Prepare content
    // let postHeader = document.getElementsByClassName("postHeader").item(0);
    // if (postHeader !== undefined && postHeader !== null) {
    //     postHeader.parentNode.removeChild(postHeader);
    // }

    // End of render, no rendering after this point
});

// This file is for adding any client side JS that should run on each page.

function addFooter() {
    if (window.location.host === "localhost:3000") {
        // We may not be running the whole website. So we do not
        // display the footer
        return;
    }
    let footerContainer = document.createElement("div");
    footerContainer.style = "width: 100vw";

    let footerRoot = document.createElement("div");
    footerRoot.id = "supertokens-root";

    let bundleScript = document.createElement("script");
    bundleScript.src = "/static/bundle.js";

    footerContainer.appendChild(footerRoot);
    footerContainer.appendChild(bundleScript);

    document.body.appendChild(footerContainer);
}

document.addEventListener('DOMContentLoaded', function () {
    addFooter();
});
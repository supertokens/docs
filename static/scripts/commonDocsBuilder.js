function getAnalytics() {
    return new Promise((res, rej) => {
        let numberOfRetries = 20;
        const analytics = window.stAnalytics;
        if (analytics) {
            res(analytics.getInstance());
            return;
        }

        let interval = setInterval(() => {
            const stAnalytics = window.stAnalytics;
            numberOfRetries--;
            if (stAnalytics) {
                clearInterval(interval);
                res(stAnalytics.getInstance());
                return;
            }
            if (numberOfRetries < 0) {
                clearInterval(interval);
                rej("Already waited for 2 seconds");
            }
        }, 100);
    });
}

function sendButtonAnalytics(eventName, version = "v5", options) {
    getAnalytics().then((stAnalytics) =>
        stAnalytics.sendEvent(
            eventName,
            {
                type: "button_click",
                ...options
            },
            version
        )
    );
}

function addHeaderAnalytics() {
    document.addEventListener('click', (e) => {
        if (e.target.src !== undefined && e.target.src.includes("logoWithNameLight.png")) {
            window.sendButtonAnalytics("button_header_home", "v5", { page_selected: 'documentation' })
        } else if (e.target.href !== undefined && e.target.href.includes('/blog')) {
            window.sendButtonAnalytics("button_header_blog", "v5", { page_selected: 'documentation' })
        } else if (e.target.src !== undefined && e.target.src.includes("headerGithubIcon.png")) {
            window.sendButtonAnalytics("button_header_github", "v5", { page_selected: "documentation" })
        } else if (e.target.href !== undefined && e.target.href.includes("discord") && e.target.parentElement.tagName === "LI") {
            window.sendButtonAnalytics("button_header_discord", "v5", { page_selected: "documentation" })
        }
        return
    })
}

function changeLogoHref() {
    let superTokensLinks = document.getElementsByTagName("a");
    Array.from(superTokensLinks).forEach(element => {
        if (element.childElementCount > 0) {
            Array.from(element.children).forEach(child => {
                if (child.tagName === "IMG") {
                    if (child.src.includes("logoWithNameLight.png")) {
                        child.id = "st-header-docs-logo"
                        element.href = "/";
                    }
                }
            });
        }
    });
}

function parseAndModifyLinksIfNeeded() {
    let links = document.getElementsByTagName("a");
    Array.from(links).forEach(element => {
        let hrefSplit = element.href.split("/");
        if (hrefSplit[hrefSplit.length - 1] === "versions") {
            element.className = "header-version-text";
        }
    });
}

function replaceSidebarSingleChildCategories() {
    let navGroups = document.getElementsByClassName("navGroup");
    Array.from(navGroups).forEach(navGroup => {
        let groupTitleElement = navGroup.children[0];
        let title = groupTitleElement.childNodes[0].nodeValue;
        let dropdown = navGroup.lastChild;
        let identifier = "SIDEBAR_REPLACE_DOC_";
        if (title.includes(identifier)) {
            let actualTitle = title.replace(identifier, "");
            groupTitleElement.childNodes[0].nodeValue = actualTitle;
            groupTitleElement.removeChild(groupTitleElement.lastChild);

            let href = dropdown.children[0].children[0].href;
            let isActive = window.location.href === href;
            let style = "";
            if (isActive) {
                style = "text-decoration: none; color: rgb(255, 153, 51)";
            }
            navGroup.innerHTML = `
                <a
                    style="${style}"
                    href="${href}"
                    class="navGroupCategoryTitle">
                    ${actualTitle}
                </a>
            `;
        }
    });
}

function modifyTopNavTitleForMobile() {
    let navBreadcrumbCollection = document.getElementsByClassName("navBreadcrumb");
    Array.from(navBreadcrumbCollection).forEach(navBreadCrumb => {
        navBreadCrumb.childNodes.forEach(child => {
            if (child.tagName === "H2") {
                child.childNodes.forEach(subChild => {
                    if (subChild.tagName === "SPAN") {
                        let currentText = subChild.textContent;
                        let identifier = "SIDEBAR_REPLACE_DOC_";
                        if (currentText.includes(identifier)) {
                            currentText = currentText.replace(identifier, "");
                        }

                        subChild.textContent = currentText;
                    }
                });
            }
        });
    });
}

function renderSpecialNotes() {
    let specialNotes = document.getElementsByClassName("specialNote");
    for (let i = 0; i < specialNotes.length; i++) {
        let text = " " + specialNotes[i].innerHTML.trim();
        specialNotes[i].innerHTML = `
            <div style="border: 1px solid #ff9933; border-radius: 6px; padding-left: 20px; padding-right: 20px; padding-top: 16px; padding-bottom: 16px; display: flex; background-color: #fff5ea">
            <div style="margin-right: 10px;">
                <img src="/docs/static/assets/star.png" style="width: 14px"></img>
            </div>
            <div style="flex: 1"><span style="color: #222222; font-size: 16px; font-weight: bold">Note:</span>` + text + `</div></div>
        `;
    }
}

function addFooter() {
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

function renderAdditionalInformationItems() {
    // ---- make additional information part
    let additionalInfo = document.getElementsByClassName("additionalInformation");
    for (let i = 0; i < additionalInfo.length; i++) {
        let imgPath = "/docs/static/assets/plus.png";
        let curr = additionalInfo[i];
        let text = curr.getAttribute("text");
        if (text === null) {
            continue;
        }
        let buttonText = text;
        let children = curr.innerHTML.trim();
        let randomID = "additionalInfoRandomId" + i;
        let html = `
        <div class="${randomID}">
            <div style="display: flex">
            <div onClick="clickedAdditionalInfo('${randomID}', '${buttonText}')">
                <h3 style="
                    padding-top: 10px; padding-bottom: 10px; margin-top: 0px;
                    display: flex; cursor: pointer; background-color: #f2f2f2;
                    align-items: center; justify-content: flex-start; font-weight: bold;
                    font-size: 18px; line-height: 20pt; color: #34354e;
                    padding-left: 15px; padding-right: 20px; border-radius: 6px;">
                    <img src="${imgPath}" style="width: 12px; margin-right: 10px"></img>
                    ${buttonText}
                </h3>
            </div>
            </div>
            <div style="display: none">
                ${children}
            </div>
        </div>
        `;
        curr.innerHTML = html;
    }
    // -------------
}

clickedAdditionalInfo = (randomId, text) => {
    let element = document.getElementsByClassName(randomId)[0];
    let isCollapsed = element.children[1].style.display === "none";
    if (!isCollapsed) {
        let imgPath = "/docs/static/assets/plus.png";
        element.children[0].children[0].children[0].children[0].src = imgPath;
        element.children[1].style.display = "none";


    } else {
        let imgPath = "/docs/static/assets/minus.png";
        element.children[0].children[0].children[0].children[0].src = imgPath;
        element.children[1].style.display = "block";
    }
};

function renderHoverables() {
    let hoverables = document.getElementsByClassName("hoverable");
    for (let i = 0; i < hoverables.length; i++) {
        let current = hoverables[i];
        let text = current.getAttribute("text");
        if (text === null || text === undefined) {
            continue;
        }
        let children = current.innerHTML.trim();
        let idRoot = "hoverable-root-" + i;
        let idChild = "hoverable-child-" + i;
        let html = `
            <span id="${idRoot}" class="hover-root" onmouseenter="showHoverable('${idRoot}', '${idChild}')" onmouseleave="hideHoverable('${idRoot}', '${idChild}')">
                <mark class="hover-text">${text.trim()}</mark>
                    <div
                        id="${idChild}"
                        class="hover-child">
                            <div style="position: absolute; height: 30px; width: 30px; background-color: #222222; top: 0px; right: 0px; transform: translate(40%, -40%); color: #ffffff;
                                border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer" onmousedown="hideHoverable('${idRoot}', '${idChild}')">
                                    <img
                                        src="/docs/static/assets/dismiss.png"
                                        alt="close"
                                        style="width: 17px; height: 17px"/>
                            </div>
                            ` + children + `
                    </div>
            </span>
        `;
        current.innerHTML = html;
    }
}

function showHoverable(idRoot, idChild) {
    let hoverChild = document.getElementById(idChild);
    let childHeight = hoverChild.getBoundingClientRect().height;
    let childWidth = hoverChild.getBoundingClientRect().width;
    let hoverRoot = document.getElementById(idRoot);
    let parentTop = hoverRoot.getBoundingClientRect().top;
    let parentLeft = hoverRoot.getBoundingClientRect().left;
    let parentWidth = hoverRoot.getBoundingClientRect().width;
    let parentHeight = hoverRoot.getBoundingClientRect().height;
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    if (parentTop + parentHeight + childHeight < windowHeight) {
        // Child can be shown below
        hoverChild.style.top = `${parentHeight + 10}px`;
    } else {
        // Show child above
        hoverChild.style.top = `${-1 * (parentHeight + childHeight - 15)}px`;
    }

    let rightCalc = parentLeft + parentWidth + childWidth;
    if (rightCalc > windowWidth) {
        // Child will overflow on the right, shift to the left(only iOS seems to need this)
        let overflow = rightCalc - windowWidth;
        hoverChild.style.left = `${-overflow}px`;

        let leftVal = parseInt(window.getComputedStyle(hoverChild).getPropertyValue("left").replace("px", ""));
        let leftOverflow = parentLeft - Math.abs(leftVal);
        if (leftOverflow < 0) {
            hoverChild.style.left = `calc(${Math.abs(leftOverflow / 1.5)}px + ${window.getComputedStyle(hoverChild).getPropertyValue("left")})`;
        }
    } else {
        hoverChild.style.right = "0px";
        hoverChild.style.transform = "translate(30%, 0)";
    }

    // 1024 is the css min width for desktop
    if (window.innerWidth < 1024) {
        hoverChild.style.removeProperty("left");
        hoverChild.style.removeProperty("right");
        hoverChild.style.removeProperty("transform");
    }

    hoverChild.style.visibility = "visible";
}

function hideHoverable(idRoot, idChild) {
    let hoverChild = document.getElementById(idChild);
    hoverChild.style.visibility = "hidden";
}

function modifyPrevNextButtons() {
    let superTokensPrevButtons = document.getElementsByClassName("docs-prev");
    let superTokensNextButtons = document.getElementsByClassName("docs-next");
    Array.from(superTokensPrevButtons).forEach(element => {
        element.style = "display: flex; align-items: center; padding-left: 10px; padding-right: 10px; border-radius: 6px; border-width: 0px; background-color: #f2f2f2; cursor: pointer; box-shadow: 0px 2px 4px rgba(0,0,0,0.16)";
        element.children[1].style.marginLeft = "10px";
        element.children[1].innerHTML = "Previous";
    });

    Array.from(superTokensNextButtons).forEach(element => {
        element.style = "display: flex; align-items: center; padding-left: 10px; padding-right: 10px; border-radius: 6px; border-width: 0px; background-color: #f2f2f2; cursor: pointer; box-shadow: 0px 2px 4px rgba(0,0,0,0.16)";
        element.children[0].style.marginRight = "10px";
        element.children[0].innerHTML = "Next";
    });
}

function uncollapseInitial(node, title, currNav) {
    node.classList.remove("hide");
    currNav.children[0].innerHTML = title + `<span class="arrow rotate"><svg width="24" height="24" viewBox="0 0 24 24"><path fill="#ff9933" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>`;
}

function collapseInitial(node, title, currNav) {
    node.classList.add("hide");
    currNav.children[0].innerHTML = title + `<span class="arrow"><svg width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(86, 86, 86)" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>`;
}

function uncollapse(node, title, currNav) {
    node.classList.remove("hide");
    let arrow = currNav.children[0].children[0];
    arrow.classList.toggle("rotate");
}

function collapse(node, title, currNav) {
    node.classList.add("hide");
    let arrow = currNav.children[0].children[0];
    arrow.classList.toggle("rotate");
}

function isDescendant(parent, child) {
    if (child === undefined) {
        return;
    }
    var node = child.parentNode;
    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function modifySubNavGroups() {
    let navGroupElements = document.getElementsByClassName("navGroup subNavGroup");

    let activeItem = document.getElementsByClassName("navListItemActive")[0];

    for (let i = 0; i < navGroupElements.length; i++) {
        let currNav = navGroupElements[i];
        const title = currNav.children[0].innerText;
        const content = navGroupElements[i].childNodes[1];
        currNav.children[0].classList.add("collapsible");
        currNav.childNodes[0].addEventListener("click", function () {
            if (!content.classList.contains("hide")) {
                collapse(content, title, currNav);
            } else {
                uncollapse(content, title, currNav);
            }
        });

        if (isDescendant(currNav, activeItem)) {
            uncollapseInitial(content, title, currNav);
        } else {
            collapseInitial(content, title, currNav);
        }

    }
}

async function sendFeedback(uuid, url, happy) {
    try {
        // TODO: send feedback
        // fetch("https://api-jdhry57disoejch.qually.com/0/supertokens/documentation/feedback", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "api-version": "0",
        //     },
        //     body: JSON.stringify({
        //         url: `${url}/latest-version=${getLatestVersion()}`,
        //         userId: userIdFromFrame,
        //         helpful: happy,
        //     }),
        // });
    } catch {
        // IGNORING
    }
}

function feedbackSelected(happy) {
    let uuid = getUUID();
    let url = window.location.href;
    if (happy) {
        // happy selected
        sendFeedback(uuid, url, true);
        let happyImage = document.getElementById("feedback-happy");
        let sadImage = document.getElementById("feedback-sad");

        happyImage.className = "feedback-button-happy selected";
        sadImage.className = "feedback-button-sad";
    } else {
        // sad selected
        sendFeedback(uuid, url, false);
        let happyImage = document.getElementById("feedback-happy");
        let sadImage = document.getElementById("feedback-sad");

        happyImage.className = "feedback-button-happy";
        sadImage.className = "feedback-button-sad selected";
    }
}

function getFeedbackButtons(mode) {
    let alignItems = "center";
    let justifyContent = "center";

    if (mode === "mobile") {
        alignItems = "left";
        justifyContent = "left";
    }

    let splittedCurrPath = window.location.pathname.split("/");
    let happySelected = "/docs/static/assets/docsFeedbackYesSelected.png";
    let sadSelected = "/docs/static/assets/docsFeedbackNoSelected.png";
    return `
        <div
            style="display: flex; flex: 1; flex-direction: column; align-items: ` + alignItems + `; justify-content: ` + justifyContent + `">
            <div
                style="display: flex;">
                <img
                    id="feedback-sad"
                    src="` + sadSelected + `"
                    class="feedback-button-sad"
                    onClick="feedbackSelected(false)"/>
                <img
                    id="feedback-happy"
                    src="` + happySelected + `"
                    class="feedback-button-happy"
                    onClick="feedbackSelected(true)"/>
            </div>
            <div
                style="font-size: 16px; color: #222222; margin-top: 10px">
                Was it helpful?
            </div>
        </div>
    `;
}

function addFeedbackButtons() {
    let prevNextContainer = document.getElementsByClassName("docs-prevnext")[0];
    if (prevNextContainer === null || prevNextContainer === undefined) {
        return;
    }
    if (window.screen.width <= 735) {
        // MOBILE
        let feedbackButton = getFeedbackButtons("mobile");
        prevNextContainer.innerHTML = `
            <div style="position: relative">
                ` + feedbackButton + `
                ` + prevNextContainer.innerHTML + `
            </div>
        `;
    } else {
        // WEB
        let feedbackButton = getFeedbackButtons("web");
        prevNextContainer.innerHTML = `
            <div style="position: relative">
                ` + prevNextContainer.innerHTML + `
                ` + feedbackButton + `
            </div>
        `;
    }
}

function addGithubToHeader() {
    let header = document.getElementsByClassName("fixedHeaderContainer")[0];
    let splittedCurrPath = window.location.pathname.split("/");
    let imgPath = "/docs/static/assets/headerGithubIcon.png";
    header.innerHTML = `
    <div style="position: relative">
        ` + header.innerHTML + `
        <img
            src="` + imgPath + `"
            style="width: 58px; height: 58px; position: absolute; top: -12px; right: 0px; cursor: pointer"
            onClick="goToGithub()">
        </img>
    </div>
    `;
}

function addAntcsScript() {
    const analyticsScript = document.createElement("script");
    analyticsScript.src = "/static/antcs.js";
    document.body.appendChild(analyticsScript)
}

function addChatWidget() {
    const driftChatbot = document.createElement("script");
    driftChatbot.src = "/static/drift.js";
    document.body.appendChild(driftChatbot)
}

async function aTagWithAnalytics(gotoPage, eventName, metaData) {
    stAnalytics.getInstance().sendButtonEvent(eventName, metaData);
    await new Promise(resolve => setTimeout(resolve, 100));
    window.location.href = gotoPage;
}

// Turn off ESLint for this file because it's sent down to users as-is.
/* eslint-disable */
function addCopyButtonToCodeSnippets() {
    function button(label, ariaLabel, icon, className) {
        const btn = document.createElement('button');
        btn.classList.add('btnIcon', className);
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-label', ariaLabel);
        btn.innerHTML =
            '<div class="btnIcon__body">' +
            icon +
            '<strong class="btnIcon__label">' +
            label +
            '</strong>' +
            '</div>';
        return btn;
    }

    function addButtons(codeBlockSelector, btn) {
        document.querySelectorAll(codeBlockSelector).forEach(function (code) {
            code.parentNode.appendChild(btn.cloneNode(true));
        });
    }

    const copyIcon =
        '<svg width="12" height="12" viewBox="340 364 14 15" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M342 375.974h4v.998h-4v-.998zm5-5.987h-5v.998h5v-.998zm2 2.994v-1.995l-3 2.993 3 2.994v-1.996h5v-1.995h-5zm-4.5-.997H342v.998h2.5v-.997zm-2.5 2.993h2.5v-.998H342v.998zm9 .998h1v1.996c-.016.28-.11.514-.297.702-.187.187-.422.28-.703.296h-10c-.547 0-1-.452-1-.998v-10.976c0-.546.453-.998 1-.998h3c0-1.107.89-1.996 2-1.996 1.11 0 2 .89 2 1.996h3c.547 0 1 .452 1 .998v4.99h-1v-2.995h-10v8.98h10v-1.996zm-9-7.983h8c0-.544-.453-.996-1-.996h-1c-.547 0-1-.453-1-.998 0-.546-.453-.998-1-.998-.547 0-1 .452-1 .998 0 .545-.453.998-1 .998h-1c-.547 0-1 .452-1 .997z" fill-rule="evenodd"/></svg>';

    addButtons(
        '.hljs',
        button('Copy', 'Copy code to clipboard', copyIcon, 'btnClipboard'),
    );

    const clipboard = new ClipboardJS('.btnClipboard', {
        target: function (trigger) {
            return trigger.parentNode.querySelector('code');
        },
    });

    clipboard.on('success', function (event) {
        event.clearSelection();
        const textEl = event.trigger.querySelector('.btnIcon__label');
        textEl.textContent = 'Copied';
        setTimeout(function () {
            textEl.textContent = 'Copy';
        }, 2000);
    });
};

function addRecipeNameToHeader() {

    let headerRecipeName = undefined;

    if (window.location.pathname.startsWith("/docs/emailpassword/")) {
        headerRecipeName = "EmailPassword Recipe";
    } else if (window.location.pathname.startsWith("/docs/thirdparty/")) {
        headerRecipeName = "ThirdParty Recipe";
    } else if (window.location.pathname.startsWith("/docs/thirdpartyemailpassword/")) {
        headerRecipeName = "ThirdPartyEmailPassword Recipe";
    } else if (window.location.pathname.startsWith("/docs/session/")) {
        headerRecipeName = "Session Recipe";
    }

    if (headerRecipeName !== undefined && window.screen.width > 735) {
        {
            let elem = document.getElementsByTagName("header")[0];
            let lastChild = elem.children[elem.children.length - 1];
            let p = document.createElement("p");
            p.style.marginBottom = "0px";
            p.style.marginTop = "0px";
            p.style.marginLeft = "30px";
            p.style.display = "flex";
            p.style.alignItems = "center";
            p.style.fontSize = "20px";
            p.style.fontStyle = "italic";
            p.innerHTML = headerRecipeName;
            elem.insertBefore(p, lastChild);
        }

        {
            let elem = document.getElementsByTagName("header")[0];
            let lastChild = elem.children[elem.children.length - 1];
            let p = document.createElement("p");
            p.style.marginBottom = "0px";
            p.style.marginTop = "0px";
            p.style.marginLeft = "10px";
            p.style.marginRight = "10px";
            p.style.display = "flex";
            p.style.alignItems = "center";
            p.style.fontSize = "20px";
            p.innerHTML = "|";
            elem.insertBefore(p, lastChild);
        }

        {
            let elem = document.getElementsByTagName("header")[0];
            let lastChild = elem.children[elem.children.length - 1];
            let a = document.createElement("a");
            a.style.marginBottom = "0px";
            a.style.marginTop = "0px";
            a.style.display = "flex";
            a.style.alignItems = "center";
            a.style.fontSize = "20px";
            a.style.fontStyle = "italic";
            a.style.color = "#58a6ff"
            a.innerHTML = "See All Recipes";
            a.href = "/docs/community/recipes"
            elem.insertBefore(a, lastChild);
        }
    }
}

function changeDiscordLinkTextOnDesktop() {
    const discrodLink = document.querySelector(`.navigationSlider .slidingNav ul li a[href="/discord"]`);
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleWindowChange(e) {
        // Check if the media query is true
        if (e.matches) {
            if (discrodLink !== null) {
                discrodLink.textContent = "Ask questions";
            }
        } else {
            discrodLink.textContent = "Discord";
        }
    }

    // Register event listener
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleWindowChange);
    } else {
        // if addEventListener is not available use the deprecated addListener
        mediaQuery.addListener(handleWindowChange);
    }

    // Initial check
    handleWindowChange(mediaQuery);
}

function getTagFromUrl() {
    let tagName = ""

    if (window.location.pathname.startsWith("/docs/") && window.location.pathname.split("/").length >= 3) {
        tagName = window.location.pathname.split("/")[2]
    }

    return tagName
}

function getVersionFromUrl() {
    let version = ""
    let docsearchMetaTag = document.getElementsByName("docsearch:version")[0]

    if (docsearchMetaTag) {
        version = docsearchMetaTag.getAttribute('content')
    }

    return version
}

function addAlgoliaSearch() {

    if (window.screen.width <= 735) {
        // Mobile
        return
    }

    let tag = getTagFromUrl()
    let version = getVersionFromUrl()

    let docSearchInput = document.createElement("input");
    docSearchInput.type = "search";
    docSearchInput.className = "docsearch-input";
    docSearchInput.id = "docsearch-input";
    docSearchInput.placeholder = "Search";

    let docSearchCssLink = document.createElement("link");
    docSearchCssLink.rel = "stylesheet";
    docSearchCssLink.href = "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"

    let docSearchLibrary = document.createElement("script");
    docSearchLibrary.type = "text/javascript"
    docSearchLibrary.src = "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js";

    let docSearchScript = document.createElement("script");
    docSearchScript.type = "text/javascript"
    docSearchScript.text = `docsearch({
        apiKey: '0eeffc534667153c420f239cc6c7f4fb',
        indexName: 'supertokens',
        inputSelector: '.docsearch-input',
        algoliaOptions: {
            'facetFilters': ["tags:${tag}", "version:${version}"]
          },
        enhancedSearchInput: true,
        debug: true
        });`;

    document.head.appendChild(docSearchCssLink);
    let header = document.getElementsByTagName("header")[0]
    header.appendChild(docSearchInput);


    document.body.appendChild(docSearchLibrary);

    docSearchLibrary.addEventListener('load', () => {
        document.body.appendChild(docSearchScript);
    })
}

/**
 * This file does not need to wait for DOMContentLoaded because it only gets added after it has loaded
 */

// Change href of logo in the top right to home. Do this first
changeLogoHref();
// Modify all links to remove extra /docs
// Modify <a> tags if needed, for example versions link in the header
parseAndModifyLinksIfNeeded();
// Replace all sidebars with text SIDEBAR_REPLACE_DOC with a link to their first child
replaceSidebarSingleChildCategories();
// Replace title in top nav for mobile where text includes SIDEBAR_REPLACE_DOC
modifyTopNavTitleForMobile();
// add page footer
addFooter();
// render all note blocks
renderSpecialNotes();
// render all additional information blocks
renderAdditionalInformationItems();
// Render all hoverable text elements
renderHoverables();
// Changes the text and UI of the previous and next buttons on each markdown file
modifyPrevNextButtons();
// Hides the previous next buttons for some pages, remove the function call to start showing them
// hidePrevNextButtonsIfNeeded();

// add copy button to code snippets
addCopyButtonToCodeSnippets();

// Modifies the UI and functionality of all nested navigation items in the sidebar
modifySubNavGroups();
// Adds the feedback buttons to the bottom of the page asking the user if the page was helpful
// addFeedbackButtons();
// Adds the github folded icon button to the header
if (!window.location.pathname.includes("/pro/")) {
    addGithubToHeader();
}
addChatWidget()
addAntcsScript()
addHeaderAnalytics()
addRecipeNameToHeader()
changeDiscordLinkTextOnDesktop()
addAlgoliaSearch()
// NO MORE RENDERING AFTER THIS POINT, ONLY PERFORM CALCULATIONS

document.body.style.display = "block";
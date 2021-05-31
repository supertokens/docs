export function addCodeHighlighting(result: string): string {

    result = removeExtraSpaceFromHighlightTags(result);

    while (result.indexOf("__HIGHLIGHT_PHRASE__") !== -1) {
        result = addCodeHighlightingHelper("__HIGHLIGHT_PHRASE__",
            "__END_HIGHLIGHT_PHRASE__", "<span class=\"hljs-code-highlight-phrase\">", result);
    }

    while (result.indexOf("__HIGHLIGHT__") !== -1) {
        result = addCodeHighlightingHelper("__HIGHLIGHT__",
            "__END_HIGHLIGHT__", "<span class=\"hljs-code-highlight\">", result);
    }

    return result;
}

// there could be one space after the starting and one space before the ending tag. We want to replace those.
function removeExtraSpaceFromHighlightTags(result: string): string {
    let matched = result.match(/__HIGHLIGHT_PHRASE__ [^ ]/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            result = result.replace(matched[i], "__HIGHLIGHT_PHRASE__" + matched[i].charAt(matched[i].length - 1));
        }
    }

    matched = result.match(/__HIGHLIGHT__ [^ ]/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            result = result.replace(matched[i], "__HIGHLIGHT__" + matched[i].charAt(matched[i].length - 1));
        }
    }

    matched = result.match(/[^ ] __END_HIGHLIGHT_PHRASE__/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            result = result.replace(matched[i], matched[i].charAt(0) + "__END_HIGHLIGHT_PHRASE__");
        }
    }

    matched = result.match(/[^ ] __END_HIGHLIGHT__/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            result = result.replace(matched[i], matched[i].charAt(0) + "__END_HIGHLIGHT__");
        }
    }

    return result;
}

function addCodeHighlightingHelper(startPhraseToRemove: string, endPhraseToRemove: string, phraseToAdd: string, result: string): string {
    let spansCount = getNoOfSpansBetweenFirstOccuranceOfStartAndEndPhrase(
        result.indexOf(startPhraseToRemove), result.indexOf(endPhraseToRemove), result);

    if (spansCount.noOfEnds === spansCount.noOfStarts) {
        result = result.replace(startPhraseToRemove, phraseToAdd);
        result = result.replace(endPhraseToRemove, "</span>");
    } else {
        let finalStartPos = result.indexOf(startPhraseToRemove);
        let finalEndPos = result.indexOf(endPhraseToRemove);
        do {
            if (spansCount.noOfEnds > spansCount.noOfStarts) {
                finalStartPos--;
            } else {
                finalEndPos++;
            }
            spansCount = getNoOfSpansBetweenFirstOccuranceOfStartAndEndPhrase(
                finalStartPos, finalEndPos, result);
        } while (spansCount.noOfEnds !== spansCount.noOfStarts)

        // console.log(result.substring(finalStartPos, finalEndPos));
        // let before = result.substr(0, finalStartPos);
        // let after = result.substr(finalEndPos);

        result = result.substr(0, finalStartPos) + phraseToAdd +
            result.substring(finalStartPos, finalEndPos) + "</span>" + result.substr(finalEndPos);

        // console.log(result.substring(finalStartPos, finalEndPos + phraseToAdd.length + 7));

        // check if before and after are the same
        // console.log(result.substr(0, finalStartPos) === before);
        // console.log(after === result.substr(finalEndPos + phraseToAdd.length + 7))


        result = result.replace(startPhraseToRemove, "");
        result = result.replace(endPhraseToRemove, "");
    }

    return result;
}

function getNoOfSpansBetweenFirstOccuranceOfStartAndEndPhrase(startPos: number, endPos: number, html: string): {
    noOfStarts: number,
    noOfEnds: number
} {
    let subStr = html.substring(startPos, endPos);
    // example of a subStr is __HIGHLIGHT_PHRASE__appName</span>: <span class="hljs-string">"YOUR APP NAME"</span>,

    let numberOfSpanEnds = (subStr.match(/<\/span>/g) || []).length;

    let numberOfSpanStarts = (subStr.match(/<span([^>]*)>/g) || []).length;

    return {
        noOfEnds: numberOfSpanEnds,
        noOfStarts: numberOfSpanStarts
    }
}
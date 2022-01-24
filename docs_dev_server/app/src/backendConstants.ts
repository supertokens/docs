import { redirectPaths, PAGE_PATHS } from "./frontendConstants";

export let pathExistOnFrontend = {};

for (let pageKeys in PAGE_PATHS) {
    if (PAGE_PATHS.hasOwnProperty(pageKeys)) {
        const pagePath = PAGE_PATHS[pageKeys];
        pathExistOnFrontend[pagePath] = true;
    }
}
pathExistOnFrontend = { ...redirectPaths, ...pathExistOnFrontend };

// https://www.supertokens.com || http://wwww.supertokens.com  || https://supertokens.com || http://supertokens.com
export const hardcodedLinksMapper = {
    "https://www.supertokens.com": true,
    "http://wwww.supertokens.com": true,
    "https://supertokens.com": true,
    "http://supertokens.com": true
};

export const gettingStartedLinks = {
    community: true,
    pro: true
};

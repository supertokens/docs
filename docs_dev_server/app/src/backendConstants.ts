import { redirectPaths, PAGE_PATHS } from "./frontendConstants";

export let pathExistOnFrontend = {};

for (let pageKeys in PAGE_PATHS) {
    if (PAGE_PATHS.hasOwnProperty(pageKeys)) {
        const pagePath = PAGE_PATHS[pageKeys];
        pathExistOnFrontend[pagePath] = true;
    }
}
pathExistOnFrontend = { ...redirectPaths, ...pathExistOnFrontend };

// https://www.supertokens.io || http://wwww.supertokens.io  || https://supertokens.io || http://supertokens.io
export const hardcodedLinksMapper = {
    "https://www.supertokens.io": true,
    "http://wwww.supertokens.io": true,
    "https://supertokens.io": true,
    "http://supertokens.io": true
};

export const gettingStartedLinks = {
    community: true,
    pro: true
};

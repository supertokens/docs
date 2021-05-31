declare global {
    interface Window {
        redirectPaths: any;
    }
}

export const IMAGE_PATH_PREFIX = "";
export let redirectPaths = {};
// Routes for the website with alt versions that have .html. When using these in the index file to decide what the user should see
// check both the actual path and the alt path. WHen using this to open pages do not use the alt version (it wont cause errors but the url will be ugly)
export const PAGE_PATHS = {
    home: "/",

    dashboard: "/dashboard",
    dashboardAlt: "/dashboard.html",

    pricing: "/pricing",
    pricingAlt: "/pricing.html",

    intro: "/intro",
    introAlt: "/intro.html",

    signup: "/signup",
    signupAlt: "/signup.html",

    checkout: "/checkout",
    checkoutAlt: "/checkout.html",

    communityDocsLanding: "/docs/community/getting-started/installation",
    communityDocsLandingAlt: "/docs/community/getting-started/installation.html",

    proDocsLanding: "/docs/pro/getting-started/installation",
    proDocsLandingAlt: "/docs/pro/getting-started/installation.html",

    spreadsheet: "/update-seo-content",
    spreadsheetAlt: "/update-seo-content.html"
};

const licenseBaseUrl = "/legal/";

export const LICENSE_PATH = {
    community: licenseBaseUrl + "community-license",
    pro: licenseBaseUrl + "pro-license",
    externalContributors: licenseBaseUrl + "external-contributors",
    openSourceLicense: licenseBaseUrl + "open-source-licenses",
    terms: licenseBaseUrl + "terms-and-conditions",
    privacy: licenseBaseUrl + "privacy-policy"
};

if (typeof window !== "undefined") {
    window.redirectPaths = {
        "/facebook": "https://www.facebook.com/SuperTokenss/",
        "/github": "https://github.com/supertokens/supertokens-core",
        "/linkedin": "https://www.linkedin.com/company/supertokens/",
        "/slack":
            "https://join.slack.com/t/webmobilesecurity/shared_invite/enQtODM4MDM2MTQ1MDYyLTFiNmNhYzRlNGNjODhkNjc5MDRlYTBmZTBiNjFhOTFhYjI1MTc3ZWI2ZjY3Y2M3ZjY1MGJhZmRiNDFjNDNjOTM",
        "/twitter": "https://twitter.com/supertokensio",
        "/discord": "https://discordapp.com/invite/4WXseq7"
    };
} else {
    redirectPaths = {
        "/facebook": "https://www.facebook.com/SuperTokenss/",
        "/github": "https://github.com/supertokens/supertokens-core",
        "/linkedin": "https://www.linkedin.com/company/supertokens/",
        "/slack":
            "https://join.slack.com/t/webmobilesecurity/shared_invite/enQtODM4MDM2MTQ1MDYyLTFiNmNhYzRlNGNjODhkNjc5MDRlYTBmZTBiNjFhOTFhYjI1MTc3ZWI2ZjY3Y2M3ZjY1MGJhZmRiNDFjNDNjOTM",
        "/twitter": "https://twitter.com/supertokensio",
        "/discord": "https://discordapp.com/invite/4WXseq7"
    };
}

export const analyticsBase = "supertokensAy-";

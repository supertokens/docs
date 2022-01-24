// --- Important Note ---
// This file is shared in the backend as well. Do not import any node modules or files here

// --- Important Note ---
// Do not change this file from backend repository

let API_URL = "https://dev.api.supertokens.com/0";
let API_DOMAIN = "https://dev.api.supertokens.com";
let API_BASE_PATH = "/0/auth";
let WEBSITE_DOMAIN = "http://localhost:9001";
let MOCK_ENABLED = false;

try {
    MOCK_ENABLED = window.location.hostname === "localhost"
    // we have try catch cause nexJS throws "window not defined" error..
    if (window.location.hostname === "supertokens.com" || window.location.hostname === "www.supertokens.com") {
        API_URL = "https://api.supertokens.com/0";
        API_DOMAIN = "https://api.supertokens.com";
        API_BASE_PATH = "/0/auth";
        WEBSITE_DOMAIN = "https://supertokens.com";
    } else if (window.location.hostname === "test.supertokens.com") {
        API_URL = "https://dev.api.supertokens.com/0";
        API_DOMAIN = "https://dev.api.supertokens.com";
        API_BASE_PATH = "/0/auth";
        WEBSITE_DOMAIN = "https://test.supertokens.com";
    }
} catch (ignored) { }

export { API_URL, API_DOMAIN, API_BASE_PATH, WEBSITE_DOMAIN, MOCK_ENABLED };
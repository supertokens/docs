export const DOCS_CONNTENT_DIV_ID = "docs-content";
export const TOC_UI_TYPE_SWITCH_ID = "toc-ui-type-switch";

export const DOC_STORE_DEFAULT_VALUES = {
  "appInfo.appName": "<YOUR_APP_NAME>",
  "appInfo.apiDomain": "<YOUR_API_DOMAIN>",
  "appInfo.websiteDomain": "<YOUR_WEBSITE_DOMAIN>",
  "coreInfo.uri": "https://try.supertokens.com",
  "coreInfo.key": "<YOUR_API_KEY>",
};

export const DOC_PAGE_STORE_DEFAULT_VALUES = {
  apiDomain: "<YOUR_API_DOMAIN>",
  apiBasePath: "/auth",
  coreDomain: "<CORE_DOMAIN>",
  tenantId: "public",
  appId: "public",
} as const;

let API_URL = "https://dev.api.supertokens.com/0";
let API_DOMAIN = "https://dev.api.supertokens.com";
let API_BASE_PATH = "/0/auth";
let WEBSITE_DOMAIN = "http://localhost:9001";
let MOCK_ENABLED = false;

try {
  MOCK_ENABLED = window.location.hostname === "localhost";
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
} catch (ignored) {}

export { API_URL, API_DOMAIN, API_BASE_PATH, WEBSITE_DOMAIN, MOCK_ENABLED };

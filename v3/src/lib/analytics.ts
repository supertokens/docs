import axios from "axios";
import supertokens from "supertokens-website";
import { v1 as uuidv1 } from "uuid";
import Cookies from "js-cookie";

import { trackEvent } from "./amplitude";

const COOKIE_CONSENT = "cookieconsent_status";
const ANTCS_ENDPOINT_URL = "https://api.supertokens.com/0/antcs/ents";
const baseAnalyticsStorageKey = "st_antcs";
const antcsCookieName = "st_antcs"; // analytics cookie name

function getAnalyticsCookieOptions() {
  let domain = window.location.hostname;
  if (window.location.hostname.endsWith("supertokens.com")) {
    // This is done to make sure that the same cookie is shared across the
    // multiple subdomain of supertokens.com
    domain = ".supertokens.com";
  }

  return {
    domain,
    sameSite: "Lax",
    expires: 10000,
  };
}

const hostnameWhitelisting = {
  "supertokens.com": true,
  "www.supertokens.com": true,
};

const udidBlacklised = {
  "st-team-udid1234": true,
};

const userConfig = {
  timeout: 20000,
  maxRedirects: 20,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "api-version": 0,
  },
};

class Analytics {
  private userId: string | null = null;
  static instance: Analytics | null = null;
  private currentPage: { pathname: string; hostname: string; timestamp: number } | null = null;

  saveCurrentPage() {
    this.currentPage = {
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      timestamp: Date.now(),
    };
  }

  getUserId() {
    let userIdInLocalStorage = localStorage === null ? null : localStorage.getItem(baseAnalyticsStorageKey);

    if (userIdInLocalStorage === "st-team-udid1234") {
      return userIdInLocalStorage;
    }

    if (this.hasCookieConsent !== false) {
      const valueInCookie = Cookies.get(antcsCookieName);
      if (valueInCookie !== undefined) {
        return valueInCookie;
      }
      if (userIdInLocalStorage !== null) {
        Cookies.set(antcsCookieName, userIdInLocalStorage, getAnalyticsCookieOptions());
        localStorage.removeItem(baseAnalyticsStorageKey);
        return userIdInLocalStorage;
      }

      const newUserId = uuidv1();
      Cookies.set(antcsCookieName, newUserId, getAnalyticsCookieOptions());
      return newUserId;
    }
    return "untracked_user";
  }

  getCommonData() {
    if (this.userId === null) {
      this.userId = this.getUserId();
    }
    const userId = this.userId;
    return {
      page: window.location.href,
      userId: userId,
    };
  }

  get hasCookieConsent() {
    if (window.location.hostname === "localhost") return true;
    const consentCookie = Cookies.get(COOKIE_CONSENT);
    if (consentCookie) {
      if (consentCookie === "deny") {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  get canSendEvents() {
    const hostname = window.location.hostname;
    const userId = this.getCommonData().userId;
    if (
      (hostnameWhitelisting[hostname] === true || hostname.endsWith(".demo.supertokens.com")) &&
      udidBlacklised.hasOwnProperty(userId) === false &&
      this.hasCookieConsent
    ) {
      return true;
    }
    return false;
  }

  async sendEvent(
    eventName: string,
    payload: { data: Record<string, unknown>; version?: string; useBeacon?: boolean },
  ) {
    if (!this.hasCookieConsent) return;
    const { data, version = "v1", useBeacon = false } = payload;
    const commonData = this.getCommonData();
    const sessionUserId = await getSessionUserId();
    const timestamp = Date.now();
    const eventData = {
      timestamp,
      version,
      sessionUserId,
      ...commonData,
      ...data,
    };

    if (!this.canSendEvents) {
      console.log(eventName, eventData);
      return;
    }

    const eventPayload = {
      eventName: eventName,
      data: eventData,
    };
    axios.post(ANTCS_ENDPOINT_URL, eventPayload, userConfig).catch(console.error);
    if (eventName !== "page_view") {
      trackEvent(eventName, eventData, useBeacon);
    }
    return;
  }

  async sendPageViewEvent() {
    if (!this.currentPage) {
      this.saveCurrentPage();
    } else {
      this.sendPageExitEvent("page-change");
    }
    await this.sendEvent("page_view", {
      data: {
        type: "page_view",
        referrer: document.referrer,
      },
      version: "v1",
    });
  }

  isNewPage() {
    if (this.currentPage.hostname !== window.location.hostname) {
      return true;
    }
    if (this.currentPage.pathname !== window.location.pathname) {
      return true;
    }
    return false;
  }

  // page-change: user navigates from one page to another inside the docs app
  // app-close: user closes the tab, user navigates to another website from the same tab
  async sendPageExitEvent(transitionType: "page-change" | "app-close") {
    if (transitionType === "page-change" && !this.isNewPage()) return;
    if (!this.currentPage) return;
    const clickTimestamp = Date.now();
    const timeSpentOnPage = clickTimestamp - this.currentPage.timestamp;
    await this.sendEvent("page_exit", {
      data: {
        hostname: this.currentPage.hostname,
        pathname: this.currentPage.pathname,
        timeSpentOnPage,
      },
      version: "v1",
      useBeacon: transitionType === "app-close",
    });
    this.saveCurrentPage();
  }
}

function getAnalyticsInstance() {
  if (Analytics.instance === null) {
    Analytics.instance = new Analytics();
  }
  return Analytics.instance;
}

export function trackPageView() {
  getAnalyticsInstance().sendPageViewEvent();
}

export function trackPageExit(transitionType: "page-change" | "app-close") {
  getAnalyticsInstance().sendPageExitEvent(transitionType);
}

export function trackButtonClick(eventName: string, version = "v1", options?: Object) {
  getAnalyticsInstance().sendEvent(eventName, {
    data: {
      type: "button_click",
      ...options,
    },
    version,
  });
}

export function trackFormSubmit(eventName: string, version = "v1", options?: Object) {
  getAnalyticsInstance().sendEvent(eventName, {
    data: {
      type: "form_submit",
      ...options,
    },
    version,
  });
}

export function trackLinkClick(eventName: string, version = "v5", options?: Object) {
  getAnalyticsInstance().sendEvent(eventName, {
    data: {
      type: "link_click",
      ...options,
    },
    version,
  });
}

async function getSessionUserId() {
  let userId = "";
  try {
    userId = await supertokens.getUserId();
  } catch (e) {}
  return userId;
}

export const AnalyticsEventNames = {
  buttonTocItem: "button_toc_item",
  buttonHeaderBlog: "button_header_blog",
  buttonHeaderDiscord: "button_header_discord",
  buttonHeaderGithub: "button_header_github",
  buttonSidebarLink: "button_sidebar_link",
  buttonSidebarCategory: "button_sidebar_category",
  buttonHeaderWebsite: "button_header_website",
  buttonHeaderViewDashboard: "button_header_view_dashboard",
  buttonHeaderSignup: "button_header_signup",
  buttonSearchResult: "button_search_result",
  buttonSearchViewAllResults: "button_search_view_all_results",
  buttonSearchTrigger: "button_search_trigger",
  buttonReferenceCard: "button_reference_card",
  buttonFeedbackForm: "button_documentation_submit_feedback",
};

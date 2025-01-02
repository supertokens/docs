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
	private pageViewEventSent = false;
	static instance: Analytics | null = null;

	getUserId() {
		let userIdInLocalStorage =
			localStorage === null
				? null
				: localStorage.getItem(baseAnalyticsStorageKey);

		if (userIdInLocalStorage === "st-team-udid1234") {
			return userIdInLocalStorage;
		}

		if (checkCookieConsentIsAllowed() !== false) {
			const valueInCookie = Cookies.get(antcsCookieName);
			if (valueInCookie !== undefined) {
				return valueInCookie;
			}
			if (userIdInLocalStorage !== null) {
				Cookies.set(
					antcsCookieName,
					userIdInLocalStorage,
					getAnalyticsCookieOptions(),
				);
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

	shouldSendEventsToApi() {
		const hostname = window.location.hostname;
		const userId = this.getCommonData().userId;
		if (
			(hostnameWhitelisting[hostname] === true ||
				hostname.endsWith(".demo.supertokens.com")) &&
			udidBlacklised.hasOwnProperty(userId) === false &&
			checkCookieConsentIsAllowed()
		) {
			return true;
		}
		return false;
	}

	async sendEvent(eventName, userData, analyticsVersion) {
		if (checkCookieConsentIsAllowed() !== false) {
			const version = analyticsVersion;
			const commonData = this.getCommonData();
			const sessionUserId = await getSessionUserId();
			const timestamp = Date.now();
			const data = {
				timestamp,
				version,
				sessionUserId,
				...commonData,
				...userData,
			};

			if (this.shouldSendEventsToApi()) {
				// since we don't care about the data returned, we don't need to use await
				// since we aren't using await, this shouldn't stop program as well if in case one of the api or function fails
				const payload = {
					eventName: eventName,
					data,
				};
				axios
					.post(ANTCS_ENDPOINT_URL, payload, userConfig)
					.then(() => {
						this.pageViewEventSent = true; // this is only for redirect links and only for page_view events
					})
					.catch(() => {
						this.pageViewEventSent = true; // this is only for redirect links and only for page_view events
					});
				if (eventName !== "page_view") {
					trackEvent(eventName, data);
				}
			} else {
				this.pageViewEventSent = true;
				// Do not remove this console logs as it's used on test and localhost site
				console.log(eventName, data);
			}
			return;
		}
	}

	async sendPageViewEvents() {
		await this.sendEvent(
			"page_view",
			{
				type: "page_view",
				referrer: document.referrer,
			},
			"v1",
		);
	}
}

function getAnalyticsInstance() {
	if (Analytics.instance === null) {
		Analytics.instance = new Analytics();
	}
	return Analytics.instance;
}

export function trackPageView() {
	getAnalyticsInstance().sendPageViewEvents();
}

export function trackButtonClick(
	eventName: string,
	version = "v1",
	options?: Object,
) {
	getAnalyticsInstance().sendEvent(
		eventName,
		{
			type: "button_click",
			...options,
		},
		version,
	);
}

export function trackLinkClick(
	eventName: string,
	version = "v5",
	options?: Object,
) {
	getAnalyticsInstance().sendEvent(
		eventName,
		{
			type: "link_click",
			...options,
		},
		version,
	);
}

function checkCookieConsentIsAllowed() {
	const consentCookie = Cookies.get(COOKIE_CONSENT);
	if (consentCookie) {
		if (consentCookie === "deny") {
			return false;
		} else {
			return true;
		}
	}
	return undefined;
}

async function getSessionUserId() {
	let userId = "";
	try {
		userId = await supertokens.getUserId();
	} catch (e) {}
	return userId;
}

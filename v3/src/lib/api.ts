import { API_URL, MOCK_ENABLED } from "./constants";
import axios from "axios";
import { SaasAppListItem, SaasConnectionUrlDomain } from "./types";

const AxiosInstance = axios.create({
	baseURL: API_URL,
	timeout: 50000,
	maxRedirects: 20,
	withCredentials: true,
	xsrfCookieName: "",
	xsrfHeaderName: "",
});

export async function getWebJsURI() {
	const endpoint = "/frontend/web-js";
	const apiVersion = "0";

	try {
		const response = await AxiosInstance.get(endpoint, {
			headers: {
				"api-version": apiVersion,
			},
		});

		return response.data as { uri: Record<string, string> };
	} catch (err) {
		return {
			uri: {
				dateprovider:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/dateprovider.test.js",
				emailpassword:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/emailpassword.test.js",
				emailverification:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/emailverification.test.js",
				multifactorauth:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/multifactorauth.test.js",
				multitenancy:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/multitenancy.test.js",
				oauth2provider:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/oauth2provider.test.js",
				passwordless:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/passwordless.test.js",
				session:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/session.test.js",
				supertokens:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/supertokens.test.js",
				thirdparty:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/thirdparty.test.js",
				totp: "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/totp.test.js",
				website:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/website.test.js",
				userroles:
					"https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/userroles.test.js",
			},
		};
	}
}

export async function getSupportedPlugins(planType: string) {
	const endpoint = "/plugins";
	const apiVersion = "0";
	const response = await AxiosInstance.get(endpoint, {
		params: {
			planType: planType === "COMMERCIAL_TRIAL" ? "COMMERCIAL" : planType,
			mode: "PRODUCTION",
		},
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as { plugins: { id: string; displayName: string }[] };
}

export async function getSupportedFrontends() {
	const endpoint = "/frontends";
	const apiVersion = "0";
	const response = await AxiosInstance.get(endpoint, {
		params: {
			mode: "PRODUCTION",
		},
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as { frontends: { id: string; displayName: string }[] };
}

export async function getSupportedDrivers() {
	const endpoint = "/drivers";
	const apiVersion = "0";
	const response = await AxiosInstance.get(endpoint, {
		params: {
			planType: "FREE",
			mode: "PRODUCTION",
		},
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as { drivers: { id: string; displayName: string }[] };
}

export async function getCompatibility(driver: string, frontend: string) {
	const endpoint = "/compatibility";
	const apiVersion = "0";
	const response = await AxiosInstance.get(endpoint, {
		params: {
			planType: "FREE",
			plugin: "postgresql",
			driver,
			frontend,
		},
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as {
		cores: string[];
		coreToDriver: { [key: string]: string[] };
		coreToPlugin: { [key: string]: string[] };
		driverToFrontend: { [key: string]: string[] };
	};
}

export async function getAuthReactURI() {
	const endpoint = "/frontend/auth-react";
	const apiVersion = "0";

	try {
		const response = await AxiosInstance.get(endpoint, {
			headers: {
				"api-version": apiVersion,
			},
		});

		return response.data as { uri: string };
	} catch (err) {
		console.error(err);
		return {
			uri: "https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@vX.Y.Z/build/static/js/main.test.js",
		};
	}
}

export async function getUserInformation() {
	const endpoint = "/user/info";
	const apiVersion = "0";
	const response = await AxiosInstance.get(endpoint, {
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as {
		email: string;
		name: string;
		country: string;
		company: string;
	};
}

export async function getCoreVersionForPlugin(plugin: string) {
	const endpoint = "/plugin/dependency/cores";
	const apiVersion = "0";
	const response = await AxiosInstance.get(endpoint, {
		params: {
			planType: "FREE",
			mode: "PRODUCTION",
			name: plugin,
		},
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as { cores: string[] };
}

export async function getSaasApp() {
	let apiResponse: SaasConnectionUrlDomain[] = [];
	if (MOCK_ENABLED) {
		apiResponse = MockAPIResponse;
	} else {
		const oldApp = await getOldSaasApps();
		if (oldApp) return oldApp;
	}

	apiResponse = await getNewSaasApps();

	for (let i = 0; i < apiResponse.length; i++) {
		let curr = apiResponse[i];
		if ("apps" in curr && !curr.isTemporarilyRemoved) {
			for (let y = 0; y < curr.apps.length; y++) {
				let currApp = curr.apps[y];
				if (currApp.appId === "public") {
					let devDeployment = currApp.deployments[0];
					if (
						currApp.deployments.length > 1 &&
						currApp.deployments[1].deploymentType === "development"
					) {
						devDeployment = currApp.deployments[1];
					}
					return devDeployment.connectionInfo!;
				}
			}
		}
	}
}

async function getOldSaasApps() {
	const endpoint = "/saas/apps";
	const apiVersion = "1";

	const response = await AxiosInstance.get(endpoint, {
		headers: {
			"api-version": apiVersion,
		},
	});
	const olderResult = response.data as SaasAppListItem[];
	if (olderResult.length > 0) {
		return olderResult[0].devDeployment.connectionInfo!;
	}
	return undefined;
}

async function getNewSaasApps() {
	const endpoint = "/saas/multi-tenancy/connection-uri-domain/list";
	const apiVersion = "1";

	const response = await AxiosInstance.get(endpoint, {
		headers: {
			"api-version": apiVersion,
		},
	});

	return response.data as SaasConnectionUrlDomain[] | undefined;
}

const MockAPIResponse: SaasConnectionUrlDomain[] = [
	{
		deploymentId:
			"56a112ceb9e659c2fa0d19b63d76ead284bac7523f3b705bee90a38bd68ed424",
		region: "us-east-1",
		deploymentName: "My App 1",
		isTemporarilyRemoved: false,
		apps: [
			{
				appId: "public",
				deployments: [
					{
						deploymentType: "development",
						coreVersion: "6.0",
						connectionInfo: {
							host: "https://st-dev-47fa5b70-1bbe-11ee-8d64-91038b6bd2c7.aws.supertokens.io",
							apiKeys: ["7b9N8m8U3jgtx=ZeNWn21fBsvg"],
						},
						config: [
							{
								keyName: "access_token_validity",
								value: "3600",
								description:
									"Type: integer\nTime in seconds for how long an access token is valid for.",
							},
							{
								keyName: "access_token_blacklisting",
								value: "false",
								description:
									"Type: boolean\nDeprecated, please see changelog. Only used in CDI<=2.18\nIf true, allows for immediate revocation of any access token. Keep in mind that setting this to true will resultin a db query for each API call that requires authentication.",
							},
							{
								keyName: "access_token_signing_key_dynamic",
								value: "true",
								description:
									"Type: boolean\nDeprecated, please see changelog.\nIf this is set to true, the access tokens created using CDI<=2.18 will be signed using a static signing key.",
							},
							{
								keyName: "access_token_dynamic_signing_key_update_interval",
								value: "168",
								description:
									"Type: integer\nTime in hours for how frequently the dynamic signing key will change.",
							},
							{
								keyName: "refresh_token_validity",
								value: "144000",
								description:
									"Type: double\nTime in mins for how long a refresh token is valid for.",
							},
							{
								keyName: "password_reset_token_lifetime",
								value: "3600000",
								description:
									"Type: long\nTime in milliseconds for how long a password reset token / link is valid for.",
							},
							{
								keyName: "email_verification_token_lifetime",
								value: "86400000",
								description:
									"Type: long\nTime in milliseconds for how long an email verification token / link is valid for.",
							},
							{
								keyName: "passwordless_max_code_input_attempts",
								value: "5",
								description:
									"Type: integer\nThe maximum number of code input attempts per login before the user needs to restart.",
							},
							{
								keyName: "passwordless_code_lifetime",
								value: "900000",
								description:
									"Type: long\nTime in milliseconds for how long a passwordless code is valid for.",
							},
							{
								keyName: "totp_max_attempts",
								value: "5",
								description:
									"Type: integer\nThe maximum number of invalid TOTP attempts that will trigger rate limiting.",
							},
							{
								keyName: "totp_rate_limit_cooldown_sec",
								value: "900",
								description:
									"Type: integer\nThe time in seconds for which the user will be rate limited once totp_max_attempts is crossed.",
							},
							{
								keyName: "password_hashing_alg",
								value: "BCRYPT",
								description:
									'Type: "ARGON2" | "BCRYPT"\nThe password hashing algorithm to use. Values are "ARGON2" | "BCRYPT"',
							},
						],
						status: "active",
					},
				],
			},
		],
	},
];

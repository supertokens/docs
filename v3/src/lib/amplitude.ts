import * as amplitude from "@amplitude/analytics-browser";

let amplitudeInitialized = false;
let amplitudeUserIdentified = false;

export const initAmplitude = () => {
	if (amplitudeInitialized) {
		return;
	}
	amplitude.init("b61f581fe0775f56038a6264af879aa9", {
		logLevel:
			isTestEnv() || isDev()
				? amplitude.Types.LogLevel.Debug
				: amplitude.Types.LogLevel.None,
		autocapture: {
			attribution: true,
			pageViews: true,
			sessions: true,
			formInteractions: true,
			fileDownloads: true,
			elementInteractions: true,
		},
	});
	amplitudeInitialized = true;
};

export const trackEvent = (event: string, properties: Record<string, any>) => {
	if (!amplitudeInitialized) {
		initAmplitude();
	}
	amplitude.track(event, properties);
};

const identifyEvent = new amplitude.Identify();

export const identifyUser = (
	properties: Record<string, amplitude.Types.ValidPropertyType>,
) => {
	if (!amplitudeInitialized) {
		initAmplitude();
	}
	if (amplitudeUserIdentified) {
		return;
	}
	for (const [key, value] of Object.entries(properties)) {
		identifyEvent.set(key, value);
	}

	amplitude.identify(identifyEvent);
	amplitudeUserIdentified = true;
};

function isDev() {
	return window.location.host.startsWith("localhost");
}
function isTestEnv() {
	return window.location.host === "test.supertokens.com";
}

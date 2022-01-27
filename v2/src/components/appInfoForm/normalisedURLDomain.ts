function isAnIpAddress(ipaddress: string) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
    );
}

export default class NormalisedURLDomain {
    private value: string;

    constructor(url: string) {
        this.value = normaliseURLDomainOrThrowError(url);
    }

    getAsStringDangerous = (): string => {
        return this.value;
    };
}

function normaliseURLDomainOrThrowError(input: string, ignoreProtocol = false): string {
    input = input.trim();
    try {
        if (!input.startsWith("http://") && !input.startsWith("https://")) {
            throw new Error("converting to proper URL");
        }
        const urlObj: URL = new URL(input);
        if (ignoreProtocol) {
            if (urlObj.hostname.startsWith("localhost") || isAnIpAddress(urlObj.hostname)) {
                input = "http://" + urlObj.host + urlObj.pathname;
            } else {
                input = "https://" + urlObj.host + urlObj.pathname;
            }
        } else {
            input = urlObj.protocol + "//" + urlObj.host + urlObj.pathname;
        }
        return input;
        // eslint-disable-next-line no-empty
    } catch (err) { }

    if (input.startsWith("/")) {
        throw new Error("Please provide a valid domain name");
    }

    // not a valid URL
    if (input.indexOf(".") === 0) {
        input = input.substr(1);
    }
    // If the input contains a . it means they have given a domain name.
    // So we try assuming that they have given a domain name
    if (
        (input.indexOf(".") !== -1 || input.startsWith("localhost")) &&
        !input.startsWith("http://") &&
        !input.startsWith("https://")
    ) {
        input = "https://" + input;
        // at this point, it should be a valid URL. So we test that before doing a recursive call
        try {
            new URL(input);
            return normaliseURLDomainOrThrowError(input, true);

            // eslint-disable-next-line no-empty
        } catch (err) { }
    }
    throw new Error("Please provide a valid domain name");
}

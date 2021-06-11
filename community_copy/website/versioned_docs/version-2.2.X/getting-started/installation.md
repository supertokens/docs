---
id: version-2.2.X-installation
title: Quick trial
hide_title: true
original_id: installation
---

# Quick trial

To try SuperTokens, you need to run our http service. You can run it yourself, or use our managed service. For ease of trial, we have one running for you at ```https://try.supertokens.io```.

1) Integrate our [backend SDK](../backend-integration) into your app. This SDK will talk to the SuperTokens service for creating / refreshing / revoking sessions. Connect the SDK to ```https://try.supertokens.io```.

2) Integrate our [frontend SDK](../frontend-integration) into your website or mobile app. This will automatically take care of refreshing the session, if required, when an API request is made.

3) Once you get a sense of how it works, please [signup](/signup) to either use our managed service or to [run SuperTokens on your own](./dev-prod-setup/setup). You need not use ```https://try.supertokens.io``` anymore.

> We recommended to use our managed service since that is easier to setup, manage and scale. Please see the [SuperTokens Pro documentation](/docs/pro/getting-started/installation) if using our managed service.
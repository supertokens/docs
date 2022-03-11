---
id: version-2.2.X-installation
title: Quick trial
hide_title: true
original_id: installation
---

# Quick trial

To try SuperTokens, you need to run our http service. For ease of trial, we have one running for you at ```https://try.supertokens.com```.

1) Integrate our [backend SDK](../backend-integration) into your app. This SDK will talk to the SuperTokens service for creating / refreshing / revoking sessions. Connect the SDK to ```https://try.supertokens.com```.

2) Integrate our [frontend SDK](../frontend-integration) into your website or mobile app. This will automatically take care of refreshing the session, if required, when an API request is made.

3) Once you get a sense of how it works, please [install the SuperTokens service](./dev-prod-setup/setup) on your backend for your dev / production environment. You need not use ```https://try.supertokens.com``` anymore.
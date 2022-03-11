---
id: version-2.2.X-about-license-keys
title: About License Keys
hide_title: true
original_id: about-license-keys
---

# License Keys

A license key is needed for the SuperTokens core to run:
- This key is provided to you in the zip file you install via the dashboard. 
- This key can also be downloaded separately from the dashboard and can be loaded into the core via the ```supertokens load-license``` [command](./cli/load-license)

### Trial Pro License
- Once you create a new pro app on the dashboard, you get a 30 day free trial license. During this time, you have access to all the pro features. 
- After the expiry of the trial license, you will have to start a subscription with us. Failure to do so will prevent the binary to start.

### Pro license
- Once you start a subscription with us, depending on your billing period, we will issue a new pro license key each time a payment is made.
- Each license key issued will have a grace period of 2 months:
    - Monthly billing: Pro license expires after 3 months from the date of issue.
    - Yearly billing: Pro license expires after 14 months from the date of issue.
- Failure to pay post the grace period will lead to the binary not working anymore.
- You can see a list of all issued licenses in your dashboard.

### Updating license keys
- You do not need to take any action for this as it happens automatically after a new license (trial or otherwise) is issued.
- In case you want to update it manually, you can use the ```supertokens load-license``` [command](./cli/load-license).

<div class="specialNote">
Please make sure that your license key is not leaked. In the event that you think it has been leaked, please <a href="mailto:team@supertokens.com">contact us</a>.
</div>
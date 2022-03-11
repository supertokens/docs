---
id: version-2.4.X-about-license-keys-old
title: About License Keys
hide_title: true
original_id: about-license-keys-old
---

# License Keys

A license key is needed for the SuperTokens core to run:
- This key is provided to you in the zip file you install via the dashboard. 
- If instead you moved to the pro version via ```supertokens update``` command, then the license key was automatically changed for you.
- This key can also be downloaded separately from the dashboard and can be loaded into the core via the ```supertokens load-license``` [command](./cli/load-license)

### Trial Pro License
- Once you create a new pro app on the dashboard, or update a community app to pro, you get a 30 day free trial license. During this time, you have access to all the pro features. 
- After the expiry of the trial license, you will have to start a [subscription](./about-payments) with us. Failure to do so will lead to an automatic downgrade to the community version with zero downtime.

### Pro license
- Once you start a [subscription](./about-payments) with us, depending on your billing period, we will issue a new pro license key each time a payment is made.
- Each license key issued will have a grace period of 2 months:
    - Monthly billing: Pro license expires after 3 months from the date of issue.
    - Yearly billing: Pro license expires after 14 months from the date of issue.
- Failure to pay post the grace period will lead to an automatic downgrade to the community version with zero downtime.
- You can see a list of all issued licenses in your dashboard.

### Updating license keys
- You do not need to take any action for this as it happens automatically after a new license (trial or otherwise) is issued.
- In case you want to update it manually, you can use the ```supertokens load-license``` [command](./cli/load-license).

### Downgrading to community version
- If your core is downgraded to the community version, you will loose access to the Pro benefits. 
- You do not need to take any action for this to come into effect. 
- Existing sessions will continue to work.
- The downgrade will only take effect after an instance restart.

<div class="specialNote">
Please make sure that your license key is not leaked. In the event that you think it has been leaked, please <a href="mailto:team@supertokens.com">contact us</a>.
</div>
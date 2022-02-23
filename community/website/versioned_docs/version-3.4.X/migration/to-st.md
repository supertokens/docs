---
id: version-3.4.X-to-st
title: Migrating to SuperTokens
hide_title: true
original_id: to-st
---

# Migrating to SuperTokens

## For login migration

<div class="additionalInformation" text="If you CANNOT migrate all existing users into db tables managed by SuperTokens">

You will want to use our `override` feature for this. Essentially, it allows you to override our core functions to use your existing database / identity provider for existing users, and use SuperTokens for new users.

Let's take an example in which we want to use the [EmailPassword recipe](/docs/emailpassword/introduction). Here we assume that you have an existing database of userIds, emails and their password hashes. We can implement the migration code as below (this example is for NodeJS, but a similar code structure applies for other frameworks):
<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let supertokens = require("supertokens-node");
let EmailPassword = require("supertokens-node/recipe/emailpassword");

supertokens.init({
   supertokens: {...},
   appInfo: {...},
   recipeList: [
      EmailPassword.init({
         override: {
            functions: (supertokensImpl) => {
               return {
                  ...supertokensImpl,
                  signIn: async (input) => {
                     // we check if the email exists in SuperTokens. If not,
                     // then the sign in should be handled by you.
                     if (await supertokensImpl.getUserByEmail({ email: input.email }) === undefined) {
                        // TODO: sign in using your db
                     } else {
                        return supertokensImpl.signIn(input);
                     }
                  },
                  signUp: async (input) => {
                     // all new users are created in SuperTokens;
                     return supertokensImpl.signUp(input);
                  },
                  getUserByEmail: async (input) => {
                     let superTokensUser = await supertokensImpl.getUserByEmail(input);
                     if (superTokensUser === undefined) {
                        let email = input.email;
                        // TODO: fetch and return user info from your database...
                     } else {
                        return superTokensUser;
                     }
                  },
                  getUserById: async (input) => {
                     let superTokensUser = await supertokensImpl.getUserById(input);
                     if (superTokensUser === undefined) {
                        let userId = input.userId;
                        // TODO: fetch and return user info from your database...
                     } else {
                        return superTokensUser;
                     }
                  },
                  getUserCount: async () => {
                     let supertokensCount = await supertokensImpl.getUserCount();
                     let yourUsersCount = 0;// TODO: fetch the count from your db
                     return yourUsersCount + supertokensCount;
                  }
               }
            }
         }
      })
   ]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

There are a few more function that can be overrided, but those need not be in most cases. To learn more about overriding functions, please visit the docs for the recipe that you want to use.

</div>

<div class="additionalInformation" text="If you CAN migrate all existing users into db tables managed by SuperTokens">

You cna find the database schema used by SuperTokens by visiting the recipe page > Quick setup > Database setup > And then choosing your db > Scrolling down and expanding the "See table structure" drop down.

If you are using our managed service, you can contact us via [email](mailto:team@supertokens.com) or via [Discord](/discord) and ask us to move your users from your database to the one we host for you (we use PostgreSQL).

</div>

## For session migration

<div class="additionalInformation" text="If you are OK with logging all users out">

This can be solved by replacing your session creation, verification and revocation calls with the ones from SuperTokens. Since SuperTokens' session verification is most likely going to be different, verification of existing session will most likely fail, logging out that user. Then when they log back in, they will be using SuperTokens session system.

</div>

<div class="additionalInformation" text="If you want to keep all existing users logged in">

For this approach, you should change the session verification, creation and revocation for all your APIs, excepting for one. This one API will be a new API whose job is to verify a session created from your system, revoke it, and create a new session using SuperTokens.

For all users, on first page load, if your session exists (and not SuperTokens' session), you want to call this special API, wait for it to switch sessions, and then continue with the rest of the app load.

</div>

[comment]: <> (TODO:)
[comment]: <> (Auth0)
[comment]: <> (Cognito)
[comment]: <> (Okta)
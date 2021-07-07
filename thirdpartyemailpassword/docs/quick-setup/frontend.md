---
id: frontend
title: Frontend
hide_title: true
---

# React Installation (5 mins)

> For framework specific implementation (like Next.js), please skip this section and go directly to the section with the name of your framework. 


This library provides a set of modules that you can add to your React application to implement authentication.

### An example implementation can be [found here](https://github.com/supertokens/supertokens-demo-react/blob/thirdpartyemailpassword/src/App.js).


## 1️⃣ npm install

```bash
npm i -s supertokens-auth-react
```

## 2️⃣ Call the `init` function

Then in your `App.js` file, import SuperTokens and call the [`init` function](../../auth-react/init). Please make sure to replace all the `appInfo` configurations values with yours.

> To learn more about filling in `appInfo`, please visit [the appInfo page](../appinfo)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
import React from 'react';

__HIGHLIGHT__ import SuperTokens from "supertokens-auth-react";
import ThirdPartyEmailPassword, {Github, Google, Facebook} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    appInfo: {
        // learn more about this on https://supertokens.io/docs/thirdpartyemailpassword/appinfo
        appName: "YOUR APP NAME",
        apiDomain: "YOUR API DOMAIN",
        websiteDomain: "YOUR WEBSITE DOMAIN"
    },
    recipeList: [
        ThirdPartyEmailPassword.init({
            signInAndUpFeature: {
                providers: [
                    Github.init(),
                    Google.init(),
                    Facebook.init(),
                ]
            }
        }),
        Session.init()
    ]
}); __END_HIGHLIGHT__


/* Your App */
class App extends React.component {
    render() {
       return (...)
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

<div class="specialNote" style="margin-bottom: 40px">
If you only want to use email and password, you do not have to pass any providers in the config. If you only want to use ThirdParty providers, you can set `disableEmailPassword` in the config to `true`. In that case you must pass at least 1 provider.
</div>


## 3️⃣ Setup routes
Enabling routing will allow SuperTokens to insert components in specific pages, such as for Sign-up / Sign-in page.

<!--DOCUSAURUS_CODE_TABS-->
<!--With react-router-dom-->

Call the `getSuperTokensRoutesForReactRouterDom` method from within any `react-router-dom` `Switch` component.

```js
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import SuperTokens, __HIGHLIGHT_PHRASE__ { getSuperTokensRoutesForReactRouterDom } __END_HIGHLIGHT_PHRASE__ from "supertokens-auth-react"; 
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    // Previously added configs
});


class App extends React.Components {
    render() {
        return (
            <Router>
                <YourNavBar/>
                <Switch>
                    __HIGHLIGHT_PHRASE__ {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))} __END_HIGHLIGHT_PHRASE__
                    {...}
                </Switch>
                <YourFooter />
            </Router>
        );
    }
}
```

<!--With custom routing-->

If you use a custom routing system in your React application, you can add SuperTokens routes via:

```js
import React from 'react';
import SuperTokens from "supertokens-auth-react";

class App extends React.Components {
    render() {
__HIGHLIGHT__        if (SuperTokens.canHandleRoute()) {
            return SuperTokens.getRoutingComponent()
        } __END_HIGHLIGHT__
        
        return (
            (...)
        );
    }

}
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 4️⃣ Protect your application with the Authentication wrapper

Use `ThirdPartyEmailPasswordAuth` component in order to protect authenticated parts of your application:


<!--DOCUSAURUS_CODE_TABS-->
<!--With react-router-dom-->

```js
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import SuperTokens, { getSuperTokensRoutesForReactRouterDom }  from "supertokens-auth-react"; 
import ThirdPartyEmailPassword, {__HIGHLIGHT_PHRASE__ ThirdPartyEmailPasswordAuth __END_HIGHLIGHT_PHRASE__} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    // Previously added configs
});


class App extends React.Components {
    render() {
        return (
            <Router>
                <YourNavBar/>
                <Switch>
                    {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}

__HIGHLIGHT__                    <Route path="/dashboard">
                        <ThirdPartyEmailPasswordAuth>
                            // Components that require to be protected by authentication
                        </ThirdPartyEmailPasswordAuth>
                    </Route> __END_HIGHLIGHT__

                    // Other components without authentication
                    {...}
                </Switch>
                <YourFooter />
            </Router>
        );
    }
}
```

<!--With custom routing-->

```js
import React from 'react';
import SuperTokens from "supertokens-auth-react";
import {__HIGHLIGHT_PHRASE__ ThirdPartyEmailPasswordAuth __END_HIGHLIGHT_PHRASE__} from "supertokens-auth-react/recipe/thirdpartyemailpassword";

class App extends React.Components {
    render() {
        if (SuperTokens.canHandleRoute()) {
            return SuperTokens.getRoutingComponent()
        } 
        
__HIGHLIGHT__        return (
            <ThirdPartyEmailPasswordAuth>
                // Components that require to be protected by authentication
            </ThirdPartyEmailPasswordAuth>
        ); __END_HIGHLIGHT__
    }

}
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 5️⃣ Add `axios` session interceptor
> This step is only applicable if you are using `axios`

Add the interceptor for each `axios` import call
<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
import axios from "axios";
__HIGHLIGHT__ import Session from "supertokens-auth-react/recipe/session";
Session.addAxiosInterceptors(axios); __END_HIGHLIGHT__

async function callAPI() {
    // use axios as you normally do
    let response = await axios.get(...);
}
```
<!--END_DOCUSAURUS_CODE_TABS-->



An example of this can be found in [our demo app](https://github.com/supertokens/supertokens-demo-react/blob/thirdpartyemailpassword/src/Home/CallAPIView.js#L4).

# Frontend setup completed 🎉🥳

If you navigate to `/auth` in your application, you should see the SuperTokens Sign-up / Sign-in widgets.

<img width="600px" src="/docs/static/assets/thirdpartyemailpassword/signin-light.png" />

At this stage, you've successfully integrated your website with SuperTokens. The next section will guide you through setting up your backend.
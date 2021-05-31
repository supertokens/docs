---
id: setting-up-frontend
title: 2. Showing Login UI
hide_title: true
---

# 2. Showing Login UI

We will show the login UI on `/auth` of your website. This can be changed by adding a `websiteBasePath` property in the `appInfo` object in the `supertokensConfig.js` file. For the rest of this page, we will assume you are using `/auth`.

## 1) Create the `pages/auth/[[...path]].js` page
- Be sure to create the `auth` folder in the `pages` folder.
- `[[...path]].js` will contain the component for showing SuperTokens UI
- An example of this can be found [here](https://github.com/supertokens/next.js/blob/canary/examples/with-supertokens/pages/auth/%5B%5B...path%5D%5D.js).

## 2) Create the `Auth` component:

<!--DOCUSAURUS_CODE_TABS-->
<!--pages/auth/[[...path]].js-->
```js
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import SuperTokens from 'supertokens-auth-react'
import { redirectToAuth } from 'supertokens-auth-react/recipe/thirdparty'

const SuperTokensComponentNoSSR = dynamic(
  new Promise((res) => res(SuperTokens.getRoutingComponent)),
  { ssr: false }
)

export default function Auth() {

  // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      redirectToAuth()
    }
  }, [])

  return (
      <SuperTokensComponentNoSSR />
  )
}
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 3) Visit `http://localhost:3000/auth`
If you see a login UI, then you have successfully completed this step! If not, please feel free to ask questions on [Discord](https://supertokens.io/discord)

---
id: protecting-route
title: 4. Protecting a website route
hide_title: true
---

# 4. Protecting a website route

Protecting a website route means that it cannot be accessed unless a user is signed in. If a non signed in user tries to access it, they will be redirected to the login page

Let's say we want to protect the home page of your website (`/` route). In this case, we can edit the `/pages/index.js` file to add an auth wrapper around your `Home` component like so:

<!--DOCUSAURUS_CODE_TABS-->
<!--pages/index.js-->

```jsx

import dynamic from 'next/dynamic'
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword'

const ThirdPartyEmailPasswordAuthNoSSR = dynamic(
  new Promise((res) =>
    res(ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth)
  ),
  { ssr: false }
)

export default function Home() {
  return (
    // we protect ProtectedPage by wrapping it
    // with ThirdPartyEmailPasswordAuthNoSSR

    <ThirdPartyEmailPasswordAuthNoSSR>
      <ProtectedPage />
    </ThirdPartyEmailPasswordAuthNoSSR>
  )
}

```

<!--END_DOCUSAURUS_CODE_TABS-->

- An example of this can be seen [here](https://github.com/supertokens/next.js/blob/canary/examples/with-supertokens/pages/index.js#L36).

## Test by navigating to `/`
You should be redirected to the login page. After that, sign in / up, and then visit `/` again. This time, there should be no redirection.

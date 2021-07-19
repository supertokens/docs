---
id: testing-with-postman
title: Testing with Postman
hide_title: true
---

# Testing with Postman

The following guide will go over the process of testing backend APIs with Postman. These APIs are automatically exposed via our backend SDK (`/auth/*` path).

#### Backend Setup:

- Make sure that the Session Recipe is correctly setup in your backend.
- For the examples given below we will be running our backend on domain `localhost` and port `3001`.

We will be testing the following actions through Postman:

<div class="additionalInformation" text="Create a new Session">

#### 1. Create a new Session
- We will first test creating a new session and check that session tokens are set.

- For example, in your backend API you can use the `Session.createNewSession` function and check that the session tokens are set in the response through Postman.

```js
// in you backend
app.post("/create-new-session", async (req, res) => {
    await Session.createNewSession(res, "test-user", {}, {})
    res.send({
        "message": "New user session created"
    })
})

```

- In Postman, set the request type to `POST`.
- Set the URL to `http://localhost:3001/create-new-session`
- In the Header tab, set key `rid` with value `session`.

- On a successful request, a new user session will be created, with session tokens being returned in the response. 

<img width="600px" src="/docs/static/assets/st-session-new-session.png" />

- You can see the session tokens set by the response by switching to the cookies tab

<img width="600px" src="/docs/static/assets/st-session-cookies.png" />

These cookies are:
- `sIdRefreshToken`
- `sAccessToken`
- `sRefreshToken`

More information about these cookies can be found [here](../common-customizations/sessions/cookie-consent)

</div>

<div class="additionalInformation" text="Session Verification">

#### 2. Session Verification

- We can also test APIs that require the user to be logged in.

- For example, we have an API used to query user data with the `verifySession` middleware as shown below.

```js
// The following code snippet is an example API. You do not need to 
// implement it in your app

app.post("/change-user-data", Session.verifySession(), async (req, res) => {
    let userId = req.session.getUserId();
      // mutate some user data
    res.send({
        userId
    })
})

```

- In Postman, set the request type to `POST`.
- Set the URL to `http://localhost:3001/change-user-data`
- In the Header tab, set key `rid` with value `session`.
- If you have the `antiCsrf` attribute set to `VIA_TOKEN` in your backend SuperTokens config, then, in the Postman Header tab, set the key as `anti-csrf` and value as the `anti-csrf` token retrieved from the login response.
- On a successful response, the response body will contain user data.

<img width="600px" src="/docs/static/assets/st-session-userid.png" />


- In case you query the `/change-user-data` API with an expired access token, you will get a `401` response with the message `try refresh token`. 

<img width="600px" src="/docs/static/assets/emailpassword/st-user-unauthorized.png" />

- To generate new session tokens you can use the `/auth/session/refresh` API as shown in the next section.

</div>

<div class="additionalInformation" text="Refreshing Session Tokens">

#### 3. Refreshing Session Tokens

- In case your `access token` expires you can call the `/auth/session/refresh` api to generate a new `access token` and `refresh token`.

- In Postman, set the request type to `POST`.
- Set the URL to `http://localhost:3001/auth/session/refresh`
- In the Header tab, set key `rid` with value `session`.
- On a successful response, new session tokens will be set

<img width="600px" src="/docs/static/assets/emailpassword/st-ep-refresh.png" />

- You can see the new session tokens by switching to the cookies tab

<img width="600px" src="/docs/static/assets/emailpassword/st-ep-refresh-cookies.png" />

</div>

<div class="additionalInformation" text="Logout">

#### 4. Logout

- The `/auth/signout` API will be used to invalidate the  user sessions. This will clear the session cookies set in postman.

- In Postman, set the request type to `POST`.
- Set the URL to `http://localhost:3001/auth/signout`
- In the Header tab, set key `rid` with value `session`.
- On a successful response, the session tokens will be cleared from Postman, and from the database

<img width="600px" src="/docs/static/assets/emailpassword/st-ep-signout.png" />


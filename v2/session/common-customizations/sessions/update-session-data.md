---
id: update-session-data
title: Update Session Data
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./session/common-customizations/sessions/update-session-data.md -->

# Update Session Data

Updating Session data can be achieved in two ways:

## 1) After session verification
<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let Session = require("supertokens-node/recipe/session");

app.post("/updateinfo", __HIGHLIGHT_PHRASE__ Session.verifySession() __END_HIGHLIGHT_PHRASE__, async (req, res) => {
      let session = req.session;

      let currSessionData = await session.getSessionData();

__HIGHLIGHT__      await session.updateSessionData(
            {newKey: "newValue", ...currSessionData}
      ); __END_HIGHLIGHT__

      res.json({message: "successfully updated Session data in the database"})
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- We first require session verification in order to get the `req.session` object
- Using that object, we call the `updateSessionData` with new content. This content completely overrides the existing object, that's why we first get the `currSessionData` info.
- The result is that the session data stored in the database (against the verified session) is updated. The change is instantly visible to other calls of `getSessionData` for this session.


## 2) Without session verification

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let Session = require("supertokens-node/recipe/session");

// we first get all the sessionHandles (string[]) for a user
let sessionHandles = Session.getAllSessionHandlesForUser(userId);

// we update all the session's JWTs for this user
sessionHandles.forEach(async (handle) => {
      let currSessionData = await Session.getSessionData(handle);

      await Session.updateSessionData(handle, 
            {newKey: "newValue", ...currJWTPayload}
      );
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

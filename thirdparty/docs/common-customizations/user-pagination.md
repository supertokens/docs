---
id: user-pagination
title: User Pagination and Count
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/docs/common-customizations/user-pagination.md -->

# User Pagination and Count

> This is applicable for supertokens core version >= 3.5. For older core versions, please visit your [backend SDK's reference docs](../sdks).

This feature allows you to loop through (on your backend) all the users in your app. It also allows you to get the number of users.

## Loop through users in your app
You can use the following functions to loop through users:

- Newest First

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
let {getUsersNewestFirst} = require("supertokens-node");

// get the latest 100 users
let {users, nextPaginationToken} = await getUsersNewestFirst();

// get the next 200 users
let {users, nextPaginationToken} = await Supertokens.getUsersNewestFirst({
    limit: 200,
    paginationToken: nextPaginationToken,
});

// get for specific recipes
let {users, nextPaginationToken} = await Supertokens.getUsersNewestFirst({
    limit: 200,
    paginationToken: nextPaginationToken,
    // only get for those users who signed up with email and password
    includeRecipeIds: ["emailpassword"]
});

```

<!--END_DOCUSAURUS_CODE_TABS-->

- Oldest First 

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
let {getUsersOldestFirst} = require("supertokens-node");

// get the latest 100 users
let {users, nextPaginationToken} = await getUsersOldestFirst();

// get the next 200 users
let {users, nextPaginationToken} = await Supertokens.getUsersOldestFirst({
    limit: 200,
    paginationToken: nextPaginationToken,
});

// get for specific recipes
let {users, nextPaginationToken} = await Supertokens.getUsersOldestFirst({
    limit: 200,
    paginationToken: nextPaginationToken,
    // only get for those users who signed up with email and password
    includeRecipeIds: ["emailpassword"]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->

- If the `nextPaginationToken` is `undefined`, then there are no more users to loop through.
- If there are no users in your app, then `nextPaginationToken` will be `undefined` and `users` will be an empty array

- Each element in the `users` array is according to the output of the core API as shown [here](TODO:).

## Get the number of users in your app
<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let {getUserCount} = require("supertokens-node");

let count = await getUserCount()
```
<!--END_DOCUSAURUS_CODE_TABS-->

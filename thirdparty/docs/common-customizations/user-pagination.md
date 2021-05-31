---
id: user-pagination
title: User Pagination
hide_title: true
---

# User Pagination

This feature allows you to loop through (on your backend) all the users in your app. It also allows you to get the number of users.

## Loop through users in your app
You can use the following functions to loop through users:

- Newest first

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let {getUsersNewestFirst} = require("supertokens-node/recipe/thirdparty");

// get the latest 100 users
let {users, nextPaginationToken} = await getUsersNewestFirst();

// get the next 200 users
let {users, nextPaginationToken} = await getUsersNewestFirst(200, nextPaginationToken);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Oldest first

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let {getUsersOldestFirst} = require("supertokens-node/recipe/thirdparty");

// get the oldest 100 users
let {users, nextPaginationToken} = await getUsersOldestFirst();

// get the next 200 users
let {users, nextPaginationToken} = await getUsersOldestFirst(200, nextPaginationToken);
```
<!--END_DOCUSAURUS_CODE_TABS-->

- If the `nextPaginationToken` is `undefined`, then there are no more users to loop through.
- If there are no users in your app, then `nextPaginationToken` will be `undefined` and `users` will be an empty array
- Each element in the `users` array is of the form as mentioned [here](https://github.com/supertokens/core-driver-interface/wiki#third-party-user).

## Get the number of users in your app

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
let {getUserCount} = require("supertokens-node/recipe/thirdparty");

let count = await getUserCount()
```
<!--END_DOCUSAURUS_CODE_TABS-->
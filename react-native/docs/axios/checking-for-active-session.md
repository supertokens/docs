---
id: checking-for-active-session
title: Checking if a session exists
hide_title: true
---

# Checking if a session exists

### The ```doesSessionExist``` function: [API Reference](../api-reference/axios#doessessionexist)

```ts
import SuperTokensRequest from 'supertokens-react-native/axios';

SuperTokensRequest.doesSessionExist().then(sessionExists => {
    if (sessionExists) {
        // take user to home
    } else {
        // take user to login
    }
}).catch(err => {
    //...
});
```

- Can also be used with `async/await`
- Returns a ```Promise<boolean>```
- If ```true```: There is an active session.
- If ```false```: There is no active session.


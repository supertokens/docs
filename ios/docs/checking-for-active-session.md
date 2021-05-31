---
id: checking-for-active-session
title: Checking if a session exists
hide_title: true
---

# Checking if a session exists

### The ```doesSessionExist``` function: [API Reference](./api-reference#supertokensdoessessionexist)

```swift
import SuperTokensSession

if SuperTokens.doesSessionExist() {
    // There is currently an active session
} else {
    // No sessions currently active
}
```
- Returns a ```boolean```
- If ```true```: There is an active session.
- If ```false```: There is no active session.


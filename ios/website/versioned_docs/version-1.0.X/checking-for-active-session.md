---
id: version-1.0.X-checking-for-active-session
title: Checking if a session exists
hide_title: true
original_id: checking-for-active-session
---

# Checking if a session exists

### The ```doesSessionExist``` function: [API Reference](./api-reference#supertokensdoessessionexist)

```swift
if SuperTokens.doesSessionExist() {
    // There is currently an active session
} else {
    // No sessions currently active
}
```
- Returns a ```boolean```
- If ```true```: There is an active session.
- If ```false```: There is no active session.


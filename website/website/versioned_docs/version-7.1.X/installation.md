---
id: version-7.1.X-installation
title: Installation
hide_title: true
original_id: installation
---

# Website SDK Installation

> Note: This docs is only for reference, and not a step by step guide for how to implement SuperTokens. For a guide, please see the [Session recipe docs](/docs/session/introduction).

This library provides a wrapper around ```fetch``` or ```axios``` to automatically refresh a session in case the access token has expired.

## Using ```npm```

```bash
npm i --save supertokens-website@^7.1.0
```


## Using ```<script>```
Put the following anywhere in your ```<head>``` tag

```html
<script src="https://cdn.jsdelivr.net/gh/supertokens/supertokens-website@7.1/bundle/bundle.js"></script>
```

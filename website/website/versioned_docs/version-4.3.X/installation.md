---
id: version-4.3.X-installation
title: Installation
hide_title: true
original_id: installation
---

# Website SDK Installation

This library provides a wrapper around ```fetch``` or ```axios``` to automatically refresh a session in case the access token has expired.

## Using ```npm```

```bash
npm i --save supertokens-website@~4.3.0
```

<div class="specialNote" style="margin-bottom: 40px">
You may get a warning about axios being a peer dependency for this package. If you only use fetch for your API calls you can safely ignore this warning.
</div>

## Using ```<script>```
Put the following anywhere in your ```<head>``` tag

```html
<script src="https://cdn.jsdelivr.net/gh/supertokens/supertokens-website@4.3/bundle/bundle.js"></script>
```

---
id: api-keys
title: Adding API Keys
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./community/docs/supertokens-core/self-hosted/api-keys.md -->

# Adding API Keys

> This is only relevant if you are running SuperTokens on your own.

Adding API keys to the core is as simple as setting an extra param.
<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e API_KEYS=<TO DO> \ __END_HIGHLIGHT__
    -d supertokens/supertokens-<db name>
```
<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

api_keys:
```
<!--END_DOCUSAURUS_CODE_TABS-->

- These are comma separated `string` values.
- The format is `key1,key2,key3`.
- Keys can only contain '=', '-' and alpha-numeric (including capital) chars.
- Each key must have a minimum length of 20 chars
- An example value is `"Akjnv3iunvsoi8=-sackjij3ncisds,asnj9=asdcda-OI982JIUN=-a"`. Notice the `,` in the string which separates the two keys `"Akjnv3iunvsoi8=-sackjij3ncisds"` and `"asnj9=asdcda-OI982JIUN=-a"`. So in the backend SDK, you should only provide one of these keys.

---
id: change-session-timeout
title: Change session timeout
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./session/docs/common-customizations/sessions/change-session-timeout.md -->

# Change session timeout

> By default, the session timeout is for 100 days. This means that a user will get logged out only after 100 days of inactivity.

This value can be changed by:
- Changing the `refresh_token_validity` value (time in mins): Determines the overall session timeout.
   - The default is 100 days.
- Changing the `access_token_validity` value (time in seconds): Does not affect the overall session timeout, but affects how often session refreshing occurs.
   - The default is 1 hour. 
   - This time does not determine the user experience, but only the security of the overall session system.

<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e REFRESH_TOKEN_VALIDITY=<Default: 144000> \
    -e ACCESS_TOKEN_VALIDITY=<Default: 3600> \ __END_HIGHLIGHT__
    -d supertokens/supertokens-<db name>
```
<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

refresh_token_validity: # Default 144000

access_token_validity: # Default 3600
```

<!--With SaaS-->
```yaml
# Navigate to your SaaS dashboard, and click on the Edit Configuration button.
# Under there, change the values of the following fields, and click on save.

refresh_token_validity: # Default 144000

access_token_validity: # Default 3600
```

<!--END_DOCUSAURUS_CODE_TABS-->

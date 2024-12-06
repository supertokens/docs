#!/usr/bin/env bash

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/common-customizations/sessions/share-sessions-across-sub-domains.mdx \
	docs/post-authentication/session-management

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/common-customizations/sessions/multiple-clients.mdx \
	docs/post-authentication/session-management

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/common-customizations/pre-built-ui/sign-out.mdx \
	docs/post-authentication/session-management

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/common-customizations/pre-built-ui/auth-redirection.mdx \
	docs/post-authentication/session-management

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/common-customizations/sessions/.mdx \
	docs/post-authentication/session-management

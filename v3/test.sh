#!/usr/bin/env bash

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/architecture.mdx \
	docs/references

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/other-frameworks.mdx \
	docs/references

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/user-object.mdx \
	docs/references

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/appinfo.mdx \
	docs/references

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/sdks.mdx \
	docs/references

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/apis.mdx \
	docs/references

bun run cli.ts migrate \
	/Users/bogdan/src/supertokens/docs/v2/thirdpartyemailpassword/advanced-customizations \
	docs/references/sdks

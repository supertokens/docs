---
name: supertokens-integration
description: Integrate, configure, troubleshoot, and review SuperTokens authentication in existing applications. Use when adding email/password, passwordless, social login, passkeys, MFA, email verification, enterprise login, sessions, roles, attack protection, or machine-to-machine authentication.
license: Apache-2.0
metadata:
  author: supertokens
  version: "1.0"
---

# SuperTokens Integration

Use this skill to make a correct, project-specific SuperTokens change. Do not start by copying a generic quickstart. Inspect the repository and existing authentication code first.

## Workflow

1. Identify the application stack, package manager, frontend framework, backend framework, SDK versions, router, deployment model, and existing authentication implementation.
2. Check whether the project uses the managed service or self-hosted Core. Confirm feature availability and SDK support before choosing an approach.
3. Determine the required recipes and ask focused questions for decisions that cannot be inferred:
   - Authentication methods: email/password, passwordless, social, passkeys, or enterprise.
   - UI: pre-built or custom.
   - Passwordless contact method and flow type.
   - Social providers and callback URLs.
   - MFA factors, enforcement policy, and tenant-specific behavior.
   - Email verification mode and delivery provider.
   - Single-tenant or multi-tenant configuration.
4. Read the relevant current pages from the SuperTokens documentation. Prefer the documentation MCP server when available:
   - `https://supertokens.com/docs/mcp`
   - `https://supertokens.com/docs/llms.txt`
   - Append `.md` to a documentation URL for agent-optimized Markdown.
5. Produce a short implementation plan covering frontend, backend, Core, environment variables, routes, middleware, and validation before editing.
6. Implement frontend and backend configuration together. Keep recipe configuration consistent between them.
7. Preserve project conventions. Do not replace an existing router, framework adapter, session strategy, or UI unless the task requires it.
8. Put connection URIs, API keys, provider secrets, email credentials, SMS credentials, and attack-protection secrets in environment variables. Never commit secrets or print them in logs.
9. Run the narrowest relevant tests first, then typechecks and the production build. Verify the actual authentication flow where possible.
10. Report changed files, required environment variables, unresolved decisions, validation commands, and results.

## Recipe Guidance

- Initialize the Session recipe wherever user authentication requires sessions.
- Email/password integrations commonly also need password reset and email verification decisions.
- Passwordless requires separate choices for contact method (`email`, `phone`, or both) and flow type (magic link, OTP, or both). Check email or SMS delivery configuration.
- Social login requires provider credentials, callback URLs, and server-side secret handling.
- Passkeys require supported backend SDKs, a correct origin and relying-party configuration, and HTTPS outside local development.
- MFA requires account linking and careful first-factor, second-factor, tenant, and email-verification configuration. Check managed-service and SDK limitations.
- Enterprise authentication requires tenant identification, tenant-specific enabled factors, and provider configuration per tenant.
- Machine-to-machine authentication should use the managed-service OAuth2 client-credentials flow when supported. Explain legacy-flow tradeoffs when it is not.
- User roles must be enforced on the backend. Frontend checks only control presentation and are not authorization.
- Attack Protection Suite setup must distinguish public frontend values from backend secret values and must preserve request ID propagation.

## Validation Checklist

- Frontend and backend use compatible recipe configurations.
- Authentication routes are mounted and reachable at the configured base path.
- Session middleware, cookies, CORS, and proxy settings work in the deployment environment.
- Protected backend routes reject missing, invalid, expired, and insufficiently authorized sessions.
- Sign-up, sign-in, sign-out, refresh, and the recipe-specific flow work as expected.
- Provider callbacks, password reset or verification links, and redirects use the correct domains.
- No credentials, API keys, or private provider configuration were added to tracked files.
- Relevant tests, typechecks, and build commands pass.

## Troubleshooting

When a flow fails, inspect the browser and server network requests, SDK and Core versions, configured domains, auth base paths, route mounting, CORS headers, cookie attributes, and Core connectivity before changing application logic. Compare the project against the relevant documentation page and report the first failing boundary.

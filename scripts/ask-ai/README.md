# Ask AI eval

Run the site with `npm run dev` and a configured `AI_GATEWAY_API_KEY`, then run:

```sh
npm run eval:ask-ai
# Or target a running preview/deployment:
npm run eval:ask-ai -- https://example.com/docs/api/ask
```

This makes a paid model request through the actual Ask AI endpoint, using the magic-link
question in `evals.yaml`. It omits the current-page hint so retrieval must discover
the Passwordless setup page. The endpoint uses the configured model and instructions.

The command prints the full answer and named checks, exiting nonzero when a check fails.
Checks cover SuperTokens Passwordless setup, Session, frontend/backend configuration,
magic-link flow, contact method, UI/routes, delivery, a setup citation, and common
competing auth products. These are deterministic smoke checks, not a semantic judge:
review the printed answer against the expected facts in `evals.yaml` for correctness
and recommendations outside the checked product names.

`npm run eval` separately evaluates documentation with a coding agent; it does not
exercise the Ask AI endpoint or its system prompt.

The Blume patch in `patches/blume+1.5.3.patch` removes filler words from Ask AI search
queries and preserves the page introduction alongside deep matching excerpts. This
keeps setup prerequisites in context when a long page's code examples dominate matching.
Run its offline regression tests with:

```sh
npm test -- scripts/ask-ai/grounding.test.mjs
```

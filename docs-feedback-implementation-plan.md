# Docs Feedback Implementation Plan

## Accepted Scope

### Theme and visual review (A1-A5)

- Use the dashboard's `#18181a` page and `#1b1b1f` panel surfaces, semantic borders, Inter typography, and
  surface-changing hover treatment as the visual baseline.
- Reserve `#FF9933` for brand emphasis; use contrast-safe orange variants for functional states and controls.
- A1: keep dark surfaces above near-black and use soft off-white body text.
- A2: keep all functional text at 12px or larger, especially example preferences.
- A3: use Inter for body and display text and IBM Plex Mono for code.
- A4: separate the sticky header with a panel tint, border, blur, or shadow.
- A5: change the Dashboard button's background on hover without reducing text opacity.

Acceptance criteria:

- Dark page, panel, foreground, and muted-foreground values match the dashboard baseline.
- Text contrast meets WCAG AA: 4.5:1 for normal text and 3:1 for large text and component boundaries.
- Visible functional text is at least 12px, configured font families resolve correctly, and the Dashboard label remains
  fully opaque on hover.
- Verify at 320px, 390px, 1024px, and 1280px in light and dark modes.

### B1: Standardized image sizing

- Establish consistent responsive sizing and spacing for documentation images.
- Treat diagrams and full walkthrough captures as content-width images. Keep small UI, dialog, and email captures at
  intrinsic or explicitly constrained width.

Acceptance criteria:

- Images use predictable width constraints, preserve aspect ratio, and do not overflow on mobile.
- Comparable images use the same presentation rule; intentional intrinsic-width exceptions remain documented in markup.

### B3: Search filters

- Preserve the existing first-four filter pills and `More`/`Less` disclosure without a nested scrolling strip.

Acceptance criteria:

- The disclosure exposes `aria-expanded`, restores focus after toggling, keeps an active later filter visible, and leaves
  enough room for keyboard-navigable results at 320x568 and 390x844.
- The collapsed state shows at most four ordinary pills plus the disclosure; expansion shows all available filters.

### B4: Compact icon controls and tooltips

- Re-review the existing icon-only mobile Dashboard and search controls; do not alter Ask AI or navigation layout.

Acceptance criteria:

- Dashboard and search controls retain their current accessible names and 44x44px mobile targets, visible focus states,
  and concise `Dashboard` and `Search` tooltips.
- Tooltips work with pointer and keyboard interaction and do not obscure essential content.

### C1: Quickstart URL and deep links

- Preserve `/quickstart` as canonical and these redirects:
  `/quickstart/frontend-setup` -> `/quickstart#1-integrate-the-frontend-sdk`,
  `/quickstart/backend-setup` -> `/quickstart#2-integrate-the-backend-sdk`, and
  `/quickstart/next-steps` -> `/quickstart#3-configure-the-core-service`.
- Preserve compact `q=` selection state, unrelated query parameters, and hashes. Add stable explicit IDs for important
  headings inside non-default UI, frontend, backend, framework, and package-manager variants.

Acceptance criteria:

- A state-bearing nested link opens the same visible content in a fresh browser context after reload and browser history
  navigation.
- No tested link lands on a hidden heading; duplicate heading text does not create an ambiguous tested anchor.

### C2: Stable hierarchical page outline

- Preserve a transparent accent-bar slot for every outline link and muted colors for subordinate headings.
- Keep hidden conditional headings out of the outline and refresh measurements after selection changes, resize, and
  content reflow.

Acceptance criteria:

- Active highlighting changes no link's x-position or width.
- Duplicate headings remain independently addressable, hidden headings are absent, and active state remains correct after
  scrolling, resize, selection changes, reload, and browser history.

### D1: Homepage product discovery

- Add a compact `Explore capabilities` group for MFA and attack protection, plus enterprise login and multitenancy.

Acceptance criteria:

- Cards link to `/additional-verification/mfa/introduction`,
  `/additional-verification/attack-protection-suite/introduction`, and `/authentication/enterprise/introduction` without
  duplicating the existing Quickstart and authentication-method cards.
- Primary discovery paths are keyboard accessible and effective on desktop and mobile.

### D2: Redirects and custom 404

- Resolve generated legacy targets through authored routes and the explicit redirects in `blume.config.ts`, then review
  every current `missing-target` diagnostic.
- Add a custom `pages/404.astro` with the docs header, search access, Quickstart/home destinations, and a broken-link
  reporting destination.

Acceptance criteria:

- Redirects reach the intended canonical pages without loops or unnecessary chains.
- The 404 page clearly identifies the error and offers search plus useful navigation back into the docs.
- Unknown routes render the custom recovery content with HTTP 404 in preview/deployed-environment tests.

## Explicitly Excluded

- B2: Ask AI/navigation layout.
- C3: Code-wrap visibility.
- C4: Contextual dropdown labels.
- D3: Docs/reference context and cross-links.

Do not include incidental changes for excluded concerns while implementing accepted work.

## Execution Workflow

1. Establish current behavior with targeted desktop/mobile screenshots, accessibility checks, route checks, and relevant Playwright coverage.
2. Implement one concern or tightly related concern group at a time, using shared tokens/components rather than page-specific fixes.
3. Review each change against its acceptance criteria, including keyboard behavior, responsive layouts, light/dark themes, contrast, direct URLs, and browser history where applicable.
4. Add or update focused automated tests for changed behavior; use Playwright for visual interaction, search, outline, deep-link, redirect, and 404 flows.
5. Run targeted checks before committing. Keep commits scoped and independently reviewable, with the concern IDs in commit messages where useful.
6. After all accepted concerns are integrated, re-review A1-A5 and run the complete verification suite.

Targeted checks use `npx playwright test e2e/ui-smoke.spec.ts -g "<concern>"`, the closest unit-test file via
`npx vitest run <file>`, `npm run typecheck`, and `npm run lint:prettier:check`. Redirect and HTTP-status behavior uses the
preview suite under `e2e-preview/` rather than the static E2E server.

## Final Verification

Run from the repository root:

```sh
npm run typecheck
npm test
npm run lint:prettier:check
npm run lint:vale
npm run build
npx playwright test
```

Scope Playwright verification to theme/responsive behavior, search filters, icon controls/tooltips, Quickstart deep links, page outline behavior, homepage discovery, redirects, and the custom 404. Record any environment-dependent gaps in the review notes before merge.

import { readFile } from "node:fs/promises";

import yaml from "js-yaml";

const { questions } = yaml.load(await readFile(new URL("../../evals.yaml", import.meta.url), "utf8"));
const evaluation = questions.find(({ id }) => id === "setup-magic-link-login");
if (!evaluation) {
  throw new Error("Missing setup-magic-link-login eval in evals.yaml");
}

const endpoint = process.argv[2] ?? "http://localhost:4321/docs/api/ask";
const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    // Omit the current page so retrieval must discover Passwordless unaided.
    messages: [{ role: "user", content: evaluation.question }],
  }),
  signal: AbortSignal.timeout(120_000),
});
if (!response.ok) {
  throw new Error(`Ask AI returned ${response.status}: ${await response.text()}`);
}

const answer = await response.text();
const checks = [
  { name: "Uses SuperTokens Passwordless", pass: /supertokens/iu.test(answer) && /passwordless/iu.test(answer) },
  {
    name: "Covers frontend, backend, and Session setup",
    pass: /front[ -]?end/iu.test(answer) && /back[ -]?end/iu.test(answer) && /session/iu.test(answer),
  },
  { name: "Specifies MAGIC_LINK flow", pass: /\bflowType\b/u.test(answer) && /\bMAGIC_LINK\b/u.test(answer) },
  { name: "Explains contact method", pass: /\bcontactMethod\b/u.test(answer) && /\bemail\b/iu.test(answer) },
  { name: "Covers UI and auth routes", pass: /\bUI\b/u.test(answer) && /\brout(?:e|es|ing)\b/iu.test(answer) },
  { name: "Covers delivery", pass: /\b(?:delivery|SMTP)\b/iu.test(answer) },
  {
    name: "Cites Passwordless initial setup",
    pass: /\[[^\]]+\]\([^\s)]*\/authentication\/passwordless\/initial-setup(?:[\/#][^\s)]*)?\)/u.test(answer),
  },
  {
    name: "Does not introduce competing auth products",
    pass: !/\b(?:auth0|clerk|firebase|supabase|cognito|okta|nextauth|auth\.js|better[ -]?auth|stytch|workos)\b/iu.test(
      answer,
    ),
  },
];

console.log(JSON.stringify({ id: evaluation.id, endpoint, question: evaluation.question, checks, answer }, null, 2));
if (checks.some(({ pass }) => !pass)) {
  process.exitCode = 1;
}

import { useState } from "react";

import { SelectField } from "@/components/ui/select-field";

const recipes = [
  { value: "emailpassword", label: "Email password" },
  { value: "passwordless", label: "Passwordless" },
  { value: "thirdparty", label: "Social login" },
  { value: "multifactorauth", label: "Multi-factor authentication" },
  { value: "multitenancy", label: "Multi-tenancy" },
];
const frontends = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "next", label: "Next.js" },
];
const backends = [
  { value: "node", label: "Node.js" },
  { value: "go-http", label: "Go HTTP" },
  { value: "python", label: "Python" },
];
const safeShellArgumentPattern = /^[A-Za-z0-9_@%+=:,./-]+$/;

function shellQuote(argument: string): string {
  if (safeShellArgumentPattern.test(argument)) return argument;
  return `'${argument.replaceAll("'", `'"'"'`)}'`;
}

declare global {
  interface Window {
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}

export default function ExampleAppForm() {
  const [appName, setAppName] = useState("");
  const [recipe, setRecipe] = useState("emailpassword");
  const [frontend, setFrontend] = useState("react");
  const [backend, setBackend] = useState("node");
  const command = [
    "npx create-supertokens-app",
    appName && shellQuote(`--appname=${appName}`),
    shellQuote(`--recipe=${recipe}`),
    shellQuote(`--frontend=${frontend}`),
    frontend !== "next" && shellQuote(`--backend=${backend}`),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="st-form-card">
      <h3>Generate example app</h3>
      <p>Choose your stack, then run the generated command.</p>
      <div className="st-form-grid">
        <label>
          Application name
          <input
            name="application-name"
            autoComplete="off"
            value={appName}
            onChange={(event) => setAppName(event.target.value)}
            placeholder="Example: my-app"
          />
        </label>
        <SelectField
          label="Authentication recipe"
          options={recipes}
          value={recipe}
          onValueChange={(value) => {
            setRecipe(value);
            window.posthog?.capture("example_app_config_selected", { field: "recipe", value, frontend, backend });
          }}
        />
        <SelectField
          label="Frontend framework"
          options={frontends}
          value={frontend}
          onValueChange={(value) => {
            setFrontend(value);
            window.posthog?.capture("example_app_config_selected", { field: "frontend", value, recipe, backend });
          }}
        />
        <SelectField
          label="Backend language"
          options={backends}
          value={backend}
          onValueChange={(value) => {
            setBackend(value);
            window.posthog?.capture("example_app_config_selected", { field: "backend", value, recipe, frontend });
          }}
          disabled={frontend === "next"}
        />
      </div>
      <pre>
        <code>{command}</code>
      </pre>
    </section>
  );
}

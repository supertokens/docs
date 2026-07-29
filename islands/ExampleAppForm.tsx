import { useState } from "react";

const recipes = ["emailpassword", "passwordless", "thirdparty", "multifactorauth", "multitenancy"];
const frontends = ["react", "angular", "vue", "next"];
const backends = ["node", "go-http", "python"];

export default function ExampleAppForm() {
  const [appName, setAppName] = useState("");
  const [recipe, setRecipe] = useState("emailpassword");
  const [frontend, setFrontend] = useState("react");
  const [backend, setBackend] = useState("node");
  const command = [
    "npx create-supertokens-app",
    appName && `--appname=${JSON.stringify(appName)}`,
    `--recipe=${recipe}`,
    `--frontend=${frontend}`,
    frontend !== "next" && `--backend=${backend}`,
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
          <input value={appName} onChange={(event) => setAppName(event.target.value)} placeholder="my-app" />
        </label>
        <label>
          Authentication recipe
          <select value={recipe} onChange={(event) => setRecipe(event.target.value)}>
            {recipes.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          Frontend framework
          <select value={frontend} onChange={(event) => setFrontend(event.target.value)}>
            {frontends.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          Backend language
          <select value={backend} onChange={(event) => setBackend(event.target.value)} disabled={frontend === "next"}>
            {backends.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>
      <pre><code>{command}</code></pre>
    </section>
  );
}

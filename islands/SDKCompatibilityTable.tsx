import { useEffect, useState } from "react";

interface SdkOption {
  id: string;
  displayName: string;
}

interface Compatibility {
  coreToDriver: Record<string, string[]>;
  driverToFrontend: Record<string, string[]>;
}

const apiBase = "https://api.supertokens.com/0";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { headers: { "api-version": "0" } });
  if (!response.ok) throw new Error(`Compatibility API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export default function SDKCompatibilityTable() {
  const [frontends, setFrontends] = useState<SdkOption[]>([]);
  const [backends, setBackends] = useState<SdkOption[]>([]);
  const [frontend, setFrontend] = useState("");
  const [backend, setBackend] = useState("");
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      request<{ frontends: SdkOption[] }>("/frontends?mode=PRODUCTION"),
      request<{ drivers: SdkOption[] }>("/drivers?planType=FREE&mode=PRODUCTION"),
    ])
      .then(([frontendResult, backendResult]) => {
        setFrontends(frontendResult.frontends);
        setBackends(backendResult.drivers);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Failed to load SDKs"));
  }, []);

  useEffect(() => {
    if (!(frontend && backend)) return;
    setCompatibility(null);
    request<Compatibility>(`/compatibility?driver=${encodeURIComponent(backend)}&frontend=${encodeURIComponent(frontend)}`)
      .then(setCompatibility)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Failed to load compatibility"));
  }, [backend, frontend]);

  return (
    <section className="st-form-card">
      <h3>SDK compatibility</h3>
      <div className="st-form-grid">
        <label>
          Backend SDK
          <select value={backend} onChange={(event) => setBackend(event.target.value)}>
            <option value="">Select a backend</option>
            {backends.map((option) => <option key={option.id} value={option.id}>{option.displayName}</option>)}
          </select>
        </label>
        <label>
          Frontend SDK
          <select value={frontend} onChange={(event) => setFrontend(event.target.value)}>
            <option value="">Select a frontend</option>
            {frontends.map((option) => <option key={option.id} value={option.id}>{option.displayName}</option>)}
          </select>
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      {compatibility && (
        <div className="st-form-grid">
          <div><strong>Core to backend</strong><pre>{JSON.stringify(compatibility.coreToDriver, null, 2)}</pre></div>
          <div><strong>Backend to frontend</strong><pre>{JSON.stringify(compatibility.driverToFrontend, null, 2)}</pre></div>
        </div>
      )}
    </section>
  );
}

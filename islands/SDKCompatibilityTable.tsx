import { useEffect, useState } from "react";

import { SelectField } from "@/components/ui/select-field";

interface SdkOption {
  id: string;
  displayName: string;
}

interface Compatibility {
  coreToDriver: Record<string, string[]>;
  driverToFrontend: Record<string, string[]>;
}

const apiBase = "https://api.supertokens.com/0";

async function request<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, { headers: { "api-version": "0" }, signal });
  if (!response.ok) throw new Error(`Compatibility API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export default function SDKCompatibilityTable() {
  const [frontends, setFrontends] = useState<SdkOption[]>([]);
  const [backends, setBackends] = useState<SdkOption[]>([]);
  const [frontend, setFrontend] = useState("");
  const [backend, setBackend] = useState("");
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [sdkError, setSdkError] = useState("");
  const [compatibilityError, setCompatibilityError] = useState("");
  const [isLoadingSdks, setIsLoadingSdks] = useState(true);
  const [isLoadingCompatibility, setIsLoadingCompatibility] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      request<{ frontends: SdkOption[] }>("/frontends?mode=PRODUCTION", controller.signal),
      request<{ drivers: SdkOption[] }>("/drivers?planType=FREE&mode=PRODUCTION", controller.signal),
    ])
      .then(([frontendResult, backendResult]) => {
        setFrontends(frontendResult.frontends);
        setBackends(backendResult.drivers);
        setSdkError("");
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setSdkError(reason instanceof Error ? reason.message : "Failed to load SDKs");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingSdks(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCompatibility(null);
    setCompatibilityError("");

    if (!(frontend && backend)) {
      setIsLoadingCompatibility(false);
      return;
    }

    const controller = new AbortController();
    setIsLoadingCompatibility(true);

    request<Compatibility>(
      `/compatibility?driver=${encodeURIComponent(backend)}&frontend=${encodeURIComponent(frontend)}&plugin=&planType=FREE`,
      controller.signal,
    )
      .then((result) => {
        if (!controller.signal.aborted) setCompatibility(result);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setCompatibilityError(reason instanceof Error ? reason.message : "Failed to load compatibility");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingCompatibility(false);
      });

    return () => controller.abort();
  }, [backend, frontend]);

  return (
    <section className="st-form-card">
      <h3>SDK compatibility</h3>
      <div className="st-form-grid">
        <SelectField
          label="Backend SDK"
          options={backends.map((option) => ({ value: option.id, label: option.displayName }))}
          value={backend}
          onValueChange={setBackend}
          disabled={isLoadingSdks || backends.length === 0}
          placeholder="Select a backend"
        />
        <SelectField
          label="Frontend SDK"
          options={frontends.map((option) => ({ value: option.id, label: option.displayName }))}
          value={frontend}
          onValueChange={setFrontend}
          disabled={isLoadingSdks || frontends.length === 0}
          placeholder="Select a frontend"
        />
      </div>
      {isLoadingSdks && <p role="status">Loading SDKs…</p>}
      {sdkError && <p role="alert">{sdkError}</p>}
      {isLoadingCompatibility && <p role="status">Loading compatibility…</p>}
      {compatibilityError && <p role="alert">{compatibilityError}</p>}
      {compatibility && (
        <div className="st-form-grid">
          <div>
            <strong>Core to backend</strong>
            <pre>{JSON.stringify(compatibility.coreToDriver, null, 2)}</pre>
          </div>
          <div>
            <strong>Backend to frontend</strong>
            <pre>{JSON.stringify(compatibility.driverToFrontend, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  );
}

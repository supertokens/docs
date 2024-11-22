import { useCallback, useContext, useMemo, useState } from "react";
import { DocItemContext } from "../DocItemContext";

import "./styles.scss";

export function AppInfoForm() {
  const { appInfo, onChangeAppInfoField } = useContext(DocItemContext);

  const [formErrors, setFormErrors] = useState<
    Record<keyof typeof appInfo, string>
  >({
    appName: "",
    apiBasePath: "",
    apiDomain: "",
    websiteDomain: "",
    websiteBasePath: "",
  });

  const onChangeInputValue = useCallback(
    (e) => {
      onChangeAppInfoField(e.target.name, e.target.value);
    },
    [onChangeAppInfoField],
  );

  const onBlur = useCallback((e) => {
    // TODO: Do validation
  }, []);

  return (
    <form className="app-info-form">
      <h2>App Info</h2>

      <p>
        Adjust these values based on the application that you are trying to
        configure. To learn more about what each field means check the{" "}
        <a href="/docs/thirdpartyemailpassword/appinfo">references page</a>.
      </p>
      <div className="app-info-form__grid">
        <div className="app-info-form__field">
          <label className="app-info-form__field-label">API Domain</label>
          <span className="app-info-form__field-help-text">
            This is the URL of your app's API server.
          </span>
          <input
            name="apiDomain"
            defaultValue={appInfo.apiDomain}
            onChange={onChangeInputValue}
            onBlur={onBlur}
            className="app-info-form__input"
          />
          <span>{formErrors.apiDomain}</span>
        </div>
        <div className="app-info-form__field">
          <label className="app-info-form__field-label">API Base Path</label>
          <span className="app-info-form__field-help-text">
            SuperTokens will expose it's APIs scoped by this base API path.
          </span>
          <input
            name="apiBasePath"
            defaultValue={appInfo.apiBasePath}
            onChange={onChangeInputValue}
            onBlur={onBlur}
            className="app-info-form__input"
          />
          <span>{formErrors.apiDomain}</span>
        </div>
        <div className="app-info-form__field">
          <label className="app-info-form__field-label">Website Domain</label>
          <span className="app-info-form__field-help-text">
            This is the URL of your website.
          </span>
          <input
            name="websiteDomain"
            defaultValue={appInfo.websiteDomain}
            onChange={onChangeInputValue}
            onBlur={onBlur}
            className="app-info-form__input"
          />
          <span>{formErrors.apiDomain}</span>
        </div>
        <div className="app-info-form__field">
          <label className="app-info-form__field-label">
            Website Base Path
          </label>
          <span className="app-info-form__field-help-text">
            The path where the login UI will be rendered
          </span>
          <input
            name="websiteBasePath"
            defaultValue={appInfo.websiteBasePath}
            onChange={onChangeInputValue}
            onBlur={onBlur}
            className="app-info-form__input"
          />
          <span>{formErrors.apiDomain}</span>
        </div>
      </div>
    </form>
  );
}

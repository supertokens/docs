import React from "react";

function OAuthVerifyTokensDisclaimer() {
  return (
    <div className="admonition admonition-caution alert alert--warning">
      <div className="admonition-heading">
        <h5>CAUTION</h5>
      </div>
      <div className="admonition-content">
        <p>
          This guide only applies to scenarios in which you are using{" "}
          <strong>SuperTokens Access Tokens</strong>.
        </p>
        <p>
          If you are implementing{" "}
          <a href="/docs/unified-login/introduction">
            <strong>Unified Login</strong>
          </a>{" "}
          with <strong>OAuth2 Access Tokens</strong>, please check the{" "}
          <a href="/docs/unified-login/customizations/verify-tokens">
            separate page
          </a>{" "}
          that shows you how to verify those types of tokens.
        </p>
      </div>
    </div>
  );
}

export { OAuthVerifyTokensDisclaimer };

import React from "react";

function OAuthVerifyTokensDisclaimer() {
  return (
    <div className="admonition admonition-caution alert alert--warning">
      <div className="admonition-heading">
        <h5>CAUTION</h5>
      </div>
      <div className="admonition-content">
        <p>
          This guide only applies to scenarios which involve{" "}
          <strong>SuperTokens Session Access Tokens</strong>.
        </p>
        <p>
          If you are implementing either,{" "}
          <a href="/docs/unified-login/introduction">
            <strong>Unified Login</strong>
          </a>{" "}
          or{" "}
          <a href="/docs/microservice_auth/introduction">
            <strong>Microservice Authentication</strong>
          </a>
          , features that make use of <strong>OAuth2 Access Tokens</strong>,
          please check the{" "}
          <a href="/docs/unified-login/customizations/verify-tokens">
            separate page
          </a>{" "}
          that shows you how to verify those types of tokens.
        </p>
      </div>
    </div>
  );
}

function OAuthEmailVerificationDisclaimer() {
  return (
    <div className="admonition admonition-caution alert alert--warning">
      <div className="admonition-heading">
        <h5>CAUTION</h5>
      </div>
      <div className="admonition-content">
        <p>
          This information only applies to scenarios in which you are using{" "}
          <strong>SuperTokens Session Access Tokens</strong>.
        </p>
        <p>
          If you are implementing{" "}
          <a href="/docs/unified-login/introduction">
            <strong>Unified Login</strong>
          </a>{" "}
          you will have to manually check the <code>email_verified</code> claim
          on the <strong>OAuth2 Access Tokens</strong>. Please read the{" "}
          <a href="/docs/unified-login/customizations/verify-tokens">
            separate page
          </a>{" "}
          that shows you how to verify the token.
        </p>
      </div>
    </div>
  );
}

function OAuthFrontendVerificationDisclaimer() {
  return (
    <div className="admonition admonition-caution alert alert--warning">
      <div className="admonition-heading">
        <h5>CAUTION</h5>
      </div>
      <div className="admonition-content">
        <p>
          This information only applies to scenarios in which you are using{" "}
          <strong>SuperTokens Session Access Tokens</strong>.
        </p>
        <p>
          If you are implementing{" "}
          <a href="/docs/unified-login/introduction">
            <strong>Unified Login</strong>
          </a>{" "}
          you will have to manually check authentication state based the{" "}
          <strong>OAuth2/OIDC</strong> library that you are using. Please
          explore the{" "}
          <a href="/docs/unified-login/unified-login/introduction">
            dedicated documentation
          </a>{" "}
          to find out more.
        </p>
      </div>
    </div>
  );
}

export {
  OAuthVerifyTokensDisclaimer,
  OAuthEmailVerificationDisclaimer,
  OAuthFrontendVerificationDisclaimer,
};

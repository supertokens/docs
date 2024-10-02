import React, { useContext } from "react";
import { DocsItemContext } from "../DocsItemContext/DocsItemContext";

import Form from "./Form";
import Input from "./Input";
import HoverCard from "../HoverCard/HoverCard";

export default function AppInfoSection() {
  const { appInfo, onChangeAppInfoField } = useContext(DocsItemContext);

  return (
    <Form.Section>
      <Form.SectionTitle>App Info</Form.SectionTitle>
      <Form.Field>
        <Form.Label>
          App Name
          <HoverCard>
            <HoverCard.InfoIcon />
            <HoverCard.Content>
              <AppNameInfo />
            </HoverCard.Content>
          </HoverCard>
        </Form.Label>
        <Input
          onChange={(e) => onChangeAppInfoField("appName", e.target.value)}
          placeholder="e.g. My awesome App"
          value={appInfo.appName}
        />
      </Form.Field>
      <Form.Grid>
        <Form.Field>
          <Form.Label>
            API Domain
            <HoverCard>
              <HoverCard.InfoIcon />
              <HoverCard.Content>
                <ApiDomainInfo />
              </HoverCard.Content>
            </HoverCard>
          </Form.Label>
          <Input
            placeholder="e.g. http://localhost:8080"
            value={appInfo.apiDomain}
            onChange={(e) => onChangeAppInfoField("apiDomain", e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>
            API Base Path
            <HoverCard>
              <HoverCard.InfoIcon />
              <HoverCard.Content>
                <ApiBasePathInfo />
              </HoverCard.Content>
            </HoverCard>
          </Form.Label>
          <Input
            placeholder="e.g. /auth"
            value={appInfo.apiBasePath}
            onChange={(e) =>
              onChangeAppInfoField("apiBasePath", e.target.value)
            }
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>
            Website Domain
            <HoverCard>
              <HoverCard.InfoIcon />
              <HoverCard.Content>
                <WebsiteDomainInfo />
              </HoverCard.Content>
            </HoverCard>
          </Form.Label>
          <Input
            placeholder="e.g. http://localhost:3000"
            value={appInfo.websiteDomain}
            onChange={(e) =>
              onChangeAppInfoField("websiteDomain", e.target.value)
            }
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>
            Website Base Path
            <HoverCard>
              <HoverCard.InfoIcon />
              <HoverCard.Content>
                <WebsiteBasePathInfo />
              </HoverCard.Content>
            </HoverCard>
          </Form.Label>
          <Input
            placeholder="e.g. /auth"
            value={appInfo.websiteBasePath}
            onChange={(e) =>
              onChangeAppInfoField("websiteBasePath", e.target.value)
            }
          />
        </Form.Field>
      </Form.Grid>
    </Form.Section>
  );
}

function AppNameInfo() {
  return (
    <div>
      <h3>
        App Name - <code>appName</code>
      </h3>
      This is the name of your application. It is used when sending password
      reset or email verification emails (in the default email design). An
      example of this is `appName: "GitHub"`.
    </div>
  );
}

function WebsiteDomainInfo() {
  return (
    <div>
      <h3>
        Website Domain - <code>websiteDomain</code>
      </h3>
      This is the domain part of your website. This is where the login UI will
      be shown. For example: - For local development, you are likely using
      `localhost` with some port (ex `8080`). Then the value of this should be
      `"http://localhost:8080"`. - If your website is `https://www.example.com`,
      then the value of this should be `"https://www.example.com"`. - If your
      website is `https://example.com`, then the value of this should be
      `"https://example.com"`. - If you have multiple sub domains, and your
      users login via `https://auth.example.com`, then the value of this should
      be `"https://auth.example.com"`. By default, the login UI will be
      displayed on `/auth/*`. This can be changed by using the `websiteBasePath`
      config. On the frontend, we need the domain for routing purposes, and on
      the backend, we need it so that we can generate correct email verification
      and password reset links.
    </div>
  );
}

function ApiBasePathInfo() {
  return (
    <div>
      <h3>
        Api Base Path - <code>apiBasePath</code>
      </h3>
      By default, our frontend SDK will query `/auth/*`. If you want to change
      the `/auth` to something else, then you must set this value. For example:
      - If you have versioning in your API path and want to query `/v0/auth/*`,
      then the value of this should be `"/v0/auth"`. - If you want to scope our
      APIs not via `/auth` but via some other string like `/supertokens`, then
      you can set the value of this to `"/supertokens"`. This means, our APIs
      will be exposed on `/supertokens/*`. - If you do not want to scope our
      APIs at all, then you can set the values of this to be `"/"`. This means
      our APIs will be available on `/*`
    </div>
  );
}

function ApiDomainInfo() {
  return (
    <div>
      <h3>
        Api Domain - <code>apiDomain</code>
      </h3>
      This is the domain part of your API endpoint that the frontend talks to.
      For example: - For local development, you are likely using `localhost`
      with some port (ex `9000`). Then the value of this should be
      `"http://localhost:9000"`. - If your frontend queries
      `https://api.example.com/*`, then the value of this should be
      `"https://api.example.com"` - If your API endpoint is reached via
      `/api/*`, then the value of this is the same as the `websiteDomain` -
      since `/api/*` is equal to querying `/api/*`. By default, our login
      widgets will query `/auth/*`. This can be changed by using the
      `apiBasePath` config.
    </div>
  );
}

function WebsiteBasePathInfo() {
  return (
    <div>
      <h3>
        Website Base Path - <code>websiteBasePath</code>
      </h3>
      By default, the login UI will be displayed on `/auth`. Other auth related
      UIs will be shown on `/auth/*`. If you want to change the `/auth` to
      something else, then you must set this value. For example: - If you want
      the login UI to show on `/user/*`, then the value of this should be
      `"/user"`. - If you are using a dedicated sub domain for auth, like
      `https://auth.example.com`, then you probably want the login UI to show up
      on `https://auth.example.com`. In this case, set this value to `"/"`.
    </div>
  );
}

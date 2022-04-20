/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProviders from '@theme/LayoutProviders';
import LayoutHead from '@theme/LayoutHead';
import useKeyboardNavigation from '@theme/hooks/useKeyboardNavigation';
import { ThemeClassNames } from '@docusaurus/theme-common';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import './styles.css';
import supertokens from "supertokens-website";

if (typeof window !== 'undefined') {
  let API_DOMAIN
  let API_BASE_PATH
  if (window.location.hostname === "supertokens.com" || window.location.hostname === "www.supertokens.com") {
    API_DOMAIN = "https://api.supertokens.com"
    API_BASE_PATH = "/0/auth"
  } else {
    API_DOMAIN = "https://dev.api.supertokens.com"
    API_BASE_PATH = "/0/auth"
  }

  let sessionExpiredStatusCode = 401;
  supertokens.init({
    apiDomain: API_DOMAIN,
    apiBasePath: API_BASE_PATH,
    sessionExpiredStatusCode,
    preAPIHook: async (context) => {
      return {
        ...context,
        requestInit: {
          ...context.requestInit,
          headers: {
            ...context.requestInit.headers,
            "api-version": "0"
          }
        }
      }
    }
  });
}

function OriginalLayout(props) {
  const { children, noFooter, wrapperClassName, pageClassName } = props;
  useKeyboardNavigation();
  return (
    <LayoutProviders>
      <LayoutHead {...props} />

      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <div
        className={clsx(
          ThemeClassNames.wrapper.main,
          wrapperClassName,
          pageClassName,
        )}>
        {children}
      </div>

      {!noFooter && <Footer />}
    </LayoutProviders>
  );
}

function Layout(props) {
  const location = useLocation();
  let HeadComponent = PATH_TO_META_TAGS["default"]
  if (PATH_TO_META_TAGS[location.pathname] !== undefined) {
    HeadComponent = PATH_TO_META_TAGS[location.pathname];
  }
  return (
    <>
      <HeadComponent />

      {/* The common tags here */}
      <Head>
        <meta name="keywords" content="authentication, open source, login, authorization, security, session management, Json web tokens, anti-csrf, rotating refresh tokens, jwt tokens" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={'https://supertokens.com' + location.pathname} />
        <meta property="og:url" content={"https://supertokens.com" + location.pathname} />
      </Head>
      <OriginalLayout {...props} />
    </>
  );
}

export default Layout;

const PATH_TO_META_TAGS = {
  "/docs/community/migration/from-saas-to-on-prem": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:title" content="SuperTokens Docs | Migration" />
        <meta property="og:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Migration" />
        <meta name="twitter:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
      </Head>
    )
  },
  "/docs/community/migration/away-from-st": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:title" content="SuperTokens Docs | Migration" />
        <meta property="og:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Migration" />
        <meta name="twitter:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
      </Head>
    )
  },
  "/docs/community/migration/to-st": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:title" content="SuperTokens Docs | Migration" />
        <meta property="og:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Migration" />
        <meta name="twitter:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
      </Head>
    )
  },
  "/docs/community/migration/older-version": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:title" content="SuperTokens Docs | Migration" />
        <meta property="og:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Migration" />
        <meta name="twitter:description" content="Learn more about migrating to SuperTokens from an older version, alternate service or to a self hosted solution." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/migration.png" />
      </Head>
    )
  },
  "/docs/session/introduction": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about how to add session management to your web app using SuperTokens." />
        <meta property="og:title" content="SuperTokens Docs | Only Session Management" />
        <meta property="og:description" content="Learn more about how to add session management to your web app using SuperTokens." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/sessions_only.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Only Session Management" />
        <meta name="twitter:description" content="Learn more about how to add session management to your web app using SuperTokens." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/sessions_only.png" />
      </Head>
    )
  },
  "/docs/thirdparty/introduction": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about how to add third party user login to your web app using SuperTokens." />
        <meta property="og:title" content="SuperTokens Docs | Social Login" />
        <meta property="og:description" content="Learn more about how to add third party user login to your web app using SuperTokens." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/social_login.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Social Login" />
        <meta name="twitter:description" content="Learn more about how to add third party user login to your web app using SuperTokens." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/social_login.png" />
      </Head>
    );
  },
  "/docs/emailpassword/introduction": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about how to add email password user login to your web app using SuperTokens." />
        <meta property="og:title" content="SuperTokens Docs | Email password login" />
        <meta property="og:description" content="Learn more about how to add email password user login to your web app using SuperTokens." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/email_password.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Email password login" />
        <meta name="twitter:description" content="Learn more about how to add email password user login to your web app using SuperTokens." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/email_password.png" />
      </Head>
    )
  },
  "/docs/thirdpartyemailpassword/introduction": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about how to add third party email password user login to your web app using SuperTokens." />
        <meta property="og:title" content="SuperTokens Docs | Email password + Social Login" />
        <meta property="og:description" content="Learn more about how to add third party email password user login to your web app using SuperTokens." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/email_password_social.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Email password + Social Login" />
        <meta name="twitter:description" content="Learn more about how to add third party email password user login to your web app using SuperTokens." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/email_password_social.png" />
      </Head>
    )
  },
  "/docs/passwordless/introduction": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about how to add passwordless login to your web app using SuperTokens." />
        <meta property="og:title" content="SuperTokens Docs | Passwordless" />
        <meta property="og:description" content="Learn more about how to add passwordless login to your web app using SuperTokens." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/passwordless.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Passwordless" />
        <meta name="twitter:description" content="Learn more about how to add passwordless login to your web app using SuperTokens." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/passwordless.png" />
      </Head>
    )
  },
  "/docs/thirdpartypasswordless/introduction": () => {
    return (
      <Head>
        <meta name="description" content="Learn more about how to add third party or passwordless login to your web app using SuperTokens." />
        <meta property="og:title" content="SuperTokens Docs | Passwordless + Social Login" />
        <meta property="og:description" content="Learn more about how to add third party or passwordless login to your web app using SuperTokens." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/passwordless_social.png" />
        <meta name="twitter:title" content="SuperTokens Docs | Passwordless + Social Login" />
        <meta name="twitter:description" content="Learn more about how to add third party or passwordless login to your web app using SuperTokens." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/passwordless_social.png" />
      </Head>
    )
  },
  "/docs/community/compatibility-table": () => {
    return (
      <Head>
        <meta name="description" content="Find the right version of an SDK / core for a given tech stack." />
        <meta property="og:title" content="SuperTokens Docs | SDK Compatibility" />
        <meta property="og:description" content="Find the right version of an SDK / core for a given tech stack." />
        <meta property="og:image" content="https://supertokens.com/static/assets/meta_images/docs/docs_introduction.png" />
        <meta name="twitter:title" content="SuperTokens Docs | SDK Compatibility" />
        <meta name="twitter:description" content="Find the right version of an SDK / core for a given tech stack." />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/meta_images/docs/docs_introduction.png" />
      </Head>
    )
  },
  "default": () => {
    return (
      <Head>
        <meta name="description" content="Add simple email and password sign up functionality to your site or app in 15 minutes" />
        <meta property="og:title" content="SuperTokens, Open Source Authentication" />
        <meta property="og:title" content="SuperTokens, Open Source Authentication" />
        <meta property="og:description" content="Add simple email and password sign up functionality to your site or app in 15 minutes" />
        <meta property="og:image" content="https://supertokens.com/static/assets/home-meta.png" />
        <meta name="twitter:title" content="SuperTokens, Open Source Authentication" />
        <meta name="twitter:description" content="Add simple email and password sign up functionality to your site or app in 15 minutes" />
        <meta name="twitter:image" content="https://supertokens.com/static/assets/home-meta.png" />
      </Head>
    )
  }
}
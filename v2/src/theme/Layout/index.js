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
  return (
    <>
      <Head>
        <meta
          name="twitter:url"
          content={'https://supertokens.io' + location.pathname}
        />
      </Head>
      <OriginalLayout {...props} />
    </>
  );
}

export default Layout;

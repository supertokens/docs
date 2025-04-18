import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// Mock Docusaurus imports that would otherwise cause errors in tests
vi.mock('@docusaurus/useBaseUrl', () => ({
  default: (url: string) => url,
}));

vi.mock('@docusaurus/Link', () => ({
  default: (props: any) => {
    const { to, children, ...rest } = props;
    return React.createElement('a', { href: to, ...rest }, children);
  },
}));

vi.mock('@docusaurus/router', () => ({
  useLocation: () => ({
    pathname: '/',
  }),
  useHistory: () => ({
    push: vi.fn(),
  }),
}));

// Any other global setup for tests
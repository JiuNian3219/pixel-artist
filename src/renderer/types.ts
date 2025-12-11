import React from 'react';
import type {
  PageContextClient as PageContextBuiltInClient,
  PageContextServer as PageContextBuiltInServer,
} from 'vike/types';

type Page = (pageProps: PageProps) => React.ReactNode;
export type PageProps = Record<string, unknown>;

export type PageContextCustom = {
  Page: Page;
  pageProps?: PageProps;
  urlPathname: string;
  locale?: string;
  exports?: {
    documentProps?: {
      title?: string;
      description?: string;
    };
  };
  config: {
    title?: string;
    description?: string;
    ssr?: boolean;
  };
};

export type PageContextServer = PageContextBuiltInServer<Page> &
  PageContextCustom;
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom;

export type PageContext = PageContextClient | PageContextServer;

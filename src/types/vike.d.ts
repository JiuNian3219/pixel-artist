import 'vike/types';

declare module 'vike/types' {
  export interface Config {
    hydrationCanBeAborted?: boolean;
    baseAssets?: string;
    baseServer?: string;
    ssr?: boolean;
    passToClient?: string[];
    clientRouting?: boolean;
    prerender?: boolean;
    meta?: Record<string, any>;
  }
}

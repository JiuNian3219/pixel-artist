import 'vike/types';

declare module 'vike/types' {
  export interface Config {
    ssr?: boolean;
    passToClient?: string[];
    clientRouting?: boolean;
    prerender?: boolean;
    meta?: Record<string, any>;
  }
}

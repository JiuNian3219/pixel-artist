import type { Config } from 'vike/types';

export default {
  passToClient: ['pageProps', 'routeParams'],
  clientRouting: true,
  prerender: true,
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true, client: true },
    },
    ssr: {
      env: { config: true },
      effect: ({ configValue }: { configValue: boolean }) => {
        return {
          meta: {
            Page: {
              env: configValue
                ? { server: true, client: true }
                : { client: true },
            },
          },
        };
      },
    },
  },
} satisfies Config;

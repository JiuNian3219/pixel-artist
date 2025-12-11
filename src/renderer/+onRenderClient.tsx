import '@ant-design/v5-patch-for-react-19';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { PageShell } from './PageShell';
import type { PageContextClient } from './types';

let root: Root;

export const onRenderClient = async (pageContext: PageContextClient) => {
  const { Page, pageProps } = pageContext;

  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  const container = document.getElementById('root')!;

  if (pageContext.isHydration) {
    root = hydrateRoot(container, page);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
  }
};

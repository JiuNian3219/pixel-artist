import { DEFAULT_LOCALE } from '@/utils/locale';
import { useEffect } from 'react';

export function Page() {
  useEffect(() => {
    window.location.replace(`/${DEFAULT_LOCALE}`);
  }, []);
  return null;
}

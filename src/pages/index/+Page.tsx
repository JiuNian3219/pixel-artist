import { BASE_URL, DEFAULT_LOCALE } from '@/utils/locale';
import { useEffect } from 'react';

export function Page() {
  useEffect(() => {
    const target = `${BASE_URL}${DEFAULT_LOCALE}`.replace('//', '/');
    window.location.replace(target);
  }, []);
  return null;
}

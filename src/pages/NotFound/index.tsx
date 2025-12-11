import { usePageContext } from '@/renderer/usePageContext';
import { parseLocaleFromPath, withLocalePath } from '@/utils/locale';
import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'vike/client/router';

const NotFound: React.FC = () => {
  const pageContext = usePageContext();
  const locale = parseLocaleFromPath(pageContext.urlPathname);
  const { t } = useTranslation('404');

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('description')}
      extra={
        <Button
          title={t('actions.back_home')}
          type="primary"
          onClick={() => navigate(withLocalePath(locale, '/'))}
        >
          {t('actions.back_home')}
        </Button>
      }
    />
  );
};

export default NotFound;

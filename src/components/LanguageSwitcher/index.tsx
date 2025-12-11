import { useIsMobile } from '@/hooks/useIsMobile';
import { usePageContext } from '@/renderer/usePageContext';
import {
  LOCALES,
  parseLocaleFromPath,
  stripLocaleFromPath,
  withLocalePath,
} from '@/utils/locale';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'vike/client/router';
import styles from './index.module.less';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation('common');
  const pageContext = usePageContext();
  const currentLocale = parseLocaleFromPath(pageContext.urlPathname);
  const isMobile = useIsMobile();

  const handleLanguageChange = (language: 'zh' | 'en') => {
    const basePath = stripLocaleFromPath(pageContext.urlPathname);
    const search = typeof window !== 'undefined' ? window.location.search : '';
    navigate(withLocalePath(language, basePath) + search, {
      overwriteLastHistoryEntry: true,
    });
    i18n.changeLanguage(language);
  };

  const items: MenuProps['items'] = LOCALES.map((lng) => ({
    key: lng,
    label: t(`language.names.${lng}`),
    onClick: () => handleLanguageChange(lng),
  }));

  return (
    <Dropdown
      menu={{ items, selectedKeys: [currentLocale] }}
      placement="bottomRight"
      trigger={['click']}
      className={styles.languageSwitcher}
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        title={t('language.switch')}
      >
        {!isMobile && t(`language.names.${currentLocale}`)}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;

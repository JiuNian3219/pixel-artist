import { GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { parseLocaleFromPath, stripLocaleFromPath, withLocalePath, LOCALES } from "@/utils/locale";
import styles from "./index.module.less";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocale = parseLocaleFromPath(location.pathname);

  const handleLanguageChange = (language: "zh" | "en") => {
    const basePath = stripLocaleFromPath(location.pathname);
    navigate(withLocalePath(language, basePath) + location.search, { replace: true });
    i18n.changeLanguage(language);
  };

  const items: MenuProps["items"] = LOCALES.map((lng) => ({
    key: lng,
    label: t(`language.names.${lng}`),
    onClick: () => handleLanguageChange(lng),
  }));

  return (
    <Dropdown
      menu={{ items, selectedKeys: [currentLocale] }}
      placement="bottomRight"
      trigger={["click"]}
      className={styles.languageSwitcher}
    >
      <Button type="text" icon={<GlobalOutlined />} title={t("language.switch")}>
        {t(`language.names.${currentLocale}`)}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;

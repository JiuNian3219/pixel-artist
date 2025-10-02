import { GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.less";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation("common");

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const items: MenuProps["items"] = [
    {
      key: "zh",
      label: t("language.chinese"),
      onClick: () => handleLanguageChange("zh"),
    },
    {
      key: "en",
      label: t("language.english"),
      onClick: () => handleLanguageChange("en"),
    },
  ];

  return (
    <Dropdown
      menu={{ items, selectedKeys: [i18n.language] }}
      placement="bottomRight"
      trigger={["click"]}
      className={styles.languageSwitcher}
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        title={t("language.switch")}
      >
        {i18n.language === "zh" ? "中文" : "English"}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;

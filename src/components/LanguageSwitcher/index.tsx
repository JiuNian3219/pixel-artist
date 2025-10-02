import { GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.less";

// 语言显示名称映射
const languageDisplayMap: Record<string, string> = {
  "zh-CN": "中文",
  "en-US": "English",
};

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation("common");

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const items: MenuProps["items"] = [
    {
      key: "zh-CN",
      label: t("language.chinese"),
      onClick: () => handleLanguageChange("zh-CN"),
    },
    {
      key: "en-US",
      label: t("language.english"),
      onClick: () => handleLanguageChange("en-US"),
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
        {languageDisplayMap[i18n.language] || languageDisplayMap.zh}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;

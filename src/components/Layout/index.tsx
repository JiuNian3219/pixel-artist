import logo from "@/assets/logo-with-title.svg";
import {
  getOgLocale,
  parseLocaleFromPath,
  withLocalePath,
} from "@/utils/locale";
import { getDefaultSEO, resolveSEOByPath } from "@/utils/seo";
import { Layout as AntdLayout, Menu } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";
import SEO from "../SEO";
import styles from "./index.module.less";

const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("common");
  const locale = parseLocaleFromPath(location.pathname);

  const currentSEO =
    resolveSEOByPath(location.pathname, locale) || getDefaultSEO();

  const menuItems = [
    {
      key: withLocalePath(locale, "/"),
      label: <Link to={withLocalePath(locale, "/")}>{t("nav.home")}</Link>,
    },
    {
      key: withLocalePath(locale, "/creator"),
      label: (
        <Link to={withLocalePath(locale, "/creator")}>{t("nav.creator")}</Link>
      ),
    },
  ];

  const handleLogoClick = () => {
    navigate(withLocalePath(locale, "/"));
  };

  // 保持 i18n 与路由语言同步
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <>
      <SEO
        title={currentSEO.title}
        description={currentSEO.description}
        keywords={currentSEO.keywords}
        siteName="Pixel Artist"
        ogImage={currentSEO.ogImage}
        robots={currentSEO.robots}
        jsonLd={currentSEO.jsonLd}
        locale={getOgLocale(locale)}
      />
      <AntdLayout className={styles.layout}>
        <Header className={styles.header}>
          <img
            src={logo}
            alt="Pixel Artist Logo"
            className={styles.logoImage}
            onClick={handleLogoClick}
            width={120}
            height={50}
            decoding="async"
          />
          <div className={styles.nav}>
            <Menu
              theme="light"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              className={styles.menu}
            />
            <LanguageSwitcher />
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>
          Pixel Artist ©{new Date().getFullYear()}
        </Footer>
      </AntdLayout>
    </>
  );
};

export default Layout;

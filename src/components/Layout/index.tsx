import logo from "@/assets/logo-with-title.svg";
import { getDefaultSEO, seoConfigs } from "@/utils/seo";
import { Layout as AntdLayout, Menu } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";
import SEO from "../SEO";
import styles from "./index.module.less";

const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const currentSEO = seoConfigs[location.pathname] || getDefaultSEO();

  const menuItems = [
    { key: "/", label: <Link to="/">{t("nav.home")}</Link> },
    { key: "/creator", label: <Link to="/creator">{t("nav.creator")}</Link> },
  ];

  const handleLogoClick = () => {
    navigate("/");
  };

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

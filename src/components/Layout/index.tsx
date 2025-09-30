import logo from "@/assets/logo-with-title.svg";
import { Layout as AntdLayout, Menu } from "antd";
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: "/", label: <Link to="/">首页</Link> },
    { key: "/creator", label: <Link to="/creator">创作</Link> },
  ];

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
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
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className={styles.menu}
        />
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer className={styles.footer}>
        Pixel Artist ©{new Date().getFullYear()}
      </Footer>
    </AntdLayout>
  );
};

export default Layout;

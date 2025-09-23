import logo from "@/assets/logo-with-title.svg";
import { Layout as AntdLayout, Menu } from "antd";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./index.module.less";

const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC = () => {
  const location = useLocation();

  const menuItems = [{ key: "/", label: <Link to="/">首页</Link> }];

  return (
    <AntdLayout className={styles.layout}>
      <Header className={styles.header}>
        <img
          src={logo}
          alt="Pixel Artist Logo"
          className={styles.logoImage}
        />
        <Menu
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

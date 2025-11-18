import { Button, Result } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { parseLocaleFromPath, withLocalePath } from "@/utils/locale";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const locale = parseLocaleFromPath(window.location.pathname);
  const { t } = useTranslation("404");

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("description")}
      extra={
        <Button
          type="primary"
          onClick={() => navigate(withLocalePath(locale, "/"))}
        >
          {t("actions.back_home")}
        </Button>
      }
    />
  );
};

export default NotFound;

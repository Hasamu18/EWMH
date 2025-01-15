import {
  MenuOutlined,
  FundOutlined,
  SolutionOutlined,
  TeamOutlined,
  BookOutlined,
  ToolOutlined,
  FileTextOutlined,
  DropboxOutlined,
  ShoppingCartOutlined,
  LikeOutlined,
  HomeOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Layout, Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";
import logo from "../../../assets/images/logo.png";
import logo2 from "../../../assets/images/logo2.png";
import { ROLE } from "../../../constants/role";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;

export default function MySider() {
  const { t } = useTranslation(["sider"]);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuth();

  const [collapsed, setCollapsed] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getSiderItems = (): MenuItem[] => {
    switch (state.currentUser.role) {
      case ROLE.manager:
        return [
          getItem(
            t("dashboard"),
            "/dashboard",
            () => navigate("/dashboard"),
            <FundOutlined />,
          ),
          getItem(
            t("customers"),
            "/customers",
            () => navigate("/customers"),
            <UserOutlined />,
          ),
          getItem(
            t("leaders"),
            "/leaders",
            () => navigate("/leaders"),
            <SolutionOutlined />,
          ),
          getItem(
            t("workers"),
            "/workers",
            () => navigate("/workers"),
            <TeamOutlined />,
          ),
          getItem(
            t("service_package"),
            "/services",
            () => navigate("/services"),
            <BookOutlined />,
          ),
          getItem(
            t("products"),
            "/products",
            () => navigate("/products"),
            <ToolOutlined />,
          ),
          getItem(
            t("contracts"),
            "/contracts",
            () => navigate("/contracts"),
            <FileTextOutlined />,
          ),
          getItem(
            t("requests"),
            "/requests",
            () => navigate("/requests"),
            <DropboxOutlined />,
          ),
          getItem(
            t("orders"),
            "/orders",
            () => navigate("/orders"),
            <ShoppingCartOutlined />,
          ),
          getItem(
            t("ratings"),
            "/ratings",
            () => navigate("/ratings"),
            <LikeOutlined />,
          ),
          getItem(
            t("apartments"),
            "/apartments",
            () => navigate("/apartments"),
            <HomeOutlined />,
          ),
          getItem(
            t("customer-verify"),
            "/customer-verify",
            () => navigate("/customer-verify"),
            <ProfileOutlined />,
          ),
        ];
      default:
        return [];
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="sticky bottom-0 top-0 h-screen overflow-auto"
      trigger={
        <div className="w-full border-r-[1px] border-t-[1px]">
          <MenuOutlined />
        </div>
      }
      width={256}
      style={{ scrollbarWidth: "thin", scrollbarColor: "unset" }}
    >
      <div className="flex justify-center border-r-[1px] border-gray-200">
        <div
          className={cn("flex items-center gap-3", {
            hidden: collapsed,
          })}
        >
          <img
            src={logo2}
            alt="logo"
            className="max-w-[50px] py-2 brightness-0 invert"
          />
          <img src={logo} alt="logo" className="max-w-[100px] py-2" />
        </div>
        <img
          src={logo2}
          alt="logo"
          className={cn("max-w-[50px] py-2 brightness-0 invert", {
            hidden: !collapsed,
          })}
        />
      </div>
      <ConfigProvider
        theme={{
          token: {
            fontSize: 18,
          },
          components: {
            Menu: {
              itemBg: "#1EA19F",
              popupBg: "#1EA19F",
              itemColor: "#fff",
              itemHoverColor: "#fff",
              itemActiveBg: "#FF7A00",
              itemSelectedBg: "#FF7A00",
              itemSelectedColor: "#fff",
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={getSiderItems()}
          selectedKeys={location.pathname
            .split("/")
            .slice(1)
            .map((_, index, arr) => `/${arr.slice(0, index + 1).join("/")}`)}
        />
      </ConfigProvider>
    </Sider>
  );
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  onClick?: () => void,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}

type MenuItem = Required<MenuProps>["items"][number];

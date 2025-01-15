import { Breadcrumb, BreadcrumbProps, ConfigProvider } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";

function CustomBreadcrumb({ ...props }: CustomBreadcrumbProps) {
  function itemRender(
    route: ItemType,
    _: AnyObject,
    routes: ItemType[],
    paths: string[],
  ) {
    const isLast = route?.path === routes[routes.length - 1]?.path;

    return isLast ? (
      <span>{route.title}</span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{route.title}</Link>
    );
  }
  return (
    <ConfigProvider>
      <Breadcrumb separator=">" itemRender={itemRender} {...props} />
    </ConfigProvider>
  );
}

export default CustomBreadcrumb;

type CustomBreadcrumbProps = BreadcrumbProps;

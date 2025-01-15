import React from "react";
import { useAppSelector } from "../../redux/hook";
import { Breadcrumb } from "../../components/breadcrumb";
import { Layout, Space } from "antd";

const { Content } = Layout;

export default function MyContent({ children }: { children: React.ReactNode }) {
  const { paths } = useAppSelector((state) => state.header);
  const currentPath = paths ? paths[paths.length - 1] : {};
  return (
    <Content className="relative overflow-hidden">
      <div style={{ margin: "24px 20px 20px", overflow: "initial" }}>
        {paths && paths.length > 1 && (
          <div className="pb-3">
            <Breadcrumb
              items={paths.map((path) => ({
                title: path.title,
                path: path.path,
              }))}
            />
          </div>
        )}
        {currentPath.title && (
          <div className="flex items-center pb-10">
            <div className="text-5xl font-semibold text-primary">
              {currentPath.title}
            </div>

            <Space className="ml-5">
              {currentPath.actions &&
                currentPath.actions.map((action: React.ReactNode, index) => (
                  <React.Fragment key={index}>{action}</React.Fragment>
                ))}
            </Space>
          </div>
        )}
        <main className="justify-center bg-white">{children}</main>
      </div>
    </Content>
  );
}

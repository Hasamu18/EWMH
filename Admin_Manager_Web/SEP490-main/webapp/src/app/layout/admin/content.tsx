import { Layout } from "antd";
import React from "react";
// import { useAppSelector } from "../../redux/hook";

const { Content } = Layout;

export default function MyContent({ children }: { children: React.ReactNode }) {
  return (
    <Content>
      <main className="justify-center bg-white">{children}</main>
    </Content>
  );
}

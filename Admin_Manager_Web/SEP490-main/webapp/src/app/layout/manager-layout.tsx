import Header from "./header";
import Sider from "./manager/sider";
import Content from "./manager/content";
import { ConfigProvider, Layout } from "antd";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "#4CC9C7",
            siderBg: "#1EA19F",
          },
        },
      }}
    >
      <Layout className="min-h-screen">
        <Sider />
        <Layout className="bg-white">
          <Header />
          <Content children={children} />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;

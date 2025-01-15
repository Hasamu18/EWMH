import { ConfigProvider, Tabs, TabsProps } from "antd";

function CustomTabs(props: CustomTabsProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            titleFontSize: 17,
          },
        },
      }}
    >
      <Tabs {...props} />
    </ConfigProvider>
  );
}

function BannerTabs(props: CustomTabsProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorderSecondary: "#00000030",
        },
        components: {
          Tabs: {
            cardBg: "#F7F7F7",
            horizontalMargin: "0px",
          },
        },
      }}
    >
      <Tabs
        type="card"
        size="large"
        tabBarGutter={10}
        tabPosition="top"
        {...props}
      />
    </ConfigProvider>
  );
}

CustomTabs.Banner = BannerTabs;

export default CustomTabs;

type CustomTabsProps = TabsProps;

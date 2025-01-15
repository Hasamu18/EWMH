// import { Envs } from "../utils/env";

import { Button, Drawer, Space, theme } from "antd";
import { useState } from "react";

export default function TestPage() {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    height: 200,
    padding: 48,
    overflow: "hidden",
    background: token.colorFillAlter,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <Space direction="vertical" size={100} className="w-full">
      <div style={containerStyle}>
        Render in this
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={showDrawer}>
            Open
          </Button>
        </div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={onClose}
          open={open}
          getContainer={false}
        >
          <p>Some contents...</p>
        </Drawer>
      </div>
      <div style={containerStyle}>
        Render in this
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={showDrawer}>
            Open
          </Button>
        </div>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={onClose}
          open={open}
          getContainer={false}
        >
          <p>Some contents...</p>
        </Drawer>
      </div>
    </Space>
  );
}

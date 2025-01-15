import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/route";
import { App, ConfigProvider } from "antd";
import { validateMessages } from "./constants/validate-messages";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";

import "dayjs/locale/vi";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
//change to vietnamese
dayjs.locale("vi");
//add plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function AppWrapper() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#FF7A00",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        },
      }}
      form={{ validateMessages }}
      locale={viVN}
    >
      <App>
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  );
}

export default AppWrapper;

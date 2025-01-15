import { FileOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, AvatarProps, ConfigProvider } from "antd";
import { validateImageString } from "../../utils/helpers";
import { Skeleton } from "../skeletons";
import { useEffect, useState } from "react";

function CustomAvatar(props: CustomAvatarProps) {
  const { src, size, className, shape, loading, ...rest } = props;
  const [staticLoading, setStaticLoading] = useState<boolean>(!!loading);

  useEffect(() => {
    if (src) {
      setStaticLoading(true);

      const timeoutId = setTimeout(() => {
        setStaticLoading(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
    if (!src) {
      setStaticLoading(true);
    }
  }, [src]);

  return (
    <ConfigProvider>
      {staticLoading ? (
        <Skeleton.Avatar className={className} size={size as number} />
      ) : (
        <Avatar
          size={size}
          src={validateImageString(src)}
          icon={shape === "square" ? <FileOutlined /> : <UserOutlined />}
          className={className}
          shape={shape}
          style={{ backgroundColor: "#fff" }}
          {...rest}
        />
      )}
    </ConfigProvider>
  );
}

export default CustomAvatar;

type CustomAvatarProps = {
  src?: string;
  size: AvatarProps["size"];
  className?: AvatarProps["className"];
  shape?: AvatarProps["shape"];
  loading?: boolean;
};

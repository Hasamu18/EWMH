import { ConfigProvider, Image, ImageProps } from "antd";
import { defaultImage } from "../../../constants/images";
import { validateImageString } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { Skeleton } from "../skeletons";

function CustomImage(props: CustomImageProps) {
  const { src, preview = false, loading, ...rest } = props;
  const [staticLoading, setStaticLoading] = useState<boolean>(!!loading);

  useEffect(() => {
    if (src) {
      setStaticLoading(true);

      const timeoutId = setTimeout(() => {
        setStaticLoading(false);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
    if (!src) {
      setStaticLoading(true);
    }
  }, [src]);

  return (
    <ConfigProvider>
      {staticLoading ? (
        <Skeleton.Image height={500} />
      ) : (
        <Image
          src={validateImageString(src) ?? "error"}
          fallback={defaultImage}
          preview={preview}
          {...rest}
        />
      )}
    </ConfigProvider>
  );
}

export default CustomImage;

type CustomImageProps = Omit<ImageProps, "src" | "fallback"> & {
  src?: ImageProps["src"];
};

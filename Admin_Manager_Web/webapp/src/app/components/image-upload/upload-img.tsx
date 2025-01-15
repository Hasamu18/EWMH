import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { RequiredFields } from "../../utils/types";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export function UploadImg(
  props: RequiredFields<
    Omit<UploadProps, "beforeUpload" | "onPreview" | "accept">,
    "listType" | "maxCount"
  > & { uploadConditions?: (file: FileType) => boolean },
) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = (file: FileType) => {
    if (props.uploadConditions && !props.uploadConditions(file)) {
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name ||
        file.url!.substring(file.url!.lastIndexOf("/") + 1).split("?")[0],
    );
  };

  return (
    <>
      <Upload
        {...props}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        accept="image/png, image/jpeg"
      >
        <button style={{ border: 0, background: "none" }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
}

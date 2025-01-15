import { App, GetProp, UploadFile, UploadProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import { UploadImg } from "./upload-img";

export default function CustomUploadImage(props: UploadImageProps) {
  const { message } = App.useApp();
  const { images, setImages, maxCount = 1 } = props;

  const imagesWithUid = images.map((image) => {
    return {
      ...image,
      uid: uuidv4(),
    };
  });

  const onChange: UploadProps["onChange"] = ({ fileList }) => {
    setImages(fileList);
  };

  const uploadConditions = (file: FileType) => {
    if (file.type != "image/jpeg" && file.type != "image/png") {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    if (!file.size || file.size / 1024 / 1024 > 2) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    return true;
  };

  return (
    <UploadImg
      listType="picture-card"
      maxCount={maxCount}
      fileList={imagesWithUid}
      onChange={onChange}
      uploadConditions={uploadConditions}
    />
  );
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export type UploadImage = Omit<UploadFile, "uid">;
type UploadImageProps = {
  images: UploadImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadImage[]>>;
  maxCount?: UploadProps["maxCount"];
};

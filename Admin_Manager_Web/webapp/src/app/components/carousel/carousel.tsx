import { Carousel } from "antd";
import { Image } from "../image";
import VietNamBanner from "../../../assets/banner.png";
import React from "react";

function CustomCarousel<RecordType>({
  items,
  render,
}: CustomCarouselProps<RecordType>) {
  if (Array.isArray(items)) {
    if (items.length === 0) {
      return <Image src={VietNamBanner} preview={true} />;
    }
    return (
      <Carousel arrows autoplay draggable infinite>
        {items.map((item, index) => (
          <React.Fragment key={index}>{render(item)}</React.Fragment>
        ))}
      </Carousel>
    );
  }
}

export default CustomCarousel;

type CustomCarouselProps<RecordType> = {
  height?: number;
  items: RecordType[] | number | undefined;
  render: (item?: RecordType) => React.ReactNode;
};

import { Col, Flex, Row } from "antd";
import React from "react";
import NotFound from "../not-found/not-found";

function CardListGrid<RecordType>({
  items,
  render,
}: CardListGridProps<RecordType>) {
  if (typeof items === "number") {
    return (
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32, xl: 40, xxl: 48 }, 28]}>
        {Array(items)
          .fill({})
          .map((_, index) => (
            <Col xs={24} sm={16} md={12} lg={8} xl={6} key={index}>
              {render()}
            </Col>
          ))}
      </Row>
    );
  }

  if (Array.isArray(items)) {
    if (items.length === 0) {
      return <NotFound />;
    }
    return (
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32, xl: 40, xxl: 48 }, 28]}>
        {items.map((item, index) => (
          <Col xs={24} sm={16} md={12} lg={8} xl={6} key={index}>
            {render(item)}
          </Col>
        ))}
      </Row>
    );
  }
}

function CardListGridHorizontal<RecordType>({
  items,
  render,
}: CardListGridProps<RecordType>) {
  if (typeof items === "number") {
    return (
      <Flex gap={"middle"} className="h-fit overflow-x-auto px-2 py-3">
        {Array(items)
          .fill({})
          .map((_, index) => (
            <div key={index} className="w-80 flex-shrink-0">
              {render()}
            </div>
          ))}
      </Flex>
    );
  }

  if (Array.isArray(items)) {
    if (items.length === 0) {
      return <NotFound />;
    }
    return (
      <Flex
        gap={"middle"}
        className="overflow-x-auto overflow-y-hidden px-2 py-3"
      >
        {items.map((item, index) => (
          <div key={index} className="z-[10]">
            {render(item)}
          </div>
        ))}
      </Flex>
    );
  }
}

CardListGrid.Horizontal = CardListGridHorizontal;

export default CardListGrid;

type CardListGridProps<RecordType> = {
  items: RecordType[] | number;
  render: (item?: RecordType) => React.ReactNode;
};

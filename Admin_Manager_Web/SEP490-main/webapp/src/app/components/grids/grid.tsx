import { Col, Row } from "antd";
import { Divider } from "../divider";
import React, { ReactNode } from "react";
import { ColProps } from "antd/lib";

export default function Grid({
  dividerColSpan = 2,
  ...props
}: CustomGridProps) {
  const numOfCol = props.items.length;
  let totalColSpan = 0;
  if (props.divider === false) {
    totalColSpan = 24;
  } else {
    const totalDividerSpan = dividerColSpan * (numOfCol - 1);
    totalColSpan = 24 - totalDividerSpan;
  }

  const colSpan = Math.floor(totalColSpan / numOfCol);

  const renderDivider = () => {
    if (props.divider === false) return null;
    if (props.divider === true || props.divider === undefined) {
      return (
        <Col span={dividerColSpan}>
          <Divider type="vertical" className="h-full bg-black" />
        </Col>
      );
    }
    return <Col span={dividerColSpan}>{props.divider}</Col>;
  };

  return (
    <Row>
      {props.items.map((item, index) => (
        <React.Fragment key={index}>
          <Col span={props.colSpan ?? colSpan} className={props.className}>
            {item}
          </Col>
          {index != numOfCol - 1 && <>{renderDivider()}</>}
        </React.Fragment>
      ))}
    </Row>
  );
}

type CustomGridProps = {
  items: ReactNode[];
  colSpan?: ColProps["span"];
  divider?: ReactNode | boolean;
  dividerColSpan?: number;
  className?: string;
};

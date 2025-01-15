import React from "react";
import NotFound from "../not-found/not-found";
import { Space, SpaceProps } from "antd";

type RecordType = {
  value: any; // required 'value' field
  [key: string]: any; // allow other dynamic fields
};

function Radio() {}

function RadioGroup({
  activeRender,
  items,
  render,
  gap = 10,
  direction = "horizontal",
  ...rest
}: RadioGroupProps<RecordType>) {
  const handleClick = (value: number) => {
    if (rest.onChange) {
      rest.onChange(value);
    }
  };

  if (Array.isArray(items)) {
    if (items.length === 0) {
      return <NotFound />;
    }
    return (
      <>
        <Space size={gap} direction={direction}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div
                className="cursor-pointer"
                onClick={() => handleClick(item.value)}
              >
                {rest.value === item.value ? activeRender(item) : render(item)}
              </div>
            </React.Fragment>
          ))}
        </Space>
      </>
    );
  }
}

Radio.ButtonGroup = RadioGroup;

export default Radio;

type RadioGroupProps<RecordType> = {
  defaultActiveIndex?: number; //starts at 0
  items: RecordType[] | number; //an array of object ([{name: "abc"}, {name: "abcd"}])
  gap?: SpaceProps["size"];
  direction?: SpaceProps["direction"];
  render: (item?: RecordType) => React.ReactNode; //specify how to render, eg: render={(item) => <div>{item?.name}</div>}
  activeRender: (item?: RecordType) => React.ReactNode; //specify how to render when focused, eg: activeRender={(item) => (<div className="text-primary">{item?.name}</div>)}
  value?: any;
  onChange?: (value: any) => void;
};

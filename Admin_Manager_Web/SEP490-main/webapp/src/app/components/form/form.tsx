import { Form, FormProps } from "antd";
import { RequiredFields } from "../../utils/types";
import { ReactNode } from "react";

type DefaultFormProps = Omit<
  RequiredFields<FormProps, "initialValues" | "name">,
  "layout" | "scrollToFirstError"
>;

function DefaultForm(props: DefaultFormProps) {
  const { children } = props;
  return (
    <Form
      layout="vertical"
      scrollToFirstError={{
        behavior: "smooth",
        block: "center",
        inline: "center",
      }}
      requiredMark="optional"
      {...props}
    >
      <>{children as ReactNode}</>
    </Form>
  );
}

DefaultForm.useWatch = Form.useWatch;
DefaultForm.Item = Form.Item;
DefaultForm.useForm = Form.useForm;
DefaultForm.Provider = Form.Provider;
DefaultForm.List = Form.List;

export default DefaultForm;

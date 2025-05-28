import React from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import type { FormInstance } from "antd";

interface FormField {
  name: string;
  label: string;
  type: "text" | "date" | "select";
  required?: boolean;
  options?: { label: string; value: string | number }[];
}

interface FormModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: any;
  fields: FormField[];
  loading?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  visible,
  onCancel,
  onFinish,
  initialValues,
  fields,
  loading,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: any) => {
    const processedValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        // Dayjs
        if (value && typeof (value as any).toDate === "function") {
          acc[key] = (value as any).toDate().toISOString().split("T")[0];
        }
        // Date
        else if (value instanceof Date) {
          acc[key] = value.toISOString().split("T")[0];
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    onFinish(processedValues);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Please input ${field.label.toLowerCase()}!`,
              },
            ]}
          >
            {field.type === "text" && <Input />}
            {field.type === "date" && <DatePicker style={{ width: "100%" }} />}
            {field.type === "select" && (
              <Select>
                {field.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ))}

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;

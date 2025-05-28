"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import type { Part, Equipment, Area, Plant } from "@/services/api";

interface Props {
  open: boolean;
  initialData: any | null;
  parts: Part[];
  equipments: Equipment[];
  areas: Area[];
  plants: Plant[];
  loadingOptions: boolean;
  onCancel(): void;
  onSubmit(values: any): void;
}

export default function MaintenanceForm({
  open,
  initialData,
  parts,
  equipments,
  areas,
  plants,
  loadingOptions,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();
  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (open) {
      if (initialData && !loadingOptions) {
        form.setFieldsValue({
          title: initialData.title,
          fixedDate: initialData.fixedDate ? dayjs(initialData.fixedDate) : undefined,
          baseType: initialData.baseType ?? "piece",
          intervalMonths: initialData.intervalMonths,
          dueDate: dayjs(initialData.dueDate),
          partId: initialData.partId,
          equipmentId: initialData.equipmentId,
          areaId: initialData.areaId,
          plantId: initialData.plantId,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ baseType: "piece" });
      }
    }
  }, [open, initialData, loadingOptions, form]);

  return (
    <Modal
      open={open}
      title={isEditing ? "Editar Manutenção" : "Nova Manutenção"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText="Salvar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="title" label="Título" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="fixedDate"
          label="Data Fixa"
          rules={[
            {
              validator: (_, value) =>
                value && value.startOf("day").isBefore(dayjs().startOf("day"))
                  ? Promise.reject(new Error("Data Fixa não pode ser anterior a hoje"))
                  : Promise.resolve(),
            },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current.startOf("day") < dayjs().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item name="baseType" label="Base da Manutenção">
          <Select>
            <Select.Option value="piece">Instalação da Peça</Select.Option>
            <Select.Option value="equipment">
              Início de Operação do Equipamento
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="intervalMonths"
          label="Intervalo (meses)"
          rules={[{ type: "number", min: 1, message: "Intervalo mínimo é 1 mês" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Data Limite"
          dependencies={["fixedDate", "intervalMonths", "baseType"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, due) {
                const fixed: dayjs.Dayjs = getFieldValue("fixedDate");
                const interval: number = getFieldValue("intervalMonths");
                if (!due) return Promise.resolve();

                if (due.isBefore(dayjs().startOf("day"))) {
                  return Promise.reject("Data Limite não pode ser anterior a hoje");
                }
                if (fixed && due.isBefore(fixed, "day")) {
                  return Promise.reject(
                    "Data Limite deve ser igual ou posterior à Data Fixa"
                  );
                }
                if (fixed && interval) {
                  const mínima = fixed.add(interval, "month").startOf("day");
                  if (due.isBefore(mínima)) {
                    return Promise.reject(
                      `Data Limite deve ser ≥ ${mínima.format(
                        "DD/MM/YYYY"
                      )} (Data Fixa + ${interval} meses)`
                    );
                  }
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current.startOf("day") < dayjs().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item name="partId" label="Peça" rules={[{ required: true }]}>
          <Select
            options={parts.map((p) => ({ label: p.name, value: p.id }))}
            loading={loadingOptions}
          />
        </Form.Item>

        <Form.Item name="equipmentId" label="Equipamento" rules={[{ required: true }]}>
          <Select
            options={equipments.map((e) => ({ label: e.name, value: e.id }))}
            loading={loadingOptions}
          />
        </Form.Item>

        <Form.Item name="areaId" label="Área" rules={[{ required: true }]}>
          <Select
            options={areas.map((a) => ({ label: a.name, value: a.id }))}
            loading={loadingOptions}
          />
        </Form.Item>

        <Form.Item name="plantId" label="Planta" rules={[{ required: true }]}>
          <Select
            options={plants.map((p) => ({ label: p.name, value: p.id }))}
            loading={loadingOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

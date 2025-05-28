"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Space,
  SelectProps,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { equipmentApi, areaApi, Equipment, Area } from "@/services/api";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function EquipmentPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );

  // duas listas: allOptions nunca muda, filteredOptions é a atual exibida
  const [allOptions, setAllOptions] = useState<SelectProps["options"]>([]);
  const [filteredOptions, setFilteredOptions] = useState<SelectProps["options"]>([]);
  
  const [filters, setFilters] = useState({
    name: "",
    areaId: "",
    manufacturer: "",
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAreaId = searchParams.get("areaId");

  const { data: equipment, isLoading: equipmentLoading } = useQuery(
    "equipment",
    () => equipmentApi.getAll().then((res) => res.data)
  );
  const { data: areas, isLoading: areasLoading } = useQuery("areas", () =>
    areaApi.getAll().then((res) => res.data)
  );

  // Inicializa allOptions e filteredOptions assim que áreas chegam
  useEffect(() => {
    if (areas) {
      const opts = areas.map((a) => ({ label: a.name, value: a.id }));
      setAllOptions(opts);
      setFilteredOptions(opts);
    }
  }, [areas]);

  // Se veio ?areaId na URL, já filtra a coluna
  useEffect(() => {
    if (initialAreaId) {
      setFilters((prev) => ({ ...prev, areaId: initialAreaId }));
    }
  }, [initialAreaId]);

  const createMutation = useMutation(
    (data: Omit<Equipment, "id" | "createdAt" | "updatedAt"> & {
      areas: string[];
    }) => equipmentApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("equipment");
        message.success("Equipment created successfully");
        setIsModalVisible(false);
        form.resetFields();
      },
    }
  );

  const updateMutation = useMutation(
    ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Equipment> & { areas?: string[] };
    }) => equipmentApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("equipment");
        message.success("Equipment updated successfully");
        setIsModalVisible(false);
        form.resetFields();
        setEditingEquipment(null);
      },
      onError: (err: any) => {
        if (
          err.response?.status === 400 &&
          err.response.data.includes("not neighbors")
        ) {
          message.error(
            "Você só pode associar este equipamento a áreas que sejam vizinhas entre si."
          );
        } else {
          message.error("Ocorreu um erro ao atualizar o equipamento.");
        }
      },
    }
  );

  const deleteMutation = useMutation((id: string) =>
    equipmentApi.delete(id)
  , {
    onSuccess: () => {
      queryClient.invalidateQueries("equipment");
      message.success("Equipment deleted successfully");
    },
  });

  const filteredEquipment = equipment?.filter((eq) => {
    const nameMatch = eq.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const manufacturerMatch = eq.manufacturer
      .toLowerCase()
      .includes(filters.manufacturer.toLowerCase());
    const areaMatch =
      !filters.areaId ||
      eq.areas?.some((a) => a.id === filters.areaId) ||
      eq.area?.id === filters.areaId;
    return nameMatch && manufacturerMatch && areaMatch;
  });

  const columns: TableProps<Equipment>["columns"] = [
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Manufacturer", dataIndex: "manufacturer", key: "manufacturer", sorter: (a, b) => a.manufacturer.localeCompare(b.manufacturer) },
    { title: "Serial Number", dataIndex: "serialNumber", key: "serialNumber" },
    {
      title: "Initial Ops Date",
      dataIndex: "initialOperationsDate",
      key: "initialOperationsDate",
      render: (d) => dayjs(d).format("YYYY-MM-DD"),
      sorter: (a, b) => dayjs(a.initialOperationsDate).unix() - dayjs(b.initialOperationsDate).unix(),
    },
    {
      title: "Areas",
      key: "areas",
      render: (_, r) => (r.areas || [r.area]).map((a) => a?.name).filter(Boolean).join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingEquipment(record);
              form.setFieldsValue({
                ...record,
                areas: record.areas?.map((a) => a.id) || [],
                initialOperationsDate: dayjs(record.initialOperationsDate),
              });
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => router.push(`/parts?equipmentId=${record.id}`)}
          >
            Parts
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() =>
              Modal.confirm({
                title: "Are you sure you want to delete this equipment?",
                onOk: () => deleteMutation.mutate(record.id),
              })
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <Space style={{ marginBottom: 16 }} size="large">
        <Input
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by area"
          allowClear
          value={filters.areaId || undefined}
          onChange={(v) => setFilters({ ...filters, areaId: v || "" })}
          style={{ width: 200 }}
        >
          {(areas ?? []).map((a) => (
            <Select.Option key={a.id} value={a.id}>
              {a.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Filter by manufacturer"
          value={filters.manufacturer}
          onChange={(e) => setFilters({ ...filters, manufacturer: e.target.value })}
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingEquipment(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          Add Equipment
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredEquipment}
        loading={equipmentLoading || areasLoading}
        rowKey="id"
        pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: (t) => `Total ${t} items` }}
      />

      <Modal
        title={editingEquipment ? "Edit Equipment" : "Add Equipment"}
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); setEditingEquipment(null); }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = { ...values, initialOperationsDate: values.initialOperationsDate.format("YYYY-MM-DD") };
            if (editingEquipment) {
              updateMutation.mutate({ id: editingEquipment.id, data: payload });
            } else {
              createMutation.mutate(payload);
            }
          }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="manufacturer" label="Manufacturer" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="serialNumber" label="Serial Number" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="initialOperationsDate" label="Initial Ops Date" rules={[{ required: true }]}><DatePicker style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="areas" label="Áreas" rules={[{ required: true, message: "Selecione ao menos uma área" }]}>
            <Select
              mode="multiple"
              placeholder="Escolha áreas"
              options={filteredOptions}
              onChange={async (selectedIds: string[]) => {
                if (selectedIds.length === 0) {
                  setFilteredOptions(allOptions);
                  return;
                }
                const allNbrsArrays = await Promise.all(
                  selectedIds.map((id) =>
                    areaApi.getNeighbors(id).then((res) => res.data.map((a) => a.id))
                  )
                );
                const commonNbrs = allNbrsArrays.reduce<string[]>(
                  (acc, arr) => acc.filter((x) => arr.includes(x)),
                  allNbrsArrays[0] || []
                );
                const keepIds = new Set<string>([...selectedIds, ...commonNbrs]);
                setFilteredOptions((allOptions || []).filter((o) => keepIds.has(o.value as string)));
              }}
            />
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">{editingEquipment ? "Update" : "Create"}</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

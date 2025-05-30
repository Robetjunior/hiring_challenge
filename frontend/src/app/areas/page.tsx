"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { areaApi, plantApi, Area, Plant } from "@/services/api";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useSearchParams, useRouter } from "next/navigation";
import type { ColumnsType } from "antd/es/table";

export default function AreasPage() {
  const [form] = Form.useForm();
  const [nbrForm] = Form.useForm<{ neighbors: string[] }>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [filters, setFilters] = useState({ name: "", plantId: "" });
  const [nbrModalVisible, setNbrModalVisible] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [currentNeighbors, setCurrentNeighbors] = useState<Area[]>([]);

  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const plantId = searchParams.get("plantId");

  const { data: areas = [], isLoading: areasLoading } = useQuery<Area[]>(
    "areas",
    () => areaApi.getAll().then((res) => res.data)
  );
  const { data: plants = [], isLoading: plantsLoading } = useQuery<Plant[]>(
    "plants",
    () => plantApi.getAll().then((res) => res.data)
  );

  useEffect(() => {
    if (plantId) {
      setFilters((f) => ({ ...f, plantId }));
    }
  }, [plantId]);

  const createMutation = useMutation(
    (data: Omit<Area, "id" | "createdAt" | "updatedAt" | "neighbors">) =>
      areaApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("areas");
        message.success("Area criada com sucesso");
        setIsModalVisible(false);
        form.resetFields();
      },
    }
  );
  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Area> }) =>
      areaApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("areas");
        message.success("Area atualizada com sucesso");
        setIsModalVisible(false);
        setEditingArea(null);
        form.resetFields();
      },
    }
  );
  const deleteMutation = useMutation((id: string) => areaApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("areas");
      message.success("Area deletada com sucesso");
    },
  });

  const addNbrMut = useMutation(
    ({ areaId, neighborId }: { areaId: string; neighborId: string }) =>
      areaApi.addNeighbor(areaId, neighborId),
    { onSuccess: () => queryClient.invalidateQueries("areas") }
  );
  const remNbrMut = useMutation(
    ({ areaId, neighborId }: { areaId: string; neighborId: string }) =>
      areaApi.removeNeighbor(areaId, neighborId),
    { onSuccess: () => queryClient.invalidateQueries("areas") }
  );

  const openNbrModal = async (area: Area) => {
    setCurrentArea(area);
    const { data } = await areaApi.getNeighbors(area.id);
    setCurrentNeighbors(data);
    nbrForm.setFieldsValue({ neighbors: data.map((a) => a.id) });
    setNbrModalVisible(true);
  };
  const handleNbrSave = async (ids: string[]) => {
    if (!currentArea) return;
    const oldIds = new Set(currentNeighbors.map((a) => a.id));
    const newIds = new Set(ids);
    for (let id of ids) {
      if (!oldIds.has(id)) {
        await addNbrMut.mutateAsync({ areaId: currentArea.id, neighborId: id });
      }
    }
    for (let id of currentNeighbors.map((a) => a.id)) {
      if (!newIds.has(id)) {
        await remNbrMut.mutateAsync({ areaId: currentArea.id, neighborId: id });
      }
    }
    message.success("Vizinhos atualizados");
    setNbrModalVisible(false);
  };

  // Filtered list
  const filteredAreas = areas.filter((a) => {
    const nameMatch = a.name.toLowerCase().includes(filters.name.toLowerCase());
    const plantMatch = !filters.plantId || a.plantId === filters.plantId;
    return nameMatch && plantMatch;
  });

  // Table columns
  const columns: ColumnsType<Area> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Location",
      dataIndex: "locationDescription",
      key: "locationDescription",
    },
    {
      title: "Plant",
      dataIndex: ["plant", "name"],
      key: "plant",
      sorter: (a, b) =>
        (a.plant?.name || "").localeCompare(b.plant?.name || ""),
    },
    {
      title: "Neighbors",
      key: "neighbors",
      render: (_, rec) => (
        <Button icon={<LinkOutlined />} onClick={() => openNbrModal(rec)}>
          {rec.neighbors?.length || 0}
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingArea(rec);
              form.setFieldsValue({
                name: rec.name,
                locationDescription: rec.locationDescription,
                plantId: rec.plantId, // Preenche também plantId
              });
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => router.push(`/equipment?areaId=${rec.id}`)}
          >
            Equipment
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Delete this area?",
                onOk: () => deleteMutation.mutate(rec.id),
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
          onChange={(e) =>
            setFilters((f) => ({ ...f, name: e.target.value }))
          }
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by plant"
          allowClear
          value={filters.plantId || undefined}
          onChange={(v) => setFilters((f) => ({ ...f, plantId: v }))}
          style={{ width: 200 }}
        >
          {plants.map((p) => (
            <Select.Option key={p.id} value={p.id}>
              {p.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingArea(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Area
        </Button>
      </Space>

      <Table<Area>
        columns={columns}
        dataSource={filteredAreas}
        loading={areasLoading || plantsLoading}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title={editingArea ? "Edit Area" : "Add Area"}
        open={isModalVisible}
        destroyOnClose
        forceRender
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingArea(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(vals) => {
            if (editingArea) {
              updateMutation.mutate({
                id: editingArea.id,
                data: {
                  name: vals.name,
                  locationDescription: vals.locationDescription,
                  plantId: vals.plantId, 
                },
              });
            } else {
              createMutation.mutate({
                name: vals.name,
                locationDescription: vals.locationDescription,
                plantId: vals.plantId,
              });
            }
          }}
          onFinishFailed={(err) => console.log("❌ onFinishFailed:", err)}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="locationDescription"
            label="Location Description"
            rules={[
              { required: true, message: "Please input a description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="plantId"
            label="Plant"
            rules={[{ required: true, message: "Please select a plant" }]}
          >
            <Select>
              {plants.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingArea ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Manage Neighbors: ${currentArea?.name}`}
        open={nbrModalVisible}
        footer={null}
        onCancel={() => setNbrModalVisible(false)}
      >
        <Form
          form={nbrForm}
          layout="vertical"
          onFinish={(vals) => handleNbrSave(vals.neighbors)}
        >
          <Form.Item
            name="neighbors"
            label="Select Neighbor Areas"
            rules={[{ required: true, message: "Pick at least one neighbor" }]}
          >
            <Select mode="multiple">
              {areas
                .filter((a) => a.id !== currentArea?.id)
                .map((a) => (
                  <Select.Option key={a.id} value={a.id}>
                    {a.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setNbrModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Neighbors
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

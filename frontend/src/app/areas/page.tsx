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
import { areaApi, plantApi, Area } from "@/services/api";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { useSearchParams, useRouter } from "next/navigation";

export default function AreasPage() {
  const [form] = Form.useForm();
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

  // fetch all areas & plants
  const { data: areas, isLoading: areasLoading } = useQuery("areas", () =>
    areaApi.getAll().then((res) => res.data)
  );
  const { data: plants, isLoading: plantsLoading } = useQuery("plants", () =>
    plantApi.getAll().then((res) => res.data)
  );

  // Set initial plant filter if plantId is provided
  useEffect(() => {
    if (plantId) {
      setFilters((prev) => ({ ...prev, plantId }));
    }
  }, [plantId]);
  const createMutation = useMutation(
    (data: Omit<Area, "id" | "createdAt" | "updatedAt" | "neighbors">) =>
      areaApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("areas");
        message.success("Area created successfully");
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
        message.success("Area updated successfully");
        setIsModalVisible(false);
        form.resetFields();
        setEditingArea(null);
      },
    }
  );
  const deleteMutation = useMutation((id: string) => areaApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("areas");
      message.success("Area deleted successfully");
    },
  });

  // neighbor mutations
  const addNbrMut = useMutation(
    ({ areaId, neighborId }: { areaId: string; neighborId: string }) =>
      areaApi.addNeighbor(areaId, neighborId),
    {
      onSuccess: () => queryClient.invalidateQueries("areas"),
    }
  );
  const remNbrMut = useMutation(
    ({ areaId, neighborId }: { areaId: string; neighborId: string }) =>
      areaApi.removeNeighbor(areaId, neighborId),
    {
      onSuccess: () => queryClient.invalidateQueries("areas"),
    }
  );

  // open neighbor modal & load existing neighbors
  const openNbrModal = async (area: Area) => {
    setCurrentArea(area);
    const { data } = await areaApi.getNeighbors(area.id);
    setCurrentNeighbors(data);
    setNbrModalVisible(true);
  };

  const handleNbrSave = async (selectedIds: string[]) => {
    if (!currentArea) return;
    const oldIds = new Set(currentNeighbors.map((a) => a.id));
    const newIds = new Set(selectedIds);

    // adds
    for (let id of selectedIds) {
      if (!oldIds.has(id)) {
        await addNbrMut.mutateAsync({ areaId: currentArea.id, neighborId: id });
      }
    }
    // removes
    for (let id of currentNeighbors.map((a) => a.id)) {
      if (!newIds.has(id)) {
        await remNbrMut.mutateAsync({ areaId: currentArea.id, neighborId: id });
      }
    }

    message.success("Neighbors updated");
    setNbrModalVisible(false);
  };

  // filtered view
  const filteredAreas = areas?.filter((area) => {
    const nameMatch = area.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const plantMatch = !filters.plantId || area.plantId === filters.plantId;
    return nameMatch && plantMatch;
  });

  const columns: TableProps<Area>["columns"] = [
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
              form.setFieldsValue(rec);
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
          {plants?.map((p) => (
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

      <Table
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

      {/* Create / Edit Area Modal */}
      <Modal
        title={editingArea ? "Edit Area" : "Add Area"}
        open={isModalVisible}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingArea(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(vals) => {
            if (editingArea) {
              updateMutation.mutate({ id: editingArea.id, data: vals });
            } else {
              createMutation.mutate(vals);
            }
          }}
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
            rules={[{ required: true, message: "Please input a description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="plantId"
            label="Plant"
            rules={[{ required: true, message: "Please select a plant" }]}
          >
            <Select>
              {plants?.map((p) => (
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

      {/* Manage Neighbors Modal */}
      <Modal
        title={`Manage Neighbors: ${currentArea?.name}`}
        open={nbrModalVisible}
        footer={null}
        onCancel={() => setNbrModalVisible(false)}
      >
        <Form
          layout="vertical"
          initialValues={{
            neighbors: currentNeighbors.map((a) => a.id),
          }}
          onFinish={(vals: any) => handleNbrSave(vals.neighbors)}
        >
          <Form.Item
            name="neighbors"
            label="Select Neighbor Areas"
            rules={[
              { required: true, message: "Pick at least one neighbor" },
            ]}
          >
            <Select mode="multiple">
              {areas
                ?.filter((a) => a.id !== currentArea?.id)
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

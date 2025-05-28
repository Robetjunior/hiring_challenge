"use client";

import React, { useState } from "react";
import { Table, Button, Space, message, Tooltip } from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import MaintenanceForm from "@/components/MaintenanceForm";
import { maintenanceApi, partApi, equipmentApi, areaApi, plantApi } from "@/services/api";

export default function MaintenancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data = [], isLoading, refetch } = useQuery(
    "maintenance/upcoming",
    () => maintenanceApi.getUpcoming().then((r) => r.data)
  );

  // selects
  const { data: parts = [] } = useQuery("parts", () => partApi.getAll().then((r) => r.data));
  const { data: equipments = [] } = useQuery("equipment", () =>
    equipmentApi.getAll().then((r) => r.data)
  );
  const { data: areas = [] } = useQuery("areas", () => areaApi.getAll().then((r) => r.data));
  const { data: plants = [] } = useQuery("plants", () => plantApi.getAll().then((r) => r.data));
  const loadingOpts = !parts.length || !equipments.length || !areas.length || !plants.length;

  const createOrUpdate = useMutation(
    (payload: any) =>
      editing
        ? maintenanceApi.update(editing.id, payload)
        : maintenanceApi.create(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("maintenance/upcoming");
        message.success(editing ? "Atualizado" : "Criado");
        setModalOpen(false);
        setEditing(null);
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message || "Erro ao salvar");
      },
    }
  );

  const handleDelete = async (id: string) => {
    try {
      await maintenanceApi.delete(id);
      message.success("Removido");
      refetch();
    } catch {
      message.error("Falha ao remover");
    }
  };

  const openForm = (record?: any) => {
    setEditing(record || null);
    setModalOpen(true);
  };

  const handleSubmit = (vals: any) => {
    const payload = {
      ...vals,
      fixedDate: vals.fixedDate?.toDate(),
      dueDate: vals.dueDate?.toDate(),
      baseType: vals.baseType,
      intervalMonths: vals.intervalMonths,
      partId: vals.partId,
      equipmentId: vals.equipmentId,
      areaId: vals.areaId,
      plantId: vals.plantId,
      title: vals.title,
    };
    createOrUpdate.mutate(payload);
  };

  const columns = [
    {
      title: "Data Limite",
      dataIndex: "dueDate",
      render: (d: string) => dayjs(d).format("DD-MM-YYYY"),
    },
    { title: "Título", dataIndex: "title" },
    { title: "Base", dataIndex: "baseType" },
    { title: "Peça", dataIndex: ["part", "name"] },
    { title: "Equipamento", dataIndex: ["equipment", "name"] },
    { title: "Área", dataIndex: ["area", "name"] },
    { title: "Planta", dataIndex: ["plant", "name"] },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => openForm(record)}>
            Editar
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
          Nova Manutenção
        </Button>
        <Button icon={<CalendarOutlined />} onClick={() => router.push("/maintenance/calendar")}>
          Ver Calendário
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <MaintenanceForm
        open={modalOpen}
        initialData={editing}
        parts={parts}
        equipments={equipments}
        areas={areas}
        plants={plants}
        loadingOptions={loadingOpts}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

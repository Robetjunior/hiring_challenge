// src/app/maintenance/calendar/page.tsx
"use client";

import React from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import MaintenanceCalendar from "@/components/MaintenanceCalendar";

export default function CalendarioManutencoesPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Calendário de Manutenções</h1>
      </div>
      <MaintenanceCalendar />
    </div>
  );
}

"use client";

import React from "react";
import { Calendar, Badge, ConfigProvider } from "antd";
import ptBR from "antd/es/locale/pt_BR";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { maintenanceApi } from "@/services/api";

dayjs.locale("pt-br");

export default function MaintenanceCalendar() {
  const { data: events = [] } = useQuery(
    "maintenance/upcoming",
    () => maintenanceApi.getUpcoming().then((r) => r.data)
  );

  function dateCellRender(value: dayjs.Dayjs) {
    const list = events.filter((m) =>
      dayjs(m.dueDate).isSame(value, "day")
    );
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {list.map((item) => (
          <li key={item.id}>
            <Badge status="warning" text={item.title} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ConfigProvider locale={ptBR}>
      <Calendar
        cellRender={(date, info) => {
          if (info.type === "date") {
            return (
              <div className="ant-picker-cell-inner">
                {date.date()}
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {events
                    .filter((m) => dayjs(m.dueDate).isSame(date, "day"))
                    .map((item) => (
                      <li key={item.id}>
                        <Badge status="warning" text={item.title} />
                      </li>
                    ))}
                </ul>
              </div>
            );
          }
          return null;
        }}
      />
    </ConfigProvider>
  );
}

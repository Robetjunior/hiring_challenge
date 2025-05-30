import { UpdateMaintenanceDTO } from '@/dtos/MaintenanceDTO';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Plant {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  [x: string]: any;
  id: string;
  name: string;
  locationDescription: string;
  plantId: string;
  plant?: Plant;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  serialNumber: string;
  initialOperationsDate: string;
  // legacy single-area kept para compatibilidade:
  areaId: string;
  area?: Area;
  // nova multi-área:
  areas?: Area[];
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  title: string;
  dueDate: string;
  intervalMonths?: number;
  fixedDate?: string;
  partId: string;
  part?: Part;
  equipmentId: string;
  equipment?: Equipment;
  areaId: string;
  area?: Area;
  plantId: string;
  plant?: Plant;
  createdAt: string;
  updatedAt: string;
}

export enum PartType {
  ELECTRIC = "electric",
  ELECTRONIC = "electronic",
  MECHANICAL = "mechanical",
  HYDRAULICAL = "hydraulical"
}

export interface Part {
  id: string;
  name: string;
  type: PartType;
  manufacturer: string;
  serialNumber: string;
  installationDate: string;
  equipmentId: string;
  equipment?: Equipment;
  createdAt: string;
  updatedAt: string;
}

export const plantApi = {
  getAll: () => api.get<Plant[]>('/plants'),
  getById: (id: string) => api.get<Plant>(`/plants/${id}`),
  create: (data: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Plant>('/plants', data),
  update: (id: string, data: Partial<Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Plant>(`/plants/${id}`, data),
  delete: (id: string) => api.delete(`/plants/${id}`),
};

export const areaApi = {
  getAll: () => api.get<Area[]>('/areas'),
  getById: (id: string) => api.get<Area>(`/areas/${id}`),
  create: (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Area>('/areas', data),
  update: (id: string, data: Partial<Omit<Area, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Area>(`/areas/${id}`, data),
  delete: (id: string) => api.delete(`/areas/${id}`),
  getNeighbors: (areaId: string) =>
    api.get<Area[]>(`/areas/${areaId}/neighbors`),
  addNeighbor: (areaId: string, neighborId: string) =>
    api.post<void>(`/areas/${areaId}/neighbors/${neighborId}`),
  removeNeighbor: (areaId: string, neighborId: string) =>
    api.delete<void>(`/areas/${areaId}/neighbors/${neighborId}`),
};

export const equipmentApi = {
  getAll: () => api.get<Equipment[]>('/equipment'),
  getById: (id: string) => api.get<Equipment>(`/equipment/${id}`),
  create: (data: Omit<Equipment, 'id'|'createdAt'|'updatedAt'> & { areas: string[] }) =>
    api.post<Equipment>('/equipment', data),
  update: (id: string, data: Partial<Omit<Equipment, 'id'|'createdAt'|'updatedAt'> & { areas?: string[] }>) =>
    api.put<Equipment>(`/equipment/${id}`, data),
  delete: (id: string) => api.delete(`/equipment/${id}`),
};

export const partApi = {
  getAll: () => api.get<Part[]>('/parts'),
  getById: (id: string) => api.get<Part>(`/parts/${id}`),
  create: (data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Part>('/parts', data),
  update: (id: string, data: Partial<Omit<Part, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Part>(`/parts/${id}`, data),
  delete: (id: string) => api.delete(`/parts/${id}`),
}; 

export const maintenanceApi = {
  getAll: () => api.get<Maintenance[]>('/maintenance'),
  getUpcoming: () => api.get<Maintenance[]>("/maintenance/upcoming"),
  getById: (id: string) => api.get<Maintenance>(`/maintenance/${id}`),
  create: (data: Omit<Maintenance, 'id'|'createdAt'|'updatedAt'|'dueDate'> & {
    dueDate?: string;
    fixedDate?: string;
    intervalMonths?: number;
  }) => api.post<Maintenance>('/maintenance', data),
  update: (id: string, dto: UpdateMaintenanceDTO) =>
    api.put<Maintenance>(`/maintenance/${id}`, dto),
  delete: (id: string) => api.delete<void>(`/maintenance/${id}`),
};
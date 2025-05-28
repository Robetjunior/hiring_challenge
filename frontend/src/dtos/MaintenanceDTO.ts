export interface CreateMaintenanceDTO {
  title: string;
  fixedDate?: string;      
  intervalMonths?: number;  
  dueDate?: string;        
  partId: string;
  equipmentId: string;
  areaId: string;
  plantId: string;
}

export interface UpdateMaintenanceDTO {
  title?: string;
  fixedDate?: string;
  intervalMonths?: number;
  dueDate?: string;
  partId?: string;
  equipmentId?: string;
  areaId?: string;
  plantId?: string;
}
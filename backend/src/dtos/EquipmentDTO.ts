export interface CreateEquipmentDTO {
  name: string;
  manufacturer: string;
  serialNumber: string;
  initialOperationsDate: Date;  
  areas?: string[];              
}

export interface UpdateEquipmentDTO {
  name?: string;
  manufacturer?: string;
  serialNumber?: string;
  initialOperationsDate?: Date;
  areas?: string[];
}

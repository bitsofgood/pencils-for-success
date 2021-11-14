import { SupplyRequestStatus } from '.prisma/client';

type SupplyRequestItem = {
  id: number;
};

export type NewSupplyRequestInputBody = {
  quantity: number;
  note: string;
  status: SupplyRequestStatus;
  items: SupplyRequestItem[];
};

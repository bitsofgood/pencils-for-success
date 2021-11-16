import { SupplyRequestStatus } from '@prisma/client';

type SupplyRequestItem = {
  id: number;
};

export type NewSupplyRequestInputBody = {
  quantity: number;
  note: string;
  status: SupplyRequestStatus;
  item: SupplyRequestItem;
};

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

type SupplyRequestItem = {
  id: number;
};

export type NewSupplyRequestInputBody = {
  quantity: number;
  item: SupplyRequestItem;
  note?: string;
};

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

import { WarrantyCardModel } from "./WarrantyCardModel";

export type WarrantyCardsResponse = {
  results: WarrantyCardModel[];
  count: number;
};

import { Product } from "./Product";

export type ProductsResponse = {
  results: Product[];
  count: number;
};

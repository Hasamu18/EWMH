import { useGlobalState } from "@/context/GlobalProvider";
import useAxios from "@/utils/useSaleAxios";

export function useProduct() {
  const { fetchData, error } = useAxios();
  const {
    products,
    setProducts,
    searchProductQuery,
    setSearchProductQuery,
    setSelectedProductFilter,
    selectedProductFilter,
  } = useGlobalState();

  const ITEMS_PER_PAGE = 8; 

  const handleGetProduct = async (pageIndex = 1) => {
    try {
      const response = await fetchData({
        url: "/product/5",
        method: "GET",
        params: {
          pageIndex,
          SearchByName: searchProductQuery,
          IncreasingPrice: selectedProductFilter,
          Status: "true"
        },
      });

      if (response && response.results) {
        setProducts(response.results);
        const totalPages = Math.ceil(response.count / ITEMS_PER_PAGE);
        return { products: response.results, totalPages };
      } else {
        setProducts([]);
        console.error("No products found or failed response:", response || error);
        return { products: [], totalPages: 0 };
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      return { products: [], totalPages: 0 };
    }
  };

  return {
    products,
    searchProductQuery,
    selectedProductFilter,
    handleGetProduct,
    setSearchProductQuery,
    setSelectedProductFilter,
  };
}

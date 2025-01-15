import { useLocation } from "react-router-dom";

export function useQueryParam(key: string, reserve?: boolean): string | null {
  const { search } = useLocation();
  const value = new URLSearchParams(search).get(key);
  if (reserve) {
    return value ? value.replace(/ /g, "+") : null;
  }
  return value;
}

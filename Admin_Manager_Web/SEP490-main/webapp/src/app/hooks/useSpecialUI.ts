import { useAppSelector } from "../redux/hook";

export function useSpecialUI() {
  const state = useAppSelector((state) => state.specialUI);
  return {
    state,
  };
}

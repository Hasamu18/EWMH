import { useEffect } from "react";
import { useAppDispatch } from "../redux/hook";
import { HeaderState, setHeaderTitle } from "../redux/slice/headerSlice";

type HeaderTitle = {
  tabTitle: string;
  paths?: HeaderState["paths"];
};

export function useTitle({ tabTitle, paths }: HeaderTitle) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = tabTitle;
    dispatch(setHeaderTitle(paths));

    return () => {
      document.title = prevTitle;
    };
  }, [dispatch, paths, tabTitle]);
}

import { useCallback, useMemo } from "react";
import { useDocPageData } from "./useDocPageData";
import { useLocation, useHistory } from "@docusaurus/router";
import { docPageStore } from "../lib";

export function useUIType() {
  const { search } = useLocation();
  const history = useHistory();
  const storeUIType = useDocPageData("uiType");
  const urlUIType = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get("uiType") as "prebuilt" | "custom" | null;
  }, [search]);

  const uiType: "prebuilt" | "custom" = urlUIType || storeUIType || "prebuilt";

  const onChangeUIType = useCallback(
    (type: "prebuilt" | "custom") => {
      const searchParams = new URLSearchParams(search);
      searchParams.set("uiType", type);
      history.push({
        pathname: history.location.pathname,
        search: searchParams.toString(),
        hash: history.location.hash,
      });
      docPageStore.updateValue("uiType", type);
    },
    [urlUIType, history],
  );

  return { uiType, onChangeUIType };
}

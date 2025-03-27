import { useSelectionStore } from "./useSelectionStore";

export function useGoFrameworksSelection() {
  return useSelectionStore(GoFrameworksSelectionName, GoFrameworksDefaultValue);
}

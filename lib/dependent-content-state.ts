export interface VisibilityState {
  hidden: boolean;
  hiddenClass: boolean;
}

export interface OwnerCandidate<T> {
  owner: T;
  visible: boolean;
}

export function isVisibilityChainVisible(states: Iterable<VisibilityState>): boolean {
  return [...states].every((state) => !state.hidden && !state.hiddenClass);
}

export function firstVisibleOwner<T>(candidates: Iterable<OwnerCandidate<T>>): T | undefined {
  for (const candidate of candidates) {
    if (candidate.visible) return candidate.owner;
  }
  return undefined;
}

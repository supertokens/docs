import { DocItemContextProvider } from "../components/DocItemContext";

export default function Root({ children }: { children: React.ReactNode }) {
  return <DocItemContextProvider>{children}</DocItemContextProvider>;
}

import { DocItemContextProvider } from "../components/DocItemContext";

export default function Root({ children }: { children: React.ReactNode }) {
  console.log("Root");
  return <DocItemContextProvider>{children}</DocItemContextProvider>;
}

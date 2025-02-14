import { Separator as RadixSeparator } from "@radix-ui/themes";

type MarginProp = "1" | "2" | "3" | "5" | "6";

export function Separator({ mt = "5", mb = "3" }: { mt: MarginProp; mb: MarginProp }) {
  return <RadixSeparator size="4" mt={mt} mb={mb} />;
}

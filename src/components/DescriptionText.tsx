import { Text } from "@radix-ui/themes";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export function DescriptionText({ children }: React.PropsWithChildren<{}>) {
  const context = useDocusaurusContext();
  return (
    <Text asChild color="gray">
      {children}
    </Text>
  );
}

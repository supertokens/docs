import { Text } from "@radix-ui/themes";
// import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export function DescriptionText({ children }: React.PropsWithChildren<{}>) {
  // const context = useDocusaurusContext();
  // console.log(context);
  return (
    <Text asChild color="gray">
      {children}
    </Text>
  );
}

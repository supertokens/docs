import { Flex, Box, Card, Separator } from "@radix-ui/themes";

export function UIPreviewCard({ children }: React.PropsWithChildren<{}>) {
  return (
    <Box p="0" asChild>
      <Card>{children}</Card>
    </Box>
  );
}

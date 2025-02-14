import { Badge, HoverCard } from "@radix-ui/themes";

export function PaidFeatureBadge() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Badge size="3" variant="solid" color="orange" radius="full">
          Paid Feature
        </Badge>
      </HoverCard.Trigger>
      <HoverCard.Content>
        This is a paid feature. You can click on the **Enable Paid Features** button on [our
        dashboard](https://supertokens.com/dashboard-saas), and follow the steps from there on. Once enabled, this
        feature is free on the provided development environment.
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

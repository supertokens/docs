import React, { createContext, useCallback, useContext } from "react";
import { Card, Flex, Avatar, Grid, Box, Text } from "@radix-ui/themes";
import Link from "@docusaurus/Link";

import "./styles.scss";
import { AnalyticsEventNames, trackButtonClick } from "@site/src/lib/analytics";

function ReferenceCardRoot({ children, href, label }: React.PropsWithChildren<{ href: string; label?: string }>) {
  const hasAvatarInChildren = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      return child.type === ReferenceCardAvatar;
    }
    return false;
  });

  const onClick = useCallback(() => {
    trackButtonClick(AnalyticsEventNames.buttonReferenceCard, "v1", {
      href,
    });
  }, [href]);

  if (label) {
    return (
      <Box p="3" asChild>
        <Card className="reference-card" asChild>
          <Link href={href} onClick={onClick}>
            <Text weight="bold">{label}</Text>
          </Link>
        </Card>
      </Box>
    );
  }

  if (hasAvatarInChildren) {
    return (
      <Box p="4" asChild>
        <Card className="reference-card" asChild>
          <Link href={href} onClick={onClick}>
            <Flex gap="3" align="center">
              {children}
            </Flex>
          </Link>
        </Card>
      </Box>
    );
  }

  return (
    <Box p="5" asChild>
      <Card className="reference-card" asChild>
        <Link href={href} onClick={onClick}>
          <Flex gap="3" direction="column">
            {children}
          </Flex>
        </Link>
      </Card>
    </Box>
  );
}

function ReferenceCardAvatar({ icon }: { icon: string }) {
  return (
    <Avatar
      src={`/img/icons/${icon}.svg`}
      alt="Icon"
      size="3"
      className="reference-card__avatar"
      radius="full"
      fallback="T"
    />
  );
}

function ReferenceCardTitle({ children }: React.PropsWithChildren<{}>) {
  const asChild = typeof children === "string" ? false : true;

  return (
    <Text className="reference-card__title" size="4" weight="bold" color="orange" asChild={asChild}>
      {children}
    </Text>
  );
}

function ReferenceCardDescription({ children }: React.PropsWithChildren<{}>) {
  const asChild = typeof children === "string" ? false : true;
  return (
    <Text className="reference-card__description" size="2" color="gray" asChild={asChild}>
      {children}
    </Text>
  );
}

type ReferenceCardGridProps = {
  lg?: string;
  xs?: string;
  initial?: string;
};

function ReferenceCardGrid({
  children,
  lg = "repeat(3, 1fr)",
  xs = "repeat(2, 1fr)",
  initial = "repeat(1, 1fr)",
}: React.PropsWithChildren<ReferenceCardGridProps>) {
  return (
    <Grid
      columns={{
        initial,
        lg,
        xs,
      }}
      gap="4"
    >
      {children}
    </Grid>
  );
}

// In some cases we want to show a grid that has only two columns
// but in which children stretch over a 1/3 of the width of the grid
// It might be skill issue but I can't figure out anything other than this hacky solution.
// We use an additional empty div to ensure the width size.
// That div needs to work in responsive scenarios (dissapear when the grid changes to two columns)
function ReferenceCardGridHelper() {
  return <div className="reference-card__grid-helper" />;
}

export const ReferenceCard = Object.assign(ReferenceCardRoot, {
  Avatar: ReferenceCardAvatar,
  Title: ReferenceCardTitle,
  Description: ReferenceCardDescription,
  Grid: ReferenceCardGrid,
  GridHelper: ReferenceCardGridHelper,
});

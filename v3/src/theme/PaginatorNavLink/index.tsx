import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/PaginatorNavLink";

import { Card, Flex, Text } from "@radix-ui/themes";

export default function PaginatorNavLink(props: Props): ReactNode {
  const { permalink, title, subLabel, isNext } = props;
  return (
    <Card asChild>
      <Link className="pagination-nav__link" to={permalink}>
        <Flex direction="column" align={isNext ? "end" : "start"}>
          <Text as="div" size="2" weight="bold">
            {title}
          </Text>
          <Text as="div" size="2" color="gray">
            {subLabel}
          </Text>
        </Flex>
      </Link>
    </Card>
  );
}

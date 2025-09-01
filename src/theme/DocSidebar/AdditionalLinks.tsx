import React from "react";
import { ExternalLink, MessageSquare, BookOpen } from "lucide-react";
import { Flex, Text } from "@radix-ui/themes";
import clsx from "clsx";

import "./AdditionalLinks.scss";

interface AdditionalLinkProps {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
}

function AdditionalLink({ href, icon: Icon, label, onClick }: AdditionalLinkProps) {
  return (
    <li className="additional-sidebar-link">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="additional-sidebar-link__anchor"
        onClick={onClick}
      >
        <Flex align="center" gap="3" className="additional-sidebar-link__content">
          <Icon size={16} className="additional-sidebar-link__icon" />
          <Text size="2" className="additional-sidebar-link__text">
            {label}
          </Text>
          <ExternalLink size={12} className="additional-sidebar-link__external-icon" />
        </Flex>
      </a>
    </li>
  );
}

interface AdditionalLinksProps {
  onLinkClick?: () => void;
}

const links = [
  {
    href: "https://supertokens.com/discord",
    icon: MessageSquare,
    label: "Support",
  },
  {
    href: "https://supertokens.com/blog",
    icon: BookOpen,
    label: "Blog",
  },
];

export default function AdditionalLinks({ onLinkClick }: AdditionalLinksProps): JSX.Element {
  return (
    <div className="additional-sidebar-links">
      <ul className="additional-sidebar-links__list">
        {links.map((link) => (
          <AdditionalLink key={link.href} href={link.href} icon={link.icon} label={link.label} onClick={onLinkClick} />
        ))}
      </ul>
    </div>
  );
}

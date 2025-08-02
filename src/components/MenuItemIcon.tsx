import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  Book,
  Zap,
  HousePlus,
  ShieldUser,
  Braces,
  Key,
  LayoutDashboard,
  Shield,
  CircleUserRound,
  UserPlus,
  FileTerminal,
  FileCode,
  HardDrive,
  NotebookTabs,
  Users,
  ArrowRight,
  Settings,
  Server,
  WandSparkles,
  FileUser,
  Smartphone,
  Share2,
  Building,
  RectangleEllipsis,
  Bot,
  Fingerprint,
  ShieldCheck,
  Clock,
  UserCheck,
  Puzzle,
  Workflow,
  Monitor,
  Bug,
  Palette,
  Cpu,
  Hash,
  History,
  Play,
  MailCheck,
} from "lucide-react";

import VercelLogo from "/img/logos/vercel.svg";
import SupabaseLogo from "/img/logos/supabase.svg";
import HasuraLogo from "/img/logos/hasura.svg";
import NextjsLogo from "/img/logos/nextjs.svg";
import NestjsLogo from "/img/logos/nestjs.svg";
import NetlifyLogo from "/img/logos/netlify.svg";
import AwsLambdaLogo from "/img/logos/aws-lambda.svg";
import GraphqlLogo from "/img/logos/graphql.svg";
import CdiLogo from "/img/logos/cdi.svg";
import FdiLogo from "/img/logos/fdi.svg";

const categoryIcons = {
  // Main categories
  References: Book,
  Quickstart: Zap,
  Authentication: Key,
  "Additional Verification": Shield,
  "Post Authentication": Users,
  Migration: ArrowRight,
  "Platform Configuration": Settings,
  Deployment: Server,

  // Authentication methods
  "Email Password": RectangleEllipsis,
  Passwordless: WandSparkles,
  "Social Login": CircleUserRound,
  "Enterprise Login": Building,
  "Unified Login": Share2,
  "Machine to Machine": Bot,
  Passkeys: Fingerprint,

  // Quickstart integrations
  Integrations: Puzzle,
  // "AWS Lambda": AwsLambdaLogo,
  // NextJS: NextjsLogo,
  // GraphQL: GraphqlLogo,
  // Hasura: HasuraLogo,
  // NestJS: NestjsLogo,
  // Netlify: NetlifyLogo,
  // Supabase: SupabaseLogo,
  // Vercel: VercelLogo,

  // References and SDK sections
  "Frontend SDKs": Monitor,
  "Backend SDKs": Server,
  "User Interface": Palette,
  "Frontend Driver Interface": FileCode,
  "Core Driver Interface": FileTerminal,
  "Testing and Debugging": Bug,
  "SuperTokens Core": Cpu,

  // Authentication reference subcategories
  "Email/Password": RectangleEllipsis,
  ThirdParty: Share2,
  WebAuthn: Fingerprint,
  OAuth: Key,
  MFA: ShieldCheck,
  Session: Clock,
  TOTP: Hash,
  OTP: Smartphone,
  SAML: Building,

  // CDI/FDI
  "Email Verification": MailCheck,
  "Account Linking": FileUser,
  "Bulk Import": UserPlus,
  Core: Cpu,
  Dashboard: LayoutDashboard,
  "User Metadata": Braces,
  "User Roles": ShieldUser,
  Multitenancy: HousePlus,

  // Quickstart guides and workflows
  "Quickstart Guides": Zap,
  "Advanced Workflows": Workflow,
  "Legacy Method": History,
  "Legacy method": History,
  "Using prebuilt UI": Palette,
  "Step 1: Account Creation": UserCheck,
  "5. Checking Sessions in API Routes": Shield,
  "Checking Sessions in API Routes": Shield,

  // Main quickstart menu items
  "/docs/quickstart/backend-setup": HardDrive,
  "/docs/quickstart/frontend-setup": Monitor,
  "/docs/quickstart/introduction": Book,
  "/docs/quickstart/next-steps": NotebookTabs,
  "/docs/quickstart/example-applications": Play,
};

// Brand logo mappings for integration platforms
const brandLogos: { [key: string]: string } = {};

type MenuItemIconProps =
  | {
      label: string;
      className?: string;
    }
  | {
      href: string;
      className?: string;
    };

export function MenuItemIcon(props: MenuItemIconProps) {
  const IconComponent = "label" in props ? categoryIcons[props.label] : categoryIcons[props.href];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={props.className} size={16} />;
}

export default MenuItemIcon;

import React from "react";
import {
  Book,
  Zap,
  Key,
  Shield,
  Users,
  ArrowRight,
  Settings,
  Server,
  Mail,
  Smartphone,
  Share2,
  Building,
  Bot,
  Layers,
  Fingerprint,
  MailCheck,
  ShieldCheck,
  Clock,
  UserCheck,
  ShieldAlert,
  Timer,
  UserCog,
  Link,
  BarChart3,
  Puzzle,
  Cloud,
  Triangle,
  Database,
  Workflow,
  Globe,
  Folder,
  FileText,
  Monitor,
  Code,
  Bug,
  Wrench,
  Palette,
  FlaskConical,
  BookOpenCheck,
  Cpu,
  Hash,
  History,
  Construction,
  Play,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryIconMapping {
  [key: string]: LucideIcon;
}

const categoryIcons: CategoryIconMapping = {
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
  "Email Password": Mail,
  Passwordless: Smartphone,
  "Social Login": Share2,
  "Enterprise Login": Building,
  "Unified Login": Layers,
  "Machine to Machine": Bot,
  Passkeys: Fingerprint,

  // Quickstart integrations
  Integrations: Puzzle,
  "AWS Lambda": Cloud,
  NextJS: Triangle,
  "App Directory": Folder,
  "Pages Directory": FileText,
  GraphQL: Workflow,
  Hasura: Database,
  NestJS: Globe,
  Netlify: Globe,
  Supabase: Database,
  Vercel: Triangle,

  // References and SDK sections
  "Frontend SDKs": Monitor,
  "Backend SDKs": Server,
  "User Interface": Palette,
  "CDI Reference": Code,
  "FDI Reference": Code,
  "Testing and Debugging": Bug,
  "SuperTokens Core": Cpu,

  // Authentication reference subcategories
  "Email/Password": Mail,
  ThirdParty: Share2,
  WebAuthn: Fingerprint,
  OAuth: Key,
  MFA: ShieldCheck,
  Session: Clock,
  TOTP: Hash,
  OTP: Smartphone,
  SAML: Building,

  // Quickstart guides and workflows
  "Quickstart Guides": Zap,
  "Advanced Workflows": Workflow,
  "Legacy Method": History,
  "Legacy method": History,
  "Backend Setup": Server,
  "Using prebuilt UI": Palette,
  "Step 1: Account Creation": UserCheck,
  "5. Checking Sessions in API Routes": Shield,
  "Checking Sessions in API Routes": Shield,
};

interface CategoryIconProps {
  categoryLabel: string;
  className?: string;
}

export function CategoryIcon({ categoryLabel, className }: CategoryIconProps) {
  const IconComponent = categoryIcons[categoryLabel];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={16} />;
}

export default CategoryIcon;

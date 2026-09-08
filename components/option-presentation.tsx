import type { CSSProperties } from "react";
import { Code2Icon, LayoutTemplateIcon, MonitorIcon, SmartphoneIcon, type LucideIcon } from "lucide-react";

export interface OptionPresentation {
  icon?: LucideIcon;
  logo?: string;
  logoSize?: "wide";
}

const assetBase = "/docs-assets/";

export const optionPresentations: Record<string, OptionPresentation> = {
  prebuilt: { icon: LayoutTemplateIcon },
  custom: { icon: Code2Icon },
  web: { icon: MonitorIcon },
  mobile: { icon: SmartphoneIcon },
  reactjs: { logo: "img/logos/react.svg" },
  angular: { logo: "img/logos/angular.svg" },
  vue: { logo: "img/logos/vue.svg" },
  reactnative: { logo: "img/icons/react.svg" },
  android: { logo: "img/logos/android.svg" },
  ios: { logo: "img/logos/ios.svg" },
  flutter: { logo: "img/icons/flutter.svg" },
  nodejs: { logo: "img/logos/nodejs-monogram.svg" },
  go: { logo: "img/logos/go-wordmark.svg", logoSize: "wide" },
  python: { logo: "img/logos/python.svg" },
  nestjs: { logo: "img/logos/nestjs.svg" },
  "aws-lambda": { logo: "img/logos/aws-lambda.svg" },
  fastify: { logo: "img/logos/fastify.svg" },
  serverless: { logo: "img/logos/serverless.svg" },
  fastapi: { logo: "img/logos/fastapi.svg" },
  django: { logo: "img/logos/django.svg" },
  express: { logo: "img/logos/express.svg" },
  nextjs: { logo: "img/logos/nextjs-wordmark.svg", logoSize: "wide" },
  koa: { logo: "img/logos/koa.svg" },
  loopback: { logo: "img/logos/loopback.svg" },
  flask: { logo: "img/logos/flask.svg" },
  php: { logo: "img/logos/php.svg" },
  dashboard: { icon: MonitorIcon },
};

export function OptionMark({ value }: { value?: string }) {
  const presentation = value ? optionPresentations[value] : undefined;
  const Icon = presentation?.icon;
  const logoStyle = presentation?.logo
    ? ({ "--preferences-option-logo": `url("${assetBase}${presentation.logo}")` } as CSSProperties)
    : undefined;
  if (!Icon && !presentation?.logo) return null;

  return (
    <span className="preferences-option-mark" aria-hidden="true" data-option-icon>
      {Icon ? (
        <Icon />
      ) : (
        <span className="preferences-option-logo" data-option-logo-size={presentation?.logoSize} style={logoStyle} />
      )}
    </span>
  );
}

export function PresentedOption({ label, value }: { label: string; value: string }) {
  return (
    <span className="st-presented-option">
      <OptionMark value={value} />
      <span className="st-presented-option-label">{label}</span>
    </span>
  );
}

export const tabGroups = {
  "backend-language": {
    control: "select",
    defaultValue: "nodejs",
    options: {
      "Node.js": "nodejs",
      Go: "go",
      Python: "python",
      cURL: "curl",
      Dashboard: "dashboard",
      Java: "java",
      "C#": "csharp",
      PHP: "php",
    },
  },
  "frontend-prebuilt-ui": {
    control: "select",
    defaultValue: "reactjs",
    options: {
      Reactjs: "reactjs",
      ReactJS: "reactjs",
      React: "reactjs",
      Angular: "angular",
      Vue: "vue",
    },
  },
  "frontend-custom-ui": {
    control: "select",
    defaultValue: "web",
    options: {
      Web: "web",
      Mobile: "mobile",
    },
  },
  "mobile-frameworks": {
    control: "select",
    defaultValue: "reactnative",
    options: {
      ReactNative: "reactnative",
      "React Native": "reactnative",
      Android: "android",
      iOS: "ios",
      Flutter: "flutter",
    },
  },
  "frontend-platforms": {
    control: "select",
    defaultValue: "reactjs",
    options: {
      React: "reactjs",
      Webjs: "webjs",
      Android: "android",
      iOS: "ios",
      Flutter: "flutter",
      ReactNative: "reactnative",
      "React Native": "reactnative",
    },
  },
  "node-frameworks": {
    control: "select",
    defaultValue: "express",
    options: {
      Express: "express",
      Hapi: "hapi",
      Fastify: "fastify",
      Koa: "koa",
      LoopBack: "loopback",
      Serverless: "serverless",
      "Aws Lambda": "aws-lambda",
      "AWS Lambda": "aws-lambda",
      "Next.js": "nextjs",
      Nestjs: "nestjs",
      NestJS: "nestjs",
    },
  },
  "go-frameworks": {
    control: "select",
    defaultValue: "http",
    options: {
      HTTP: "http",
      Http: "http",
      Gin: "gin",
      Chi: "chi",
      Mux: "mux",
    },
  },
  "python-frameworks": {
    control: "select",
    defaultValue: "fastapi",
    options: {
      FastAPI: "fastapi",
      Flask: "flask",
      Django: "django",
    },
  },
  "package-managers": {
    control: "select",
    defaultValue: "npm",
    options: {
      npm: "npm",
      Yarn: "yarn",
      yarn: "yarn",
      pnpm: "pnpm",
      Bun: "bun",
    },
  },
  "install-method": {
    control: "select",
    defaultValue: "npm",
    options: {
      npm: "npm",
      "Script tag": "script-tag",
    },
  },
  "react-router": {
    control: "select",
    defaultValue: "yes",
    options: {
      "With React Router": "yes",
      "Without React Router": "no",
    },
  },
  "uses-try-supertokens": {
    control: "select",
    defaultValue: "yes",
    options: { Yes: "yes", No: "no" },
  },
  "python-io-style": {
    control: "select",
    defaultValue: "asyncio",
    options: { Asyncio: "asyncio", Syncio: "syncio" },
  },
  "python-package-manager": {
    control: "select",
    defaultValue: "pip",
    options: { Pip: "pip", Uv: "uv" },
  },
  version: {
    control: "select",
    defaultValue: "v6",
    options: { V6: "v6", V5: "v5" },
  },
  docker: {
    control: "select",
    defaultValue: "with-docker",
    options: { "With Docker": "with-docker", "Without Docker": "without-docker" },
  },
  comparison: {
    control: "select",
    defaultValue: "greater",
    options: { Greater: "greater", Lesser: "lesser" },
  },
  database: {
    control: "select",
    defaultValue: "mysql",
    options: { Mysql: "mysql", Postgresql: "postgresql" },
  },
  "operating-system": {
    control: "select",
    defaultValue: "linux",
    options: { Linux: "linux", Mac: "mac", Windows: "windows" },
  },
  "import-column-order": {
    control: "select",
    defaultValue: "without-order",
    options: {
      "Without specifying column order": "without-order",
      "With specifying column order": "with-order",
    },
  },
  "core-deployment": {
    control: "select",
    defaultValue: "with-docker",
    options: { "With Docker": "with-docker", "Without Docker": "without-docker", "With Saas": "saas" },
  },
  "core-hosting": {
    control: "select",
    defaultValue: "managed",
    options: {
      "Managed service": "managed",
      "Self-hosted with Docker": "self-hosted-docker",
      "Self-hosted without Docker": "self-hosted-binary",
    },
  },
  "password-hashing-algorithm": {
    control: "select",
    defaultValue: "argon2",
    options: { Argon2: "argon2", Bcrypt: "bcrypt" },
  },
  "package-manager-scripts": {
    control: "select",
    defaultValue: "npm",
    options: {
      "npm run": "npm",
      "yarn run": "yarn",
      "pnpm run": "pnpm",
    },
  },
} as const;

export type TabGroup = keyof typeof tabGroups;

export const tabGroupNames = Object.keys(tabGroups) as TabGroup[];

export function tabValue(group: TabGroup, title: string): string | undefined {
  return (tabGroups[group].options as Record<string, string>)[title];
}

export function inferTabGroup(titles: string[]): TabGroup | undefined {
  if (titles.length < 2) return undefined;

  return tabGroupNames.find(
    (group) =>
      group !== "react-router" && group !== "uses-try-supertokens" && titles.every((title) => tabValue(group, title)),
  );
}

export function tabGroupDefault(group: TabGroup): string {
  return tabGroups[group].defaultValue;
}

export function tabGroupControl(group: TabGroup): "tabs" | "select" {
  return tabGroups[group].control;
}

export function tabGroupLabel(group: TabGroup): string {
  const labels: Partial<Record<TabGroup, string>> = {
    "backend-language": "Language",
    "frontend-prebuilt-ui": "Frontend framework",
    "frontend-custom-ui": "Platform",
    "frontend-platforms": "Platform",
    "mobile-frameworks": "Mobile framework",
    "node-frameworks": "Node.js framework",
    "go-frameworks": "Go framework",
    "python-frameworks": "Python framework",
    "package-managers": "Package manager",
    "package-manager-scripts": "Package manager",
    "install-method": "Installation method",
    "react-router": "Do you use react-router-dom?",
    "uses-try-supertokens": "Do you need to configure a SuperTokens Core?",
    "python-io-style": "I/O style",
    "python-package-manager": "Package manager",
    version: "Version",
    docker: "Deployment method",
    comparison: "Comparison",
    database: "Database",
    "operating-system": "Operating system",
    "import-column-order": "Import method",
    "core-deployment": "Deployment method",
    "core-hosting": "Hosting method",
    "password-hashing-algorithm": "Password hashing algorithm",
  };
  return labels[group] || "Example";
}

export type FrameworkTabGroup = "node-frameworks" | "go-frameworks" | "python-frameworks";

export function languageFrameworkGroup(language: string): FrameworkTabGroup | undefined {
  const groups: Partial<Record<string, FrameworkTabGroup>> = {
    nodejs: "node-frameworks",
    go: "go-frameworks",
    python: "python-frameworks",
  };
  return groups[language];
}

export function frameworkTabGroup(framework: string): FrameworkTabGroup | undefined {
  const groups: FrameworkTabGroup[] = ["node-frameworks", "go-frameworks", "python-frameworks"];
  return groups.find((group) => Object.values(tabGroups[group].options as Record<string, string>).includes(framework));
}

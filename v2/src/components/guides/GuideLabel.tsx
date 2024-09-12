import React, { useContext, useMemo } from "react";
import {
  GuideAuthMethodChoice,
  GuideBackendChoice,
  GuideFrontendChoice,
  GuidePageContext,
} from "./GuidePageContext";

export function GuideLabel({ name }: { name: keyof LabelsReord }) {
  const { guide } = useContext(GuidePageContext);

  const labelsRecord = useMemo<LabelsReord>(() => {
    const frontendLabels = FrontendLabels[guide.frontend];
    let backendLabels = BackendLabels[guide.backend] as BackendLabelValue;
    // @ts-expect-error
    if (guide.backendFramework && backendLabels[guide.backendFramework]) {
      // @ts-expect-error
      backendLabels = backendLabels[
        guide.backendFramework
      ] as BackendLabelValue;
    }
    const recipeLabels = RecipeLabels[guide.authMethod];
    return {
      frontendTitle: frontendLabels.title,
      backendTitle: backendLabels.title,
      frontendExampleAppInstallArgument:
        frontendLabels.exampleAppInstallArgument || "",
      backendExampleAppInstallArgument:
        backendLabels.exampleAppInstallArgument || "",
      recipeExampleAppInstallArgument:
        recipeLabels.exampleAppInstallArgument || "",
    };
  }, [guide]);

  return labelsRecord[name];
}

type LabelsReord = {
  frontendTitle: string;
  backendTitle: string;
  frontendExampleAppInstallArgument: string;
  backendExampleAppInstallArgument: string;
  recipeExampleAppInstallArgument: string;
};

const FrontendLabels: Record<
  GuideFrontendChoice,
  { title: string; exampleAppInstallArgument?: string }
> = {
  react: {
    title: "React",
    exampleAppInstallArgument: "react",
  },
  vue: {
    title: "Vue",
    exampleAppInstallArgument: "vue",
  },
  angular: {
    title: "Angular",
    exampleAppInstallArgument: "angular",
  },
  nextjs: {
    title: "Next.js",
    exampleAppInstallArgument: "next",
  },
  vanillajs: {
    title: "Vanilla JS",
  },
  "react-native": {
    title: "React Native",
  },
  ios: {
    title: "iOS",
  },
  android: {
    title: "Android",
  },
  flutter: {
    title: "Flutter",
  },
};

const BackendLabels: Record<
  GuideBackendChoice,
  BackendLabelValue | Record<string, BackendLabelValue>
> = {
  nodejs: {
    express: {
      title: "Node.js/Express",
      exampleAppInstallArgument: "node",
    },
    nestjs: {
      title: "Node.js/NestJS",
      exampleAppInstallArgument: "nest",
    },
    other: {
      title: "Node.js",
      exampleAppInstallArgument: "node",
    },
  },
  python: {
    flask: {
      title: "Python/Flask",
      exampleAppInstallArgument: "python-flask",
    },
    fastapi: {
      title: "Python/FastAPI",
      exampleAppInstallArgument: "python-fastapi",
    },
    django: {
      title: "Python/Django",
      exampleAppInstallArgument: "python-drf",
    },
  },
  golang: {
    http: {
      title: "Go",
      exampleAppInstallArgument: "go",
    },
  },
  nextjs: {
    title: "Next.js",
    exampleAppInstallArgument: "next",
  },
  php: {
    title: "PHP",
  },
  csharp: {
    title: "C#",
  },
  java: {
    title: "Java",
  },
};

const RecipeLabels: Record<
  GuideAuthMethodChoice,
  { exampleAppInstallArgument?: string }
> = {
  "all-auth": { exampleAppInstallArgument: "all_auth" },
  "multi-tenant": { exampleAppInstallArgument: "multitenancy" },
  mfa: { exampleAppInstallArgument: "multifactorauth" },
  emailpassword: { exampleAppInstallArgument: "emailpassword" },
  thirdparty: { exampleAppInstallArgument: "thirdparty" },
  passwordless: { exampleAppInstallArgument: "passwordless" },
  thirdpartyemailpassword: {
    exampleAppInstallArgument: "thirdpartyemailpassword",
  },
  thirdpartypasswordless: {
    exampleAppInstallArgument: "thirdpartypasswordless",
  },
};

type BackendLabelValue = { title: string; exampleAppInstallArgument?: string };

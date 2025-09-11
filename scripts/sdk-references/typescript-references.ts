import { Application } from "typedoc";
import "typedoc-plugin-markdown";

import { $ } from "bun";
import { rm, writeFile, mkdir, exists } from "node:fs/promises";
import { join } from "node:path";

export type Repository = {
  url: string;
  version: string;
  files: {
    path: string;
    title: string;
    sidebarPosition: number;
    packageName: string;
    generatedFilePath: string;
  }[];
  outputDir: string;
  name: string;
  language: "typescript";
  categoryJSON: { label: string; position: number };
};

async function generateMarkdownFiles(files: Repository["files"], outDir: string) {
  const app = await Application.bootstrapWithPlugins({
    entryPoints: files.map((file) => file.path),
    // entryPointStrategy: "expand",
    out: outDir,
    plugin: [
      "typedoc-plugin-markdown",
      "typedoc-plugin-frontmatter",
      // "./scripts/sdk-references/typedoc-frontmatter-plugin.mjs",
      // "./scripts/sdk-references/typedoc-page-title-plugin.mjs",
      // "./scripts/sdk-references/typedoc-routing-plugin.mjs",
      // "typedoc-plugin-mdn-links",
      // "typedoc-plugin-rename-defaults",
      // "typedoc-plugin-missing-exports",
      // "typedoc-plugin-zod",
      // "typedoc-plugin-inline-sources",
      // "typedoc-plugin-extras",
    ],
    skipErrorChecking: true,
    useCodeBlocks: true,
    router: "structure",
    hidePageHeader: true,
    hideBreadcrumbs: true,
    hidePageTitle: true,
    excludeExternals: true,
    searchInComments: true,
    expandObjects: true,
    expandParameters: true,
    commentStyle: "all",
    fileExtension: ".mdx",
    parametersFormat: "table",
    interfacePropertiesFormat: "table",
    tsconfig: "tsconfig.json",
    classPropertiesFormat: "table",
    typeAliasPropertiesFormat: "table",
    enumMembersFormat: "table",
    propertyMembersFormat: "table",
    typeDeclarationFormat: "table",
    frontmatterGlobals: {
      repositoryFiles: files,
    },
  } as any);
  const project = await app.convert();
  if (!project) {
    throw new Error("Failed to convert TypeScript project");
  }
  app.validate(project);
  await app.generateOutputs(project);
}

const repositories: Repository[] = [
  {
    url: "https://github.com/supertokens/supertokens-plugins",
    outputDir: "./docs/references/plugins/user-banning/react",
    version: "main",
    files: [
      {
        path: "./packages/user-banning-react/src/index.ts",
        title: "User Banning React",
        sidebarPosition: 1,
        packageName: "@supertokens-plugins/user-banning-react",
        generatedFilePath: "index.mdx",
      },
    ],
    name: "@supertokens-plugins/user-banning-react",
    language: "typescript",
    categoryJSON: {
      label: "User Banning React",
      position: 3,
    },
  },
  {
    url: "https://github.com/supertokens/supertokens-plugins",
    outputDir: "./docs/references/plugins/user-banning/nodejs",
    version: "main",
    files: [
      {
        path: "./packages/user-banning-nodejs/src/index.ts",
        title: "User Banning NodeJS",
        sidebarPosition: 1,
        packageName: "@supertokens-plugins/user-banning-nodejs",
        generatedFilePath: "index.mdx",
      },
    ],
    name: "@supertokens-plugins/user-banning-nodejs",
    language: "typescript",
    categoryJSON: {
      label: "User Banning NodeJS",
      position: 3,
    },
  },
  // {
  //   url: "https://github.com/supertokens/supertokens-auth-react",
  //   outputDir: "./docs/references/frontend-sdks/supertokens-auth-react",
  //   version: "0.50.0",
  //   files: [
  //     {
  //       path: "./lib/ts/index.ts",
  //       title: "SuperTokens React",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-auth-react",
  //       generatedFilePath: "index.mdx",
  //     },
  //     {
  //       path: "./lib/ts/types.ts",
  //       title: "SuperTokens React Types",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-auth-react/types",
  //       generatedFilePath: "types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/index.ts",
  //       title: "EmailPassword",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-auth-react/recipe/emailpassword",
  //       generatedFilePath: "recipe.emailpassword.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/types.ts",
  //       title: "EmailPassword Types",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-auth-react/recipe/emailpassword/types",
  //       generatedFilePath: "recipe.emailpassword.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/index.ts",
  //       title: "EmailVerification",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-auth-react/recipe/emailverification",
  //       generatedFilePath: "recipe.emailverification.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/types.ts",
  //       title: "EmailVerification Types",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-auth-react/recipe/emailverification/types",
  //       generatedFilePath: "recipe.emailverification.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/index.ts",
  //       title: "MFA",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-auth-react/recipe/multifactorauth",
  //       generatedFilePath: "recipe.multifactorauth.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/types.ts",
  //       title: "MFA Types",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-auth-react/recipe/multifactorauth/types",
  //       generatedFilePath: "recipe.multifactorauth.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/index.ts",
  //       title: "MultiTenancy",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-auth-react/recipe/multitenancy",
  //       generatedFilePath: "recipe.multitenancy.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/types.ts",
  //       title: "MultiTenancy Types",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-auth-react/recipe/multitenancy/types",
  //       generatedFilePath: "recipe.multitenancy.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/index.ts",
  //       title: "OAuth Provider",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-auth-react/recipe/oauth2provider",
  //       generatedFilePath: "recipe.oauth2provider.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/types.ts",
  //       title: "OAuth Provider Types",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-auth-react/recipe/oauth2provider/types",
  //       generatedFilePath: "recipe.oauth2provider.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/index.ts",
  //       title: "Passwordless",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-auth-react/recipe/passwordless",
  //       generatedFilePath: "recipe.passwordless.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/types.ts",
  //       title: "Passwordless Types",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-auth-react/recipe/passwordless/types",
  //       generatedFilePath: "recipe.passwordless.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/session/index.ts",
  //       title: "Session",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-auth-react/recipe/session",
  //       generatedFilePath: "recipe.session.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/session/types.ts",
  //       title: "Session Types",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-auth-react/recipe/session/types",
  //       generatedFilePath: "recipe.session.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/index.ts",
  //       title: "ThirdParty",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-auth-react/recipe/thirdparty",
  //       generatedFilePath: "recipe.thirdparty.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/types.ts",
  //       title: "ThirdParty Types",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-auth-react/recipe/thirdparty/types",
  //       generatedFilePath: "recipe.thirdparty.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/index.ts",
  //       title: "TOTP",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-auth-react/recipe/totp",
  //       generatedFilePath: "recipe.totp.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/types.ts",
  //       title: "TOTP Types",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-auth-react/recipe/totp/types",
  //       generatedFilePath: "recipe.totp.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/index.ts",
  //       title: "UserRoles",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-auth-react/recipe/userroles",
  //       generatedFilePath: "recipe.userroles.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/types.ts",
  //       title: "UserRoles Types",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-auth-react/recipe/userroles/types",
  //       generatedFilePath: "recipe.userroles.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/index.ts",
  //       title: "WebAuthn",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-auth-react/recipe/webauthn",
  //       generatedFilePath: "recipe.webauthn.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/types.ts",
  //       title: "WebAuthn Types",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-auth-react/recipe/webauthn/types",
  //       generatedFilePath: "recipe.webauthn.types.mdx",
  //     },
  //   ],
  //   name: "supertokens-auth-react",
  //   language: "typescript",
  //   categoryJSON: {
  //     label: "React SDK Reference",
  //     position: 3,
  //   },
  // },
  //
  // {
  //   url: "https://github.com/supertokens/supertokens-auth-react",
  //   outputDir: "./docs/references/frontend-sdks/supertokens-auth-react",
  //   version: "0.50.0",
  //   files: [
  //     {
  //       path: "./lib/ts/index.ts",
  //       title: "SuperTokens React",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-auth-react",
  //       generatedFilePath: "index.mdx",
  //     },
  //     {
  //       path: "./lib/ts/types.ts",
  //       title: "SuperTokens React Types",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-auth-react/types",
  //       generatedFilePath: "types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/index.ts",
  //       title: "EmailPassword",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-auth-react/recipe/emailpassword",
  //       generatedFilePath: "recipe.emailpassword.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/types.ts",
  //       title: "EmailPassword Types",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-auth-react/recipe/emailpassword/types",
  //       generatedFilePath: "recipe.emailpassword.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/index.ts",
  //       title: "EmailVerification",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-auth-react/recipe/emailverification",
  //       generatedFilePath: "recipe.emailverification.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/types.ts",
  //       title: "EmailVerification Types",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-auth-react/recipe/emailverification/types",
  //       generatedFilePath: "recipe.emailverification.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/index.ts",
  //       title: "MFA",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-auth-react/recipe/multifactorauth",
  //       generatedFilePath: "recipe.multifactorauth.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/types.ts",
  //       title: "MFA Types",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-auth-react/recipe/multifactorauth/types",
  //       generatedFilePath: "recipe.multifactorauth.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/index.ts",
  //       title: "MultiTenancy",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-auth-react/recipe/multitenancy",
  //       generatedFilePath: "recipe.multitenancy.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/types.ts",
  //       title: "MultiTenancy Types",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-auth-react/recipe/multitenancy/types",
  //       generatedFilePath: "recipe.multitenancy.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/index.ts",
  //       title: "OAuth Provider",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-auth-react/recipe/oauth2provider",
  //       generatedFilePath: "recipe.oauth2provider.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/types.ts",
  //       title: "OAuth Provider Types",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-auth-react/recipe/oauth2provider/types",
  //       generatedFilePath: "recipe.oauth2provider.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/index.ts",
  //       title: "Passwordless",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-auth-react/recipe/passwordless",
  //       generatedFilePath: "recipe.passwordless.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/types.ts",
  //       title: "Passwordless Types",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-auth-react/recipe/passwordless/types",
  //       generatedFilePath: "recipe.passwordless.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/session/index.ts",
  //       title: "Session",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-auth-react/recipe/session",
  //       generatedFilePath: "recipe.session.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/session/types.ts",
  //       title: "Session Types",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-auth-react/recipe/session/types",
  //       generatedFilePath: "recipe.session.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/index.ts",
  //       title: "ThirdParty",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-auth-react/recipe/thirdparty",
  //       generatedFilePath: "recipe.thirdparty.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/types.ts",
  //       title: "ThirdParty Types",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-auth-react/recipe/thirdparty/types",
  //       generatedFilePath: "recipe.thirdparty.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/index.ts",
  //       title: "TOTP",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-auth-react/recipe/totp",
  //       generatedFilePath: "recipe.totp.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/types.ts",
  //       title: "TOTP Types",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-auth-react/recipe/totp/types",
  //       generatedFilePath: "recipe.totp.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/index.ts",
  //       title: "UserRoles",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-auth-react/recipe/userroles",
  //       generatedFilePath: "recipe.userroles.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/types.ts",
  //       title: "UserRoles Types",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-auth-react/recipe/userroles/types",
  //       generatedFilePath: "recipe.userroles.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/index.ts",
  //       title: "WebAuthn",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-auth-react/recipe/webauthn",
  //       generatedFilePath: "recipe.webauthn.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/types.ts",
  //       title: "WebAuthn Types",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-auth-react/recipe/webauthn/types",
  //       generatedFilePath: "recipe.webauthn.types.mdx",
  //     },
  //   ],
  //   name: "supertokens-auth-react",
  //   language: "typescript",
  //   categoryJSON: {
  //     label: "React SDK Reference",
  //     position: 3,
  //   },
  // },
  // {
  //   url: "https://github.com/supertokens/supertokens-web-js",
  //   outputDir: "./docs/references/frontend-sdks/supertokens-web-js",
  //   version: "0.16.0",
  //   files: [
  //     {
  //       path: "./lib/ts/index.ts",
  //       title: "SuperTokens Web JS",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-web-js",
  //       generatedFilePath: "index.mdx",
  //     },
  //     {
  //       path: "./lib/ts/types.ts",
  //       title: "SuperTokens Web JS Types",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-web-js/types",
  //       generatedFilePath: "types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/index.ts",
  //       title: "EmailPassword",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-web-js/recipe/emailpassword",
  //       generatedFilePath: "recipe.emailpassword.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/types.ts",
  //       title: "EmailPassword Types",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-web-js/recipe/emailpassword/types",
  //       generatedFilePath: "recipe.emailpassword.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/index.ts",
  //       title: "EmailVerification",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-web-js/recipe/emailverification",
  //       generatedFilePath: "recipe.emailverification.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/types.ts",
  //       title: "EmailVerification Types",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-web-js/recipe/emailverification/types",
  //       generatedFilePath: "recipe.emailverification.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/index.ts",
  //       title: "MFA",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-web-js/recipe/multifactorauth",
  //       generatedFilePath: "recipe.multifactorauth.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/types.ts",
  //       title: "MFA Types",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-web-js/recipe/multifactorauth/types",
  //       generatedFilePath: "recipe.multifactorauth.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/index.ts",
  //       title: "MultiTenancy",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-web-js/recipe/multitenancy",
  //       generatedFilePath: "recipe.multitenancy.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/types.ts",
  //       title: "MultiTenancy Types",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-web-js/recipe/multitenancy/types",
  //       generatedFilePath: "recipe.multitenancy.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/index.ts",
  //       title: "OAuth Provider",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-web-js/recipe/oauth2provider",
  //       generatedFilePath: "recipe.oauth2provider.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/types.ts",
  //       title: "OAuth Provider Types",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-web-js/recipe/oauth2provider/types",
  //       generatedFilePath: "recipe.oauth2provider.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/index.ts",
  //       title: "Passwordless",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-web-js/recipe/passwordless",
  //       generatedFilePath: "recipe.passwordless.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/types.ts",
  //       title: "Passwordless Types",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-web-js/recipe/passwordless/types",
  //       generatedFilePath: "recipe.passwordless.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/session/index.ts",
  //       title: "Session",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-web-js/recipe/session",
  //       generatedFilePath: "recipe.session.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/session/types.ts",
  //       title: "Session Types",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-web-js/recipe/session/types",
  //       generatedFilePath: "recipe.session.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/index.ts",
  //       title: "ThirdParty",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-web-js/recipe/thirdparty",
  //       generatedFilePath: "recipe.thirdparty.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/types.ts",
  //       title: "ThirdParty Types",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-web-js/recipe/thirdparty/types",
  //       generatedFilePath: "recipe.thirdparty.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/index.ts",
  //       title: "TOTP",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-web-js/recipe/totp",
  //       generatedFilePath: "recipe.totp.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/types.ts",
  //       title: "TOTP Types",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-web-js/recipe/totp/types",
  //       generatedFilePath: "recipe.totp.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/index.ts",
  //       title: "UserRoles",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-web-js/recipe/userroles",
  //       generatedFilePath: "recipe.userroles.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/types.ts",
  //       title: "UserRoles Types",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-web-js/recipe/userroles/types",
  //       generatedFilePath: "recipe.userroles.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/index.ts",
  //       title: "WebAuthn",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-web-js/recipe/webauthn",
  //       generatedFilePath: "recipe.webauthn.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/types.ts",
  //       title: "WebAuthn Types",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-web-js/recipe/webauthn/types",
  //       generatedFilePath: "recipe.webauthn.types.mdx",
  //     },
  //   ],
  //   name: "supertokens-web-js",
  //   language: "typescript",
  //   categoryJSON: {
  //     label: "Javascript SDK Reference",
  //     position: 4,
  //   },
  // },
  // {
  //   url: "https://github.com/supertokens/supertokens-node",
  //   version: "23.0.0",
  //   outputDir: "./docs/references/backend-sdks/supertokens-nodejs",
  //   files: [
  //     {
  //       path: "./lib/ts/index.ts",
  //       title: "SuperTokens Node",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-node",
  //       generatedFilePath: "index.mdx",
  //     },
  //     {
  //       path: "./lib/ts/types.ts",
  //       title: "SuperTokens Node Types",
  //       sidebarPosition: 1,
  //       packageName: "supertokens-node/types",
  //       generatedFilePath: "types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/index.ts",
  //       title: "EmailPassword",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-node/recipe/emailpassword",
  //       generatedFilePath: "recipe.emailpassword.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailpassword/types.ts",
  //       title: "EmailPassword Types",
  //       sidebarPosition: 2,
  //       packageName: "supertokens-node/recipe/emailpassword/types",
  //       generatedFilePath: "recipe.emailpassword.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/index.ts",
  //       title: "Passwordless",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-node/recipe/passwordless",
  //       generatedFilePath: "recipe.passwordless.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/passwordless/types.ts",
  //       title: "Passwordless Types",
  //       sidebarPosition: 3,
  //       packageName: "supertokens-node/recipe/passwordless/types",
  //       generatedFilePath: "recipe.passwordless.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/index.ts",
  //       title: "ThirdParty",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-node/recipe/thirdparty",
  //       generatedFilePath: "recipe.thirdparty.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/thirdparty/types.ts",
  //       title: "ThirdParty Types",
  //       sidebarPosition: 4,
  //       packageName: "supertokens-node/recipe/thirdparty/types",
  //       generatedFilePath: "recipe.thirdparty.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/index.ts",
  //       title: "WebAuthn",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-node/recipe/webauthn",
  //       generatedFilePath: "recipe.webauthn.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/webauthn/types.ts",
  //       title: "WebAuthn Types",
  //       sidebarPosition: 5,
  //       packageName: "supertokens-node/recipe/webauthn/types",
  //       generatedFilePath: "recipe.webauthn.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/index.ts",
  //       title: "EmailVerification",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-node/recipe/emailverification",
  //       generatedFilePath: "recipe.emailverification.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/emailverification/types.ts",
  //       title: "EmailVerification Types",
  //       sidebarPosition: 6,
  //       packageName: "supertokens-node/recipe/emailverification/types",
  //       generatedFilePath: "recipe.emailverification.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/index.ts",
  //       title: "MFA",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-node/recipe/multifactorauth",
  //       generatedFilePath: "recipe.multifactorauth.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multifactorauth/types.ts",
  //       title: "MFA Types",
  //       sidebarPosition: 7,
  //       packageName: "supertokens-node/recipe/multifactorauth/types",
  //       generatedFilePath: "recipe.multifactorauth.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/accountlinking/index.ts",
  //       title: "Account Linking",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-node/recipe/accountlinking",
  //       generatedFilePath: "recipe.accountlinking.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/accountlinking/types.ts",
  //       title: "Account Linking Types",
  //       sidebarPosition: 8,
  //       packageName: "supertokens-node/recipe/accountlinking/types",
  //       generatedFilePath: "recipe.accountlinking.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/jwt/index.ts",
  //       title: "JWT",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-node/recipe/jwt",
  //       generatedFilePath: "recipe.jwt.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/jwt/types.ts",
  //       title: "JWT Types",
  //       sidebarPosition: 9,
  //       packageName: "supertokens-node/recipe/jwt/types",
  //       generatedFilePath: "recipe.jwt.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/index.ts",
  //       title: "MultiTenancy",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-node/recipe/multitenancy",
  //       generatedFilePath: "recipe.multitenancy.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/multitenancy/types.ts",
  //       title: "MultiTenancy Types",
  //       sidebarPosition: 10,
  //       packageName: "supertokens-node/recipe/multitenancy/types",
  //       generatedFilePath: "recipe.multitenancy.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/dashboard/index.ts",
  //       title: "Dashboard",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-node/recipe/dashboard",
  //       generatedFilePath: "recipe.dashboard.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/dashboard/types.ts",
  //       title: "Dashboard Types",
  //       sidebarPosition: 11,
  //       packageName: "supertokens-node/recipe/dashboard/types",
  //       generatedFilePath: "recipe.dashboard.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/index.ts",
  //       title: "OAuth Provider",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-node/recipe/oauth2provider",
  //       generatedFilePath: "recipe.oauth2provider.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/oauth2provider/types.ts",
  //       title: "OAuth Provider Types",
  //       sidebarPosition: 12,
  //       packageName: "supertokens-node/recipe/oauth2provider/types",
  //       generatedFilePath: "recipe.oauth2provider.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/openid/index.ts",
  //       title: "OpenID",
  //       sidebarPosition: 13,
  //       packageName: "supertokens-node/recipe/openid",
  //       generatedFilePath: "recipe.openid.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/openid/types.ts",
  //       title: "OpenID Types",
  //       sidebarPosition: 13,
  //       packageName: "supertokens-node/recipe/openid/types",
  //       generatedFilePath: "recipe.openid.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/index.ts",
  //       title: "UserRoles",
  //       sidebarPosition: 14,
  //       packageName: "supertokens-node/recipe/userroles",
  //       generatedFilePath: "recipe.userroles.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/userroles/types.ts",
  //       title: "UserRoles Types",
  //       sidebarPosition: 14,
  //       packageName: "supertokens-node/recipe/userroles/types",
  //       generatedFilePath: "recipe.userroles.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/usermetadata/index.ts",
  //       title: "UserMetadata",
  //       sidebarPosition: 15,
  //       packageName: "supertokens-node/recipe/usermetadata",
  //       generatedFilePath: "recipe.usermetadata.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/usermetadata/types.ts",
  //       title: "UserMetadata Types",
  //       sidebarPosition: 15,
  //       packageName: "supertokens-node/recipe/usermetadata/types",
  //       generatedFilePath: "recipe.usermetadata.types.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/index.ts",
  //       title: "TOTP",
  //       sidebarPosition: 16,
  //       packageName: "supertokens-node/recipe/totp",
  //       generatedFilePath: "recipe.totp.mdx",
  //     },
  //     {
  //       path: "./lib/ts/recipe/totp/types.ts",
  //       title: "TOTP Types",
  //       sidebarPosition: 16,
  //       packageName: "supertokens-node/recipe/totp/types",
  //       generatedFilePath: "recipe.totp.types.mdx",
  //     },
  //   ],
  //   name: "supertokens-node",
  //   language: "typescript",
  //   categoryJSON: {
  //     label: "Node.js SDK Reference",
  //     position: 7,
  //   },
  // },
];

async function cloneRepository(repository: Repository, branch: string): Promise<void> {
  const repositoryDirectoryPath = `./tmp/${repository.name}`;
  const repositoryDirectoryExists = await exists(repositoryDirectoryPath);
  if (repositoryDirectoryExists) {
    return;
  }
  console.log(`Cloning ${repository.url}`);
  await $`git clone ${repository.url} -b ${branch} ${repository.name} --depth 1`.cwd("./tmp");
}

(async () => {
  const tmpDirPath = "./tmp";
  const tmpDirExists = await exists(tmpDirPath);
  if (!tmpDirExists) {
    mkdir(tmpDirPath);
  }

  for (const repository of repositories) {
    const localDirectoryPath = join(tmpDirPath, repository.name);
    if (await exists(localDirectoryPath)) {
      await rm(localDirectoryPath, { recursive: true });
    }
    await cloneRepository(repository, `${repository.version}`);

    await generateMarkdownFiles(
      repository.files.map((file) => ({
        ...file,
        path: join(localDirectoryPath, file.path),
      })),
      repository.outputDir,
    );

    await writeFile(join(repository.outputDir, "_category_.json"), JSON.stringify(repository.categoryJSON));
  }
})();

import { promises as fs } from "node:fs";
import path from "node:path";

const docsRoot = path.resolve(import.meta.dirname, "../../docs");

const replacements = [
  {
    from: "https://supertokens.com/docs/session/appinfo",
    to: "https://supertokens.com/docs/references/backend-sdks/reference#sdk-configuration",
    expected: 18,
  },
  {
    from: "https://supertokens.com/docs/thirdpartyemailpassword/appinfo",
    to: "https://supertokens.com/docs/references/backend-sdks/reference#sdk-configuration",
    expected: 6,
  },
  {
    from: "https://supertokens.com/docs/guides",
    to: "https://supertokens.com/docs/authentication/overview",
    expected: 2,
  },
  {
    from: "https://supertokens.com/docs/passwordless/introduction",
    to: "https://supertokens.com/docs/authentication/passwordless/initial-setup",
    expected: 3,
  },
  {
    from: "https://supertokens.com/docs/passwordless/quick-setup/frontend",
    to: "https://supertokens.com/docs/authentication/passwordless/initial-setup",
    expected: 2,
  },
  {
    from: "https://supertokens.com/docs/passwordless/quick-setup/backend",
    to: "https://supertokens.com/docs/authentication/passwordless/initial-setup",
    expected: 1,
  },
  {
    from: "https://supertokens.com/docs/passwordless/advanced-customizations/frontend-functions-override/about",
    to: "https://supertokens.com/docs/authentication/passwordless/hooks-and-overrides",
    expected: 1,
  },
  {
    from: "https://supertokens.com/docs/thirdpartyemailpassword/quick-setup/frontend",
    to: "https://supertokens.com/docs/authentication/social/initial-setup",
    expected: 1,
  },
  {
    from: "https://supertokens.com/docs/auth-react/modules/recipe_thirdpartyemailpassword.html#RecipeInterface",
    to: "https://supertokens.com/docs/references/frontend-sdks/function-overrides",
    expected: 2,
  },
  {
    from: "https://supertokens.com/docs/nodejs/modules/recipe_thirdparty.html#RecipeInterface",
    to: "https://supertokens.com/docs/references/backend-sdks/function-overrides",
    expected: 1,
  },
  {
    from: "https://supertokens.com/docs/python/recipe/thirdparty/interfaces.html#supertokens_python.recipe.thirdparty.interfaces.RecipeInterface",
    to: "https://supertokens.com/docs/references/backend-sdks/function-overrides",
    expected: 1,
  },
  {
    from: "https://supertokens.com/docs/session/common-customizations/sessions/session-verification-in-api/get-session",
    to: "https://supertokens.com/docs/additional-verification/session-verification/protect-api-routes",
    expected: 1,
  },
  {
    from: "https://supertokens.com/docs/session/common-customizations/sessions/token-transfer-method#backend-configuration-optional",
    to: "https://supertokens.com/docs/post-authentication/session-management/switch-between-cookies-and-header-authentication",
    expected: 1,
  },
  {
    from: "../frontend-setup#step-2-checking-the---custv-boolean-value-in-the-mfa-claim--cust",
    to: "/additional-verification/mfa/initial-setup#12-add-the-mfa-flow",
    expected: 2,
  },
  {
    from: "../frontend-setup#mfa-info-endpoint",
    to: "/additional-verification/mfa/initial-setup#the-mfa-info-endpoint",
    expected: 7,
  },
  {
    from: "./frontend-setup#mfa-info-endpoint",
    to: "/additional-verification/mfa/initial-setup#the-mfa-info-endpoint",
    expected: 1,
  },
  {
    from: "/passwordless/custom-ui/login-otp#step-3-verifying-the-input-otp",
    to: "/authentication/passwordless/initial-setup#23-verifying-the-otp",
    expected: 2,
  },
  {
    from: "/passwordless/custom-ui/login-otp",
    to: "/authentication/passwordless/initial-setup#21-creating-and-sending-the-otp",
    expected: 2,
  },
  {
    from: "./backend-setup#multi-tenant-setup-1",
    to: "/additional-verification/mfa/initial-setup#13-configure-the-second-factor",
    expected: 2,
  },
  {
    from: "./backend-setup#multi-tenant-setup",
    to: "/additional-verification/mfa/initial-setup#12-configure-the-first-factors",
    expected: 1,
  },
  {
    from: "/multi-tenancy/new-tenant",
    to: "/authentication/enterprise/manage-tenants#create-a-new-tenant",
    expected: 1,
  },
  {
    from: "../../custom-ui/thirdparty-login",
    to: "/authentication/social/initial-setup#2-add-the-login-ui",
    expected: 3,
  },
  {
    from: "../sessions/protecting-frontend-routes#verifying-the-claims-of-a-session--cust",
    to: "/additional-verification/session-verification/protect-frontend-routes#check-the-claims-of-a-session",
    expected: 2,
  },
  {
    from: "../sessions/protecting-frontend-routes",
    to: "/additional-verification/session-verification/protect-frontend-routes",
    expected: 2,
  },
  {
    from: "/microservice_auth/legacy/implementation-guide",
    to: "/authentication/m2m/legacy-flow",
    expected: 1,
  },
  {
    from: "/authentication/unified-login/reuse-website-login",
    to: "/authentication/unified-login/quickstart-guides/reuse-website-login",
    expected: 9,
  },
  {
    from: "../../custom-ui/init/frontend",
    to: "/quickstart/frontend-setup",
    expected: 1,
  },
  {
    from: "../custom-ui/init/frontend",
    to: "/quickstart/frontend-setup",
    expected: 1,
  },
];

const walk = async (directory) => {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
};

const files = await walk(docsRoot);
const sources = new Map(await Promise.all(files.map(async (file) => [file, await fs.readFile(file, "utf8")])));
let rewritten = 0;

for (const replacement of replacements) {
  const count = [...sources.values()].reduce((total, source) => total + source.split(replacement.from).length - 1, 0);
  if (count === 0) {
    continue;
  }
  if (count !== replacement.expected) {
    throw new Error(`Expected ${replacement.expected} occurrence(s) of ${replacement.from}, found ${count}`);
  }
  rewritten += count;
  for (const [file, source] of sources) {
    sources.set(file, source.replaceAll(replacement.from, replacement.to));
  }
}

await Promise.all([...sources].map(([file, source]) => fs.writeFile(file, source)));
console.log(`Rewrote ${rewritten} stale links.`);

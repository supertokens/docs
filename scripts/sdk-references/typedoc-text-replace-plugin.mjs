// @ts-check
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

export function load(app) {
  const textReplacements = [
    {
      pattern: /supertokens\/docs\/tmp\//g,
      replace: "",
    },
    {
      pattern: /# captcha-react/g,
      replace: "# `@supertokens-plugins/captcha-react`",
    },
    {
      pattern: /# captcha-nodejs/g,
      replace: "# `@supertokens-plugins/captcha-nodejs`",
    },
    {
      pattern: /# user-banning-react/g,
      replace: "# `@supertokens-plugins/user-banning-react`",
    },
    {
      pattern: /# user-banning-nodejs/g,
      replace: "# `@supertokens-plugins/user-banning-nodejs`",
    },
    {
      pattern: /# tenant-discovery-react/g,
      replace: "# `@supertokens-plugins/tenant-discovery-react`",
    },
    {
      pattern: /# tenant-discovery-nodejs/g,
      replace: "# `@supertokens-plugins/tenant-discovery-nodejs`",
    },
    {
      pattern: /# opentelemetry-nodejs/g,
      replace: "# `@supertokens-plugins/opentelemetry-nodejs`",
    },
    {
      pattern: /# progressive-profiling-nodejs/g,
      replace: "# `@supertokens-plugins/progressive-profiling-nodejs`",
    },
    {
      pattern: /# progressive-profiling-react/g,
      replace: "# `@supertokens-plugins/progressive-profiling-react`",
    },
    {
      pattern: /# profile-base-react/g,
      replace: "# `@supertokens-plugins/profile-base-react`",
    },
    {
      pattern: /# profile-details-nodejs/g,
      replace: "# `@supertokens-plugins/profile-details-nodejs`",
    },
    {
      pattern: /# profile-details-react/g,
      replace: "# `@supertokens-plugins/profile-details-react`",
    },
  ];

  app.renderer.on(MarkdownPageEvent.END, (page) => {
    for (const replacement of textReplacements) {
      page.contents = page.contents.replace(replacement.pattern, replacement.replace);
    }
  });
}

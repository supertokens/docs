import { describe, expect, it } from "bun:test";
import { customExtract } from "./extractImportStatements";

const content = `
import {
  FrontendPrebuiltUITabs,
  FrontendCustomUITabs,
} from "/src/components/Tabs";
import { AppInfoForm } from "/src/components/Forms";
import { NodePackageManagerCard, JavascriptHttpLibraryCard, NpmOrScriptsCard, MobileFrameworksCard } from "/src/components/Cards";
import { Question, Answer } from "/src/components/Question";

import ReactRouterCallout from "/docs/_blocks/react-router-callout.mdx";

import ReactSDKInit from "./_blocks/react-sdk-init.mdx";
import ReactRouterV6 from "./_blocks/react-router-v6.mdx";
import ReactNoRouter from "./_blocks/react-no-router.mdx";
import AngularAuthComponent from "./_blocks/angular-auth-component.mdx";
import AngularAppComponent from "./_blocks/angular-auth-component.mdx";
import AngularRouting from "./_blocks/angular-routing.mdx";
import VueAuthView from "./_blocks/vue-auth-view.mdx";
import VueMainFile from "./_blocks/vue-main-file.mdx";
import VueRouting from "./_blocks/vue-routing.mdx";
import VanillaJSNpmSDKInit from "./_blocks/vanilla-js-npm-sdk-init.mdx";
import VanillaJSScriptsSDKInit from "./_blocks/vanilla-js-script-sdk-init.mdx";
import KotlinSDKInit from "./_blocks/kotlin-sdk-init.mdx";
import SwiftSDKInit from "./_blocks/swift-sdk-init.mdx";
import VanillaJSNpmSignUp from "./_blocks/vanilla-js-npm-sign-up.mdx";
import VanillaJSScriptsSignUp from "./_blocks/vanilla-js-script-sign-up.mdx";
import VanillaJSNpmCheckEmail from "./_blocks/vanilla-js-npm-check-email.mdx";
import VanillaJSScriptsCheckEmail from "./_blocks/vanilla-js-script-check-email.mdx";
import VanillaJSNpmSignIn from "./_blocks/vanilla-js-npm-sign-in.mdx";
import VanillaJSScriptsSignIn from "./_blocks/vanilla-js-script-sign-in.mdx";
import CurlSignIn from "./_blocks/curl-sign-in.mdx";
`;

describe("extractImportStatements", () => {
  it("should extract default imports", async () => {
    const testContent = `
      import React from 'react';
      import Component from '@site/src/components';
    `;

    const result = await customExtract(testContent);

    expect(result).toEqual([
      { name: "React", module: "react" },
      { name: "Component", module: "@site/src/components" },
    ]);
  });

  it("should extract named imports", async () => {
    const testContent = `
      import { useState } from 'react';
      import { Button, Card } from '@site/src/components';
    `;

    const result = await customExtract(testContent);

    expect(result).toEqual([
      { name: "useState", module: "react" },
      { name: "Button", module: "@site/src/components" },
      { name: "Card", module: "@site/src/components" },
    ]);
  });

  it("should extract multiline imports", async () => {
    const testContent = `
      import {
        useState,
        useEffect
      } from 'react';
    `;

    const result = await customExtract(testContent);

    expect(result).toEqual([
      { name: "useState", module: "react" },
      { name: "useEffect", module: "react" },
    ]);
  });

  it("should extract import statements from the example content", async () => {
    const result = await customExtract(content);

    // Check a few expected results
    expect(result).toContainEqual({ name: "FrontendPrebuiltUITabs", module: "/src/components/Tabs" });
    expect(result).toContainEqual({ name: "FrontendCustomUITabs", module: "/src/components/Tabs" });
    expect(result).toContainEqual({ name: "NodePackageManagerCard", module: "/src/components/Cards" });
    expect(result).toContainEqual({ name: "JavascriptHttpLibraryCard", module: "/src/components/Cards" });
    expect(result).toContainEqual({ name: "NpmOrScriptsCard", module: "/src/components/Cards" });
    expect(result).toContainEqual({ name: "MobileFrameworksCard", module: "/src/components/Cards" });

    expect(result).toContainEqual({ name: "AppInfoForm", module: "/src/components/Forms" });
    expect(result).toContainEqual({ name: "ReactRouterCallout", module: "/docs/_blocks/react-router-callout.mdx" });
    expect(result).toContainEqual({ name: "ReactSDKInit", module: "./_blocks/react-sdk-init.mdx" });

    // Check the total number of imports
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle aliases in named imports", async () => {
    const testContent = `
      import { useState as useStateHook } from 'react';
    `;

    const result = await customExtract(testContent);

    expect(result).toEqual([{ name: "useState as useStateHook", module: "react" }]);
  });
});

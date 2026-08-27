import { defineComponents } from "blume";

import ApiRequestSnippet from "./components/ApiRequestSnippet.astro";
import ApiReferenceDrawer from "./components/ApiReferenceDrawer.astro";
import ConditionalContent from "./components/ConditionalContent.astro";
import ContentOption from "./components/ContentOption.astro";
import ContextCondition from "./components/ContextCondition.astro";
import DependentContent from "./components/DependentContent.astro";
import Header from "./components/Header.astro";
import NextjsRouterTypeSelect from "./components/NextjsRouterTypeSelect.astro";
import PasswordlessRecipeForm from "./components/PasswordlessRecipeForm.astro";
import Tab from "./components/Tab.astro";
import TableOfContents from "./components/TableOfContents.astro";
import Tabs from "./components/Tabs.astro";
import TenantTypeSwitch from "./components/TenantTypeSwitch.astro";
import UITypeSwitch from "./components/UITypeSwitch.astro";
import VariantContent from "./components/VariantContent.astro";

export default defineComponents({
  layout: {
    Footer: ApiReferenceDrawer,
    Header,
    TableOfContents,
  },
  mdx: {
    ApiRequestSnippet,
    ConditionalContent,
    ContentOption,
    ContextCondition,
    DependentContent,
    NextjsRouterTypeSelect,
    PasswordlessRecipeForm,
    Tab,
    Tabs,
    TenantTypeSwitch,
    UITypeSwitch,
    VariantContent,
  },
});

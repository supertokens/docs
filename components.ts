import { defineComponents } from "blume";

import ConditionalContent from "./components/ConditionalContent.astro";
import ContextCondition from "./components/ContextCondition.astro";
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
    TableOfContents,
  },
  mdx: {
    ConditionalContent,
    ContextCondition,
    NextjsRouterTypeSelect,
    PasswordlessRecipeForm,
    Tab,
    Tabs,
    TenantTypeSwitch,
    UITypeSwitch,
    VariantContent,
  },
});

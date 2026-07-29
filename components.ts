import { defineComponents } from "blume";

import ConditionalContent from "./components/ConditionalContent.astro";
import ContextCondition from "./components/ContextCondition.astro";
import NextjsRouterTypeSelect from "./components/NextjsRouterTypeSelect.astro";
import PasswordlessRecipeForm from "./components/PasswordlessRecipeForm.astro";
import TenantTypeSwitch from "./components/TenantTypeSwitch.astro";
import UITypeSwitch from "./components/UITypeSwitch.astro";
import VariantContent from "./components/VariantContent.astro";

export default defineComponents({
  mdx: {
    ConditionalContent,
    ContextCondition,
    NextjsRouterTypeSelect,
    PasswordlessRecipeForm,
    TenantTypeSwitch,
    UITypeSwitch,
    VariantContent,
  },
});

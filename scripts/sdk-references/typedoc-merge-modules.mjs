import { ReflectionKind, Converter } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

function getModulesFrom(moduleParent) {
  const modules = (moduleParent.children ?? []).filter((c) => c.kindOf(ReflectionKind.Module));

  for (const mod of modules) {
    const subModules = getModulesFrom(mod);
    modules.push(...subModules);
  }

  return modules;
}

function removeReflectionFromParent(ref) {
  const parent = ref.parent;

  if (parent) {
    parent.removeChild(ref);

    const modulesGroup = parent.groups?.find((g) => g.title === "Modules");
    if (modulesGroup) {
      const indexInGroup = modulesGroup.children.indexOf(ref);
      if (indexInGroup !== -1) {
        modulesGroup.children.splice(indexInGroup, 1);
      }
    }
  }
}

function addReflectionToTarget(ref, target) {
  ref.parent = target;
  target.addChild(ref);
}

function moveReflectionToTarget(ref, target) {
  removeReflectionFromParent(ref);
  addReflectionToTarget(ref, target);
}

function createModuleBundleId(module) {
  const moduleName = module.name;

  if (moduleName.includes("/")) {
    const parts = moduleName.split("/");
    return parts[0];
  }

  if (module.sources && module.sources.length > 0) {
    const sourcePath = module.sources[0].fileName;
    const match = sourcePath.match(/packages\/([^\/]+)\//);
    if (match) {
      return match[1];
    }
  }

  return moduleName;
}

function createModuleBundles(project) {
  const modules = getModulesFrom(project);
  const bundleMap = new Map();

  for (const module of modules) {
    const bundleId = createModuleBundleId(module);

    if (bundleId === "<internal>") {
      continue;
    }

    if (!bundleMap.has(bundleId)) {
      bundleMap.set(bundleId, []);
    }

    bundleMap.get(bundleId).push(module);
  }

  const internalModules = modules.filter((m) => createModuleBundleId(m) === "<internal>");

  for (const internalModule of internalModules) {
    let targetPackage = null;

    if (internalModule.sources && internalModule.sources.length > 0) {
      const sourcePath = internalModule.sources[0].fileName;
      const match = sourcePath.match(/packages\/([^\/]+)\//);
      if (match) {
        targetPackage = match[1];
      }
    }

    if (targetPackage && bundleMap.has(targetPackage)) {
      bundleMap.get(targetPackage).push(internalModule);
      console.log(`    Added <internal> module to ${targetPackage} bundle`);
    }
  }

  return bundleMap;
}

function getTargetModule(modules) {
  const nonInternalModules = modules.filter((module) => !module.name.includes("<internal>"));

  if (nonInternalModules.length > 0) {
    const firstWithComment = nonInternalModules.find((module) => (module.comment?.summary.length ?? 0) > 0);
    if (firstWithComment) {
      return firstWithComment;
    }

    return nonInternalModules[0];
  }

  return modules[0];
}

function mergeBundleModules(modules) {
  const [target] = modules;
  const [moduleName] = target.name.split("/");
  if (modules.length <= 1) {
    modules[0].name = moduleName;
    return;
  }

  for (const sourceModule of modules) {
    if (sourceModule === target) continue;

    const childrenToMove = [...(sourceModule.childrenIncludingDocuments ?? [])];

    for (const child of childrenToMove) {
      if (child.kindOf && child.kindOf(ReflectionKind.Reference)) continue;
      moveReflectionToTarget(child, target);
    }

    if (sourceModule.categories) {
      for (const category of sourceModule.categories) {
        const existingCategory = target.categories?.find((c) => c.title === category.title);

        if (!existingCategory) {
          target.categories = [...(target.categories ?? []), category];
        } else {
          existingCategory.children = existingCategory.children.concat(category.children);

          if (existingCategory.description?.length === 0 && category.description) {
            existingCategory.description = category.description;
          }
        }
      }
    }

    if (sourceModule.groups) {
      for (const group of sourceModule.groups) {
        const existingGroup = target.groups?.find((g) => g.title === group.title);

        if (!existingGroup) {
          target.groups = [...(target.groups ?? []), group];
        } else {
          existingGroup.children = existingGroup.children.concat(group.children);

          if (existingGroup.description?.length === 0 && group.description) {
            existingGroup.description = group.description;
          }
        }
      }
    }

    removeReflectionFromParent(sourceModule);
  }

  target.categories?.forEach((category) => {
    category.children.sort((a, b) => a.name.localeCompare(b.name));
  });

  target.groups?.forEach((group) => {
    group.children.sort((a, b) => a.name.localeCompare(b.name));
  });

  modules[0].name = moduleName;
}

let mergedPackages = new Set();

export function load(app) {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    const project = context.project;

    console.log("Starting module merging for SuperTokens plugins...");

    const bundleMap = createModuleBundles(project);

    console.log(`Found ${bundleMap.size} package bundles to merge:`);

    for (const [bundleId, modules] of bundleMap) {
      console.log(`  - ${bundleId}: merging ${modules.length} modules`);
      console.log(`    Module names: ${modules.map((m) => m.name).join(", ")}`);

      if (modules.length > 1) {
        mergeBundleModules(modules);
        mergedPackages.add(bundleId);
        console.log(`    ✓ Merged ${modules.length} modules into package bundle: ${bundleId}`);
      }
    }

    console.log("Module merging completed.");
  });
}

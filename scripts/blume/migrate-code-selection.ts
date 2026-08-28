import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createProcessor } from "@mdx-js/mdx";
import { glob } from "glob";

interface Node {
  attributes?: Array<{ name: string; value: unknown }>;
  children?: Node[];
  lang?: string;
  meta?: string;
  name?: string;
  position?: { start: { line: number; offset: number }; end: { offset: number } };
  type: string;
  value?: string;
}

interface Choice {
  secondary?: { group: string; label: string; title: string; value: string };
  value: string;
}

interface Timeline {
  code: Choice[][];
  prose: Choice[][];
}

interface Option {
  title: string;
  value: string;
  timeline: Timeline;
}

interface Replacement {
  start: number;
  end: number;
  value: string;
}

export interface MigrationSummary {
  codeGroups: number;
  filesChanged: number;
  filesScanned: number;
  groupedTabs: number;
  proseFollowers: number;
}

const processor = createProcessor();
const inferredGroups: Array<{ group: string; values: Record<string, string> }> = [
  { group: "install-method", values: { npm: "npm", "Script tag": "script-tag" } },
  { group: "package-managers", values: { npm: "npm", yarn: "yarn", pnpm: "pnpm", Bun: "bun" } },
  { group: "package-manager-scripts", values: { "npm run": "npm", "yarn run": "yarn", "pnpm run": "pnpm" } },
  { group: "database", values: { Mysql: "mysql", Postgresql: "postgresql" } },
  { group: "operating-system", values: { Linux: "linux", Mac: "mac", Windows: "windows" } },
  {
    group: "import-column-order",
    values: { "Without specifying column order": "without-order", "With specifying column order": "with-order" },
  },
  {
    group: "core-deployment",
    values: { "With Docker": "with-docker", "Without Docker": "without-docker", "With Saas": "saas" },
  },
  {
    group: "core-hosting",
    values: {
      "Managed service": "managed",
      "Self-hosted with Docker": "self-hosted-docker",
      "Self-hosted without Docker": "self-hosted-binary",
    },
  },
  { group: "password-hashing-algorithm", values: { Argon2: "argon2", Bcrypt: "bcrypt" } },
  { group: "docker", values: { "With Docker": "with-docker", "Without Docker": "without-docker" } },
];
const backendValues: Record<string, string> = { "Node.js": "nodejs", Go: "go", Python: "python", cURL: "curl" };
const reactRouterGroups = [
  "yes-no-1ddf50o-1",
  "yes-no-esuii7-1",
  "yes-no-42kmrb-1",
  "yes-no-1ogu034-1",
  "yes-no-63j79t-1",
  "yes-no-1r20bsb-1",
  "yes-no-yjhcom-1",
  "yes-no-kzvsrv-1",
  "yes-no-17utnrf-1",
  "yes-no-1diduqx-1",
  "yes-no-1r5wfw3-1",
  "yes-no-si6mlc-1",
  "yes-no-si6mlc-2",
  "yes-no-19br05l-1",
  "yes-no-19br05l-2",
];

function normalizeSemanticGroups(source: string, filePath: string): string {
  const replacements: Replacement[] = [];
  const replaceOpeningAttribute = (node: Node, name: string, value: string) => {
    if (!node.position) return;
    const opening = sourceFor(source, node).slice(0, sourceFor(source, node).indexOf(">") + 1);
    const pattern = new RegExp(`\\b${name}=(['"])[^'"]*\\1`);
    const match = pattern.exec(opening);
    if (!match) return;
    replacements.push({
      start: node.position.start.offset + match.index,
      end: node.position.start.offset + match.index + match[0].length,
      value: `${name}=${JSON.stringify(value)}`,
    });
  };
  const appendOpeningAttributes = (node: Node, attributes: string) => {
    if (!node.position) return;
    const opening = sourceFor(source, node).slice(0, sourceFor(source, node).indexOf(">") + 1);
    replacements.push({
      start: node.position.start.offset + opening.length - 1,
      end: node.position.start.offset + opening.length - 1,
      value: ` ${attributes}`,
    });
  };

  const tree = parse(source, filePath);
  walk(tree, [], (node) => {
    const group = attribute(node, "group");
    if (group && reactRouterGroups.includes(group)) replaceOpeningAttribute(node, "group", "react-router");
    if (
      group === "react-router" &&
      ["Choice", "Already using React Router?"].includes(attribute(node, "label") ?? "")
    ) {
      replaceOpeningAttribute(node, "label", "Do you use react-router-dom?");
    }
  });
  if (
    filePath.endsWith("references/frontend-sdks/prebuilt-ui/embed-sign-in-up-form.mdx") ||
    filePath.endsWith("references/frontend-sdks/prebuilt-ui/override-react-components.mdx")
  ) {
    walk(tree, [], (node) => {
      if (node.name !== "Tabs" || attribute(node, "group")) return;
      const tabs = childrenNamed(node, "Tab");
      if (tabs.map((tab) => attribute(tab, "title")).join("|") !== "Yes|No") return;
      appendOpeningAttributes(node, 'group="react-router"');
      for (const tab of tabs)
        appendOpeningAttributes(tab, `value=${JSON.stringify(attribute(tab, "title")!.toLowerCase())}`);
    });
  }
  if (
    filePath.endsWith("integrations/nestjs.mdx") ||
    filePath.endsWith("integrations/nextjs/app-directory/next-steps.mdx") ||
    filePath.endsWith("integrations/nextjs/pages-directory/next-steps.mdx")
  ) {
    walk(tree, [], (node) => {
      if (node.name !== "Tabs" || attribute(node, "group") || !node.position) return;
      const tabs = childrenNamed(node, "Tab");
      if (tabs.map((tab) => attribute(tab, "title")).join("|") !== "Yes|No") return;
      const options = tabs.map((tab) => {
        const title = attribute(tab, "title")!;
        const body = (tab.children ?? [])
          .map((child) => sourceFor(source, child))
          .join("\n")
          .trim();
        return contentOption(title, title.toLowerCase(), body);
      });
      replacements.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
        value: `<DependentContent group="uses-try-supertokens">\n${options.join("\n")}\n</DependentContent>`,
      });
    });
  }
  return apply(source, replacements);
}

function attribute(node: Node, name: string): string | undefined {
  const value = node.attributes?.find((candidate) => candidate.name === name)?.value;
  return typeof value === "string" ? value : undefined;
}

function hasBooleanAttribute(node: Node, name: string): boolean {
  return Boolean(node.attributes?.some((candidate) => candidate.name === name));
}

function childrenNamed(node: Node, name: string): Node[] {
  return (node.children ?? []).filter((child) => child.type === "mdxJsxFlowElement" && child.name === name);
}

function sourceFor(source: string, node: Node): string {
  if (!node.position) throw new Error(`${node.type} has no source position`);
  return source.slice(node.position.start.offset, node.position.end.offset);
}

function hasCode(node: Node): boolean {
  return node.type === "code" || (node.children ?? []).some(hasCode);
}

function fenceFor(node: Node): string {
  if (node.type !== "code" || node.value === undefined) throw new Error("Expected a fenced code node");
  const longestRun = Math.max(0, ...[...node.value.matchAll(/`+/g)].map((match) => match[0].length));
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return `${fence}${node.lang ?? ""}${node.meta ? ` ${node.meta}` : ""}\n${node.value}\n${fence}`;
}

function parse(source: string, filePath: string): Node {
  try {
    return processor.parse(source) as Node;
  } catch (error) {
    throw new Error(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function walk(node: Node, ancestors: Node[], visitor: (node: Node, ancestors: Node[]) => void): void {
  visitor(node, ancestors);
  for (const child of node.children ?? []) walk(child, [...ancestors, node], visitor);
}

function inferGroup(node: Node): { group: string; values: Record<string, string> } | undefined {
  if (node.name !== "Tabs") return undefined;
  const titles = childrenNamed(node, "Tab").map((tab) => attribute(tab, "title"));
  return inferredGroups.find(
    ({ values }) => titles.length === Object.keys(values).length && titles.every((title) => title && values[title]),
  );
}

interface Event {
  type: "code" | "prose";
  value: string;
}

function shell(source: string, node: Node): { open: string; close: string } | undefined {
  if (node.type !== "mdxJsxFlowElement" || !node.name) return undefined;
  const value = sourceFor(source, node);
  const openEnd = value.indexOf(">");
  const closeStart = value.lastIndexOf(`</${node.name}>`);
  return openEnd >= 0 && closeStart >= 0
    ? { open: value.slice(0, openEnd + 1), close: value.slice(closeStart) }
    : undefined;
}

function eventsFor(source: string, nodes: Node[], filePath: string): Event[] {
  const events: Event[] = [];
  const append = (event: Event) => {
    if (!event.value.trim()) return;
    const previous = events.at(-1);
    if (event.type === "prose" && previous?.type === "prose") previous.value += `\n\n${event.value.trim()}`;
    else events.push({ ...event, value: event.value.trim() });
  };
  for (const node of nodes) {
    if (node.type === "code") {
      append({ type: "code", value: fenceFor(node) });
      continue;
    }
    if (!hasCode(node)) {
      append({ type: "prose", value: sourceFor(source, node) });
      continue;
    }
    if (node.type === "list" || node.name === "Steps" || node.name === "Step") {
      throw new Error(
        `${filePath}:${node.position?.start.line}: structured code inside ${node.name ?? node.type} requires a manual semantics-preserving migration`,
      );
    }
    if (node.name === "ConditionalContent") {
      append({ type: "code", value: sourceFor(source, node) });
      continue;
    }
    const nested = eventsFor(source, node.children ?? [], filePath);
    const wrapper = shell(source, node);
    let wrappedFirstStepProse = false;
    for (const event of nested) {
      if (event.type === "prose" && wrapper && node.name === "Steps") {
        append({ type: "prose", value: `${wrapper.open}\n${event.value}\n${wrapper.close}` });
      } else if (event.type === "prose" && wrapper && node.name === "Step" && !wrappedFirstStepProse) {
        append({ type: "prose", value: `${wrapper.open}\n${event.value}\n${wrapper.close}` });
        wrappedFirstStepProse = true;
      } else {
        append(event);
      }
    }
  }
  return events;
}

function segment(source: string, nodes: Node[], filePath: string): { code: string[]; prose: string[] } {
  const code: string[] = [];
  const prose = [""];
  for (const event of eventsFor(source, nodes, filePath)) {
    if (event.type === "code") {
      code.push(event.value);
      prose.push("");
      continue;
    }
    prose[prose.length - 1] = [prose.at(-1), event.value].filter(Boolean).join("\n\n");
  }
  return { code, prose };
}

function timelineFor(source: string, option: Node, filePath: string): Timeline {
  const timeline: Timeline = { code: [], prose: [[]] };
  let stage = 0;
  const addEvents = (events: Event[], secondary?: Choice["secondary"]) => {
    for (const event of events) {
      if (event.type === "prose") timeline.prose[stage].push({ secondary, value: event.value });
      else {
        timeline.code[stage] ??= [];
        timeline.code[stage].push({ secondary, value: event.value });
        stage += 1;
        timeline.prose[stage] ??= [];
      }
    }
  };

  for (const node of option.children ?? []) {
    if (node.name !== "DependentContent") {
      addEvents(eventsFor(source, [node], filePath));
      continue;
    }
    const group = attribute(node, "group");
    const label = attribute(node, "label") ?? "Example";
    if (!group) throw new Error(`${filePath}:${node.position?.start.line}: secondary selector needs a group`);
    const optionNodes = childrenNamed(node, "ContentOption");
    const firstOptionStart = optionNodes[0]?.position?.start.offset ?? 0;
    const lastOptionEnd = optionNodes.at(-1)?.position?.end.offset ?? Number.POSITIVE_INFINITY;
    for (const child of node.children ?? []) {
      if (child.name !== "ContentOption" && (child.position?.end.offset ?? 0) <= firstOptionStart) {
        addEvents(eventsFor(source, [child], filePath));
      }
    }
    const variants = optionNodes.map((child) => {
      const title = attribute(child, "title");
      const value = attribute(child, "value");
      if (!title || !value)
        throw new Error(`${filePath}:${child.position?.start.line}: secondary option needs title/value`);
      return { secondary: { group, label, title, value }, segmented: segment(source, child.children ?? [], filePath) };
    });
    const count = Math.max(...variants.map(({ segmented }) => segmented.code.length));
    for (let index = 0; index <= count; index += 1) {
      const prose = variants.map(({ segmented }) => segmented.prose[index] ?? "");
      const nonempty = prose.filter(Boolean);
      if (nonempty.length === prose.length && new Set(prose).size === 1) {
        if (prose[0]) timeline.prose[stage].push({ value: prose[0] });
      } else {
        variants.forEach(({ secondary }, variantIndex) => {
          if (prose[variantIndex]) timeline.prose[stage].push({ secondary, value: prose[variantIndex] });
        });
      }
      if (index === count) continue;
      timeline.code[stage] ??= [];
      variants.forEach(({ secondary, segmented }) => {
        if (segmented.code[index]) timeline.code[stage].push({ secondary, value: segmented.code[index] });
      });
      stage += 1;
      timeline.prose[stage] ??= [];
    }
    for (const child of node.children ?? []) {
      if (child.name !== "ContentOption" && (child.position?.start.offset ?? 0) >= lastOptionEnd) {
        addEvents(eventsFor(source, [child], filePath));
      }
    }
  }
  return timeline;
}

function contentOption(title: string, value: string, body: string): string {
  return `<ContentOption title=${JSON.stringify(title)} value=${JSON.stringify(value)}>\n${body}\n</ContentOption>`;
}

function passiveProse(group: string, options: Option[], stage: number): string | undefined {
  const bodies = options.map((option) => {
    const choices = option.timeline.prose[stage] ?? [];
    const shared = choices.filter((choice) => !choice.secondary).map((choice) => choice.value);
    const specific = choices.filter((choice): choice is Choice & { secondary: NonNullable<Choice["secondary"]> } =>
      Boolean(choice.secondary),
    );
    if (specific.length) {
      const secondary = specific[0].secondary;
      shared.push(
        `<DependentContent passive group=${JSON.stringify(secondary.group)}>\n${specific
          .map((choice) => contentOption(choice.secondary.title, choice.secondary.value, choice.value))
          .join("\n")}\n</DependentContent>`,
      );
    }
    return shared.join("\n\n");
  });
  const nonempty = bodies.filter(Boolean);
  if (nonempty.length === 0) return undefined;
  if (nonempty.length === bodies.length && new Set(bodies).size === 1) return bodies[0];
  const choices = options
    .map((option, index) => (bodies[index] ? contentOption(option.title, option.value, bodies[index]) : ""))
    .filter(Boolean)
    .join("\n");
  return `<DependentContent passive group=${JSON.stringify(group)}>\n${choices}\n</DependentContent>`;
}

function codeGroup(
  group: string,
  options: Option[],
  stage: number,
  passive: boolean,
  secondaryControls: string[],
): string | undefined {
  const tabs = options
    .map((option) => {
      const choices = option.timeline.code[stage] ?? [];
      if (!choices.length && passive) return "";
      const shared = choices.filter((choice) => !choice.secondary).map((choice) => choice.value);
      const specific = choices.filter((choice): choice is Choice & { secondary: NonNullable<Choice["secondary"]> } =>
        Boolean(choice.secondary),
      );
      if (specific.length) {
        const secondary = specific[0].secondary;
        shared.push(
          `<DependentContent group=${JSON.stringify(secondary.group)} label=${JSON.stringify(secondary.label)}>\n${specific
            .map((choice) => contentOption(choice.secondary.title, choice.secondary.value, choice.value))
            .join("\n")}\n</DependentContent>`,
        );
      }
      const body = shared.join("\n");
      return `<Tab title=${JSON.stringify(option.title)} value=${JSON.stringify(option.value)}>\n${body}\n</Tab>`;
    })
    .filter(Boolean)
    .join("\n");
  return tabs
    ? `<CodeGroup${passive ? " passive" : ""}${passive && secondaryControls.length ? ` secondaryControls=${JSON.stringify(secondaryControls.join(","))}` : ""} group=${JSON.stringify(group)}>\n${tabs}\n</CodeGroup>`
    : undefined;
}

function renderStages(group: string, options: Option[]): { groups: number; source: string } {
  const stages = Math.max(...options.map((option) => option.timeline.code.length));
  const parts: string[] = [];
  let groups = 0;
  const ownedSecondaryGroups = new Set<string>();
  for (let stage = 0; stage <= stages; stage += 1) {
    const prose = passiveProse(group, options, stage);
    if (prose) parts.push(prose);
    if (stage === stages) continue;
    const stageSecondaryGroups = new Set(
      options.flatMap((option) =>
        (option.timeline.code[stage] ?? []).flatMap((choice) => choice.secondary?.group ?? []),
      ),
    );
    const secondaryControls = [...stageSecondaryGroups].filter(
      (secondaryGroup) => !ownedSecondaryGroups.has(secondaryGroup),
    );
    const code = codeGroup(group, options, stage, groups > 0, secondaryControls);
    if (code) {
      parts.push(code);
      groups += 1;
      for (const secondaryGroup of stageSecondaryGroups) ownedSecondaryGroups.add(secondaryGroup);
    }
  }
  return { groups, source: parts.join("\n\n") };
}

function apply(source: string, replacements: Replacement[]): string {
  for (const replacement of replacements.toSorted((left, right) => right.start - left.start)) {
    source = source.slice(0, replacement.start) + replacement.value + source.slice(replacement.end);
  }
  return source;
}

function insertBeforeClosing(source: string, node: Node, closingTag: string, value: string): Replacement {
  if (!node.position) throw new Error(`${node.name ?? node.type} has no source position`);
  const nodeSource = sourceFor(source, node);
  const relativeEnd = nodeSource.lastIndexOf(closingTag);
  if (relativeEnd < 0) throw new Error(`Expected ${closingTag} in ${node.name ?? node.type}`);
  const offset = node.position.start.offset + relativeEnd;
  return { start: offset, end: offset, value: `${value}\n` };
}

function normalizeSecondaryControlOwnership(source: string, filePath: string): string {
  const seenBySequence = new Map<string, Set<string>>();
  const replacements: Replacement[] = [];
  walk(parse(source, filePath), [], (node, ancestors) => {
    if (node.name !== "CodeGroup" || !node.position) return;
    const primaryGroup = attribute(node, "group");
    if (!primaryGroup) return;
    const secondaryGroups = new Set<string>();
    walk(node, [], (descendant) => {
      if (
        descendant !== node &&
        descendant.name === "DependentContent" &&
        !hasBooleanAttribute(descendant, "passive") &&
        childrenNamed(descendant, "ContentOption").length >= 2
      ) {
        const group = attribute(descendant, "group");
        if (group) secondaryGroups.add(group);
      }
    });
    const scope = ancestors
      .filter((ancestor) => ancestor.name === "VariantContent")
      .map((ancestor) => `${attribute(ancestor, "storageKey")}:${attribute(ancestor, "value")}`)
      .join("/");
    const sequence = `${scope}|${primaryGroup}`;
    if (!hasBooleanAttribute(node, "passive")) {
      seenBySequence.set(sequence, secondaryGroups);
      return;
    }
    const seen = seenBySequence.get(sequence) ?? new Set<string>();
    const declaredControls = attribute(node, "secondaryControls")?.split(",").filter(Boolean) ?? [];
    for (const group of declaredControls) seen.add(group);
    const controls = [...secondaryGroups].filter((group) => !seen.has(group));
    for (const group of secondaryGroups) seen.add(group);
    seenBySequence.set(sequence, seen);
    if (!controls.length) return;

    const nodeSource = sourceFor(source, node);
    const openingEnd = nodeSource.indexOf(">");
    if (declaredControls.length) {
      const opening = nodeSource.slice(0, openingEnd + 1);
      const match = /\bsecondaryControls=(['"])[^'"]*\1/.exec(opening);
      if (!match) return;
      replacements.push({
        start: node.position.start.offset + match.index,
        end: node.position.start.offset + match.index + match[0].length,
        value: `secondaryControls=${JSON.stringify([...declaredControls, ...controls].join(","))}`,
      });
    } else {
      replacements.push({
        start: node.position.start.offset + openingEnd,
        end: node.position.start.offset + openingEnd,
        value: ` secondaryControls=${JSON.stringify(controls.join(","))}`,
      });
    }
  });
  return apply(source, replacements);
}

function normalizeSelectorOwnership(source: string, filePath: string): string {
  const tree = parse(source, filePath);
  interface Owner {
    kind: "primary" | "secondary";
    node: Node;
    scope: string;
    values: Set<string>;
  }
  interface PassiveChoice {
    node: Node;
    group: string;
    scope: string;
    options: Array<{ title: string; value: string }>;
  }
  const owners = new Map<string, Owner[]>();
  const passiveChoices: PassiveChoice[] = [];
  const variantScope = (ancestors: Node[]) =>
    ancestors
      .filter((ancestor) => ancestor.name === "VariantContent")
      .map((ancestor) => `${attribute(ancestor, "storageKey")}:${attribute(ancestor, "value")}`)
      .join("/");
  const addOwner = (group: string, owner: Owner) => owners.set(group, [...(owners.get(group) ?? []), owner]);

  walk(tree, [], (node, ancestors) => {
    if (node.name === "CodeGroup" && !hasBooleanAttribute(node, "passive")) {
      const group = attribute(node, "group");
      const tabs = childrenNamed(node, "Tab");
      if (group && tabs.length > 0) {
        addOwner(group, {
          kind: "primary",
          node,
          scope: variantScope(ancestors),
          values: new Set(tabs.map((tab) => attribute(tab, "value")).filter(Boolean) as string[]),
        });
      }
    }
    if (node.name !== "DependentContent") return;
    const group = attribute(node, "group");
    if (!group) return;
    const options = childrenNamed(node, "ContentOption").flatMap((option) => {
      const title = attribute(option, "title");
      const value = attribute(option, "value");
      return title && value ? [{ title, value }] : [];
    });
    if (hasBooleanAttribute(node, "passive")) {
      passiveChoices.push({ node, group, options, scope: variantScope(ancestors) });
    } else if (ancestors.some((ancestor) => ancestor.name === "CodeGroup")) {
      const codeGroup = ancestors.findLast((ancestor) => ancestor.name === "CodeGroup")!;
      const activeSecondaryGroups = attribute(codeGroup, "secondaryControls")?.split(",") ?? [];
      if (hasBooleanAttribute(codeGroup, "passive") && !activeSecondaryGroups.includes(group)) return;
      addOwner(group, {
        kind: "secondary",
        node,
        scope: variantScope(ancestors),
        values: new Set(options.map((option) => option.value)),
      });
    }
  });

  const replacements: Replacement[] = [];
  for (const passive of passiveChoices) {
    const candidates = (owners.get(passive.group) ?? []).filter((owner) => owner.scope === passive.scope);
    const preferredKind = candidates.some((owner) => owner.kind === "secondary") ? "secondary" : "primary";
    const owner = candidates
      .filter((candidate) => candidate.kind === preferredKind)
      .toSorted(
        (left, right) =>
          Math.abs((left.node.position?.start.offset ?? 0) - (passive.node.position?.start.offset ?? 0)) -
          Math.abs((right.node.position?.start.offset ?? 0) - (passive.node.position?.start.offset ?? 0)),
      )[0];
    if (!owner) continue;
    const missing = passive.options.filter((option) => !owner.values.has(option.value));
    if (!missing.length) continue;
    if (owner.kind === "secondary") {
      replacements.push(
        insertBeforeClosing(
          source,
          owner.node,
          "</DependentContent>",
          missing.map((option) => contentOption(option.title, option.value, "")).join("\n"),
        ),
      );
    } else {
      replacements.push(
        insertBeforeClosing(
          source,
          owner.node,
          "</CodeGroup>",
          missing
            .map(
              (option) => `<Tab title=${JSON.stringify(option.title)} value=${JSON.stringify(option.value)}>\n\n</Tab>`,
            )
            .join("\n"),
        ),
      );
    }
    for (const option of missing) owner.values.add(option.value);
  }
  return apply(source, replacements);
}

function migrateApiTabs(source: string, filePath: string): { groups: number; source: string } {
  const replacements: Replacement[] = [];
  let groups = 0;
  walk(parse(source, filePath), [], (node, ancestors) => {
    if (node.name !== "Tabs" || !node.position || ancestors.some((ancestor) => ancestor.name === "Tabs")) return;
    const tabs = childrenNamed(node, "Tab");
    const details = tabs.find((tab) => attribute(tab, "title") === "Details");
    const examples = tabs.filter((tab) => attribute(tab, "title") !== "Details");
    if (!details || !examples.length || !examples.every((tab) => backendValues[attribute(tab, "title") ?? ""])) return;
    const rendered = renderStages(
      "backend-language",
      examples.map((tab) => ({
        title: attribute(tab, "title")!,
        value: backendValues[attribute(tab, "title")!],
        timeline: timelineFor(source, tab, filePath),
      })),
    );
    groups += rendered.groups;
    const detailsBody = (details.children ?? [])
      .map((child) => sourceFor(source, child))
      .join("\n")
      .trim();
    replacements.push({
      start: node.position.start.offset,
      end: node.position.end.offset,
      value: `<Tabs>\n<Tab title="Examples">\n${rendered.source}\n</Tab>\n<Tab title="Details">\n${detailsBody}\n</Tab>\n</Tabs>`,
    });
  });
  return { groups, source: apply(source, replacements) };
}

function migrateTabs(
  source: string,
  filePath: string,
): { groups: number; groupedTabs: number; prose: number; source: string } {
  const replacements: Replacement[] = [];
  let groups = 0;
  let groupedTabs = 0;
  let prose = 0;
  walk(parse(source, filePath), [], (node, ancestors) => {
    const inferred = inferGroup(node);
    const explicit = attribute(node, "group");
    if (node.name !== "Tabs" || (!explicit && !inferred) || !node.position) return;
    if (ancestors.some((ancestor) => ancestor.name === "Tabs")) return;
    const group = explicit ?? inferred!.group;
    const tabs = childrenNamed(node, "Tab");
    groupedTabs += 1;
    if (!hasCode(node)) {
      const choices = tabs.map((tab) => {
        const title = attribute(tab, "title")!;
        const value = attribute(tab, "value") ?? inferred?.values[title];
        return contentOption(
          title,
          value!,
          (tab.children ?? [])
            .map((child) => sourceFor(source, child))
            .join("\n")
            .trim(),
        );
      });
      replacements.push({
        start: node.position.start.offset,
        end: node.position.end.offset,
        value: `<DependentContent group=${JSON.stringify(group)}>\n${choices.join("\n")}\n</DependentContent>`,
      });
      prose += 1;
      return;
    }
    let options: Option[];
    try {
      options = tabs.map((tab) => {
        const title = attribute(tab, "title")!;
        const value = attribute(tab, "value") ?? inferred?.values[title];
        if (!title || !value) throw new Error(`${filePath}:${tab.position?.start.line}: grouped Tab needs title/value`);
        return { title, value, timeline: timelineFor(source, tab, filePath) };
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("structured code inside")) {
        console.warn(`Skipped ${error.message}`);
        return;
      }
      throw error;
    }
    const rendered = renderStages(group, options);
    groups += rendered.groups;
    replacements.push({ start: node.position.start.offset, end: node.position.end.offset, value: rendered.source });
  });
  return { groups, groupedTabs, prose, source: apply(source, replacements) };
}

function migrateDependentContent(source: string, filePath: string): { groups: number; source: string } {
  const replacements: Replacement[] = [];
  let groups = 0;
  walk(parse(source, filePath), [], (node, ancestors) => {
    if (node.name !== "DependentContent" || !node.position || !hasCode(node) || hasBooleanAttribute(node, "passive"))
      return;
    if (ancestors.some((ancestor) => ancestor.name === "CodeGroup" || ancestor.name === "DependentContent")) return;
    const group = attribute(node, "group");
    if (!group) throw new Error(`${filePath}:${node.position.start.line}: code selector needs a group`);
    const optionNodes = childrenNamed(node, "ContentOption");
    const firstOptionStart = optionNodes[0]?.position?.start.offset ?? 0;
    const lastOptionEnd = optionNodes.at(-1)?.position?.end.offset ?? Number.POSITIVE_INFINITY;
    const before = (node.children ?? [])
      .filter((child) => child.name !== "ContentOption" && (child.position?.end.offset ?? 0) <= firstOptionStart)
      .map((child) => sourceFor(source, child).trim())
      .filter(Boolean);
    const after = (node.children ?? [])
      .filter((child) => child.name !== "ContentOption" && (child.position?.start.offset ?? 0) >= lastOptionEnd)
      .map((child) => sourceFor(source, child).trim())
      .filter(Boolean);
    const interleaved = (node.children ?? []).filter(
      (child) =>
        child.name !== "ContentOption" &&
        (child.position?.start.offset ?? 0) < lastOptionEnd &&
        (child.position?.end.offset ?? 0) > firstOptionStart,
    );
    if (interleaved.length)
      throw new Error(`${filePath}:${node.position.start.line}: shared content is interleaved with options`);
    let options: Option[];
    try {
      options = optionNodes.map((option) => {
        const title = attribute(option, "title");
        const value = attribute(option, "value");
        if (!title || !value)
          throw new Error(`${filePath}:${option.position?.start.line}: ContentOption needs title/value`);
        return { title, value, timeline: timelineFor(source, option, filePath) };
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("structured code inside")) {
        console.warn(`Skipped ${error.message}`);
        return;
      }
      throw error;
    }
    const rendered = renderStages(group, options);
    groups += rendered.groups;
    replacements.push({
      start: node.position.start.offset,
      end: node.position.end.offset,
      value: [...before, rendered.source, ...after].join("\n\n"),
    });
  });
  return { groups, source: apply(source, replacements) };
}

export function migrateCodeSelection(source: string, filePath = "document.mdx") {
  source = normalizeSemanticGroups(source, filePath);
  const api = migrateApiTabs(source, filePath);
  const tabs = migrateTabs(api.source, filePath);
  const dependent = migrateDependentContent(tabs.source, filePath);
  const secondaryControls = normalizeSecondaryControlOwnership(dependent.source, filePath);
  const normalized = normalizeSelectorOwnership(secondaryControls, filePath);
  return {
    codeGroups: api.groups + tabs.groups + dependent.groups,
    groupedTabs: tabs.groupedTabs,
    proseFollowers: tabs.prose,
    source: normalized,
  };
}

export async function migrateDirectory(root: string, check = false): Promise<MigrationSummary> {
  const absoluteRoot = path.resolve(root);
  const files = await glob("**/*.mdx", { absolute: true, cwd: absoluteRoot, ignore: "_templates/**" });
  const summary: MigrationSummary = {
    codeGroups: 0,
    filesChanged: 0,
    filesScanned: files.length,
    groupedTabs: 0,
    proseFollowers: 0,
  };
  const writes: Array<{ file: string; source: string }> = [];
  for (const file of files.toSorted()) {
    const source = await readFile(file, "utf8");
    const result = migrateCodeSelection(source, path.relative(absoluteRoot, file));
    summary.codeGroups += result.codeGroups;
    summary.groupedTabs += result.groupedTabs;
    summary.proseFollowers += result.proseFollowers;
    if (result.source !== source) {
      summary.filesChanged += 1;
      writes.push({ file, source: result.source });
    }
  }
  if (!check) for (const pending of writes) await writeFile(pending.file, pending.source);
  return summary;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const root = args.find((argument) => argument !== "--check") ?? "docs";
  const summary = await migrateDirectory(root, check);
  console.log(JSON.stringify(summary, null, 2));
  if (check && summary.filesChanged) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

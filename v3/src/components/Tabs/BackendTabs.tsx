import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { useContext, useMemo } from "react";
import { TabsContextProvider, TabsContext } from "./TabsContex";

const BackendLanguagesTabItems = [
  { label: "NodeJS", value: "nodejs" },
  { label: "GoLang", value: "go" },
  { label: "Python", value: "python" },
  { label: "Other Frameworks", value: "otherFrameworks" },
];

const BackendTabsGroupId = "frontend-tabs";

type BackendTabsProps = Omit<TabsProps, "values" | "groupId"> & {
  exclude?: string[];
};

function BackendTabsRoot(props: BackendTabsProps) {
  const { children, exclude, ...rest } = props;

  const tabItems = useMemo(() => {
    if (exclude)
      return BackendLanguagesTabItems.filter(
        (tabItem) => !exclude.includes(tabItem.value),
      );
    return BackendLanguagesTabItems;
  }, [BackendLanguagesTabItems, exclude]);

  return (
    <TabsContextProvider tabItems={tabItems}>
      <Tabs values={tabItems} groupId={BackendTabsGroupId} {...rest}>
        {children}
      </Tabs>
    </TabsContextProvider>
  );
}

function BackendTab({ children, value, ...rest }: TabItemProps) {
  const { tabItems } = useContext(TabsContext);

  if (!tabItems.find((v) => v.value === value)) {
    throw new Error("Invalid tab value");
  }

  return (
    <TabItem
      value={value}
      {...rest}
      attributes={{ onclick: (val) => console.log(val) }}
    >
      {children}
    </TabItem>
  );
}

export const BackendTabs = Object.assign(BackendTabsRoot, {
  Tab: BackendTab,
});

const NodeJSFrameworkSubTabItems = [
  { label: "Express", value: "express" },
  { label: "Hapi", value: "hapi" },
  { label: "Fastify", value: "fastify" },
  { label: "Koa", value: "koa" },
  { label: "Loopback", value: "loopback" },
  { label: "AWS Lambda / Netlify", value: "awsLambda" },
  { label: "Next.js (Pages Dir)", value: "nextjs" },
  { label: "Next.js (App Dir)", value: "nextjs-app" },
  { label: "NestJS", value: "nestjs" },
];
const NodeJSFrameworkSubTabsGroupId = "nodejs-framework";
type NodeJSFrameworkSubTabsProps = Omit<TabsProps, "values" | "groupId">;
function NodeJSFrameworkSubTabsRoot(props: NodeJSFrameworkSubTabsProps) {
  const { children, ...rest } = props;

  return (
    <TabsContextProvider tabItems={NodeJSFrameworkSubTabItems}>
      <Tabs
        values={NodeJSFrameworkSubTabItems}
        groupId={NodeJSFrameworkSubTabsGroupId}
        {...rest}
      >
        {children}
      </Tabs>
    </TabsContextProvider>
  );
}
function NodeJSFrameworkSubTab({ children, value, ...rest }: TabItemProps) {
  const { tabItems } = useContext(TabsContext);

  if (!tabItems.find((v) => v.value === value)) {
    throw new Error("Invalid tab value");
  }

  return (
    <TabItem
      value={value}
      {...rest}
      attributes={{ onclick: (val) => console.log(val) }}
    >
      {children}
    </TabItem>
  );
}
export const NodeJSFrameworkSubTabs = Object.assign(
  NodeJSFrameworkSubTabsRoot,
  {
    Tab: NodeJSFrameworkSubTab,
  },
);

const GoFrameworkSubTabItems = [
  { label: "Chi", value: "chi" },
  { label: "net/http", value: "http" },
  { label: "Gin", value: "gin" },
  { label: "Mux", value: "mux" },
];
const GoFrameworkSubTabsGroupId = "go-framework";
type GoFrameworkSubTabsProps = Omit<TabsProps, "values" | "groupId">;
function GoFrameworkSubTabsRoot(props: GoFrameworkSubTabsProps) {
  const { children, ...rest } = props;

  return (
    <TabsContextProvider tabItems={GoFrameworkSubTabItems}>
      <Tabs
        values={GoFrameworkSubTabItems}
        groupId={GoFrameworkSubTabsGroupId}
        {...rest}
      >
        {children}
      </Tabs>
    </TabsContextProvider>
  );
}
function GoFrameworkSubTab({ children, value, ...rest }: TabItemProps) {
  const { tabItems } = useContext(TabsContext);

  if (!tabItems.find((v) => v.value === value)) {
    throw new Error("Invalid tab value");
  }

  return (
    <TabItem
      value={value}
      {...rest}
      attributes={{ onclick: (val) => console.log(val) }}
    >
      {children}
    </TabItem>
  );
}
export const GoFrameworkSubTabs = Object.assign(GoFrameworkSubTabsRoot, {
  Tab: GoFrameworkSubTab,
});

const PythonFrameworkSubTabItems = [
  { label: "FastAPI", value: "fastapi" },
  { label: "Flask", value: "flask" },
  { label: "Django", value: "django" },
];
const PythonFrameworkSubTabsGroupId = "python-framework";
type PythonFrameworkSubTabsProps = Omit<TabsProps, "values" | "groupId">;
function PythonFrameworkSubTabsRoot(props: PythonFrameworkSubTabsProps) {
  const { children, ...rest } = props;

  return (
    <TabsContextProvider tabItems={PythonFrameworkSubTabItems}>
      <Tabs
        values={PythonFrameworkSubTabItems}
        groupId={PythonFrameworkSubTabsGroupId}
        {...rest}
      >
        {children}
      </Tabs>
    </TabsContextProvider>
  );
}
function PythonFrameworkSubTab({ children, value, ...rest }: TabItemProps) {
  const { tabItems } = useContext(TabsContext);

  if (!tabItems.find((v) => v.value === value)) {
    throw new Error("Invalid tab value");
  }

  return (
    <TabItem
      value={value}
      {...rest}
      attributes={{ onclick: (val) => console.log(val) }}
    >
      {children}
    </TabItem>
  );
}
export const PythonFrameworkSubTabs = Object.assign(
  PythonFrameworkSubTabsRoot,
  {
    Tab: PythonFrameworkSubTab,
  },
);

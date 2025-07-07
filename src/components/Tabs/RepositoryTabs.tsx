import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useMemo } from "react";

const RepositoryTabOptions = [
    { label: "Node", value: "supertokens-node" },
    { label: "Python", value: "supertokens-python" },
    { label: "Core", value: "supertokens-core" },
    { label: "React", value: "supertokens-auth-react" },
    { label: "JS", value: "supertokens-website" },
    { label: "Backend SDK Testing", value: "backend-sdk-testing" },
];

const RepositoryTabsGroupId = "repository";

type RepositoryTabsProps = Omit<TabsProps, "values" | "groupId"> & {
    exclude?: string[];
    // TODO: Remove this.
    // Temporary solution for places where we show stuff like "Dashboard" and "cURL"
    additionalValues?: { label: string; value: string }[];
};

function RepositoryTabsRoot(props: RepositoryTabsProps) {
    const { children, exclude, additionalValues, ...rest } = props;

    const tabOptions = useMemo(() => {
        const allOptions = additionalValues
            ? [...RepositoryTabOptions, ...additionalValues]
            : RepositoryTabOptions;
        if (exclude) return allOptions.filter((tabItem) => !exclude.includes(tabItem.value));
        return allOptions;
    }, [RepositoryTabOptions, exclude, additionalValues]);

    return (
        <Tabs values={tabOptions} groupId={RepositoryTabsGroupId} {...rest}>
            {children}
        </Tabs>
    );
}

export const RepositoryTabs = Object.assign(RepositoryTabsRoot, {
    Tab: TabItem,
    TabItem,
});

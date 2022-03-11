import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function DatabaseTabs(props: any) {
    return (
        <Tabs
            groupId="database-tabs"
            defaultValue="mysql"
            values={[
                { label: 'MySQL', value: 'mysql' },
                { label: 'PostgreSQL', value: 'postgresql'},
                { label: 'MongoDB', value: 'mongodb'}
            ]}>
            {props.children}
        </Tabs>
    );
}
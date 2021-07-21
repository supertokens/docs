import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function DockerTabs(props) {
    return (
        <Tabs
            groupId="docker-tabs"
            defaultValue="with-docker"
            values={[
                { label: 'With Docker', value: 'with-docker' },
                { label: 'Without Docker', value: 'without-docker'},
            ]}>
            {props.children}
        </Tabs>
    );
}
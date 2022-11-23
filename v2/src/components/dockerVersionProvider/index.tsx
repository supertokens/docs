/* Copyright (c) 2022, VRAI Labs and/or its affiliates. All rights reserved.
*
* This software is licensed under the Apache License, Version 2.0 (the
* "License") as published by the Apache Software Foundation.
*
* You may not use this file except in compliance with the License. You may
* obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations
* under the License.
*/
import React, { useCallback, useEffect, useState } from "react";
import { getCoreVersionForPlugin } from "../api/plugin/dependency/cores";
import { recursiveMap } from "../utils";

type Props = {}
type DockerVersions = {
    mysql: string,
    mongo: string,
    postgres: string,
}

const DockerVersionProvider: React.FC<Props>  = (props) => {
    const [dockerVersions, setDockerVersions] = useState<DockerVersions>({
        mysql: "",
        mongo: "",
        postgres: "",
    });
    const mysqlVersionString = "^{docker_version_mysql}"
    const mongoVersionString = "^{docker_version_mongodb}"
    const postGresVersionString = "^{docker_version_postgresql}"

    const fetchImageVersion = useCallback(async () => {
        try {
            const result = await Promise.all([
                await getCoreVersionForPlugin("mysql"),
                await getCoreVersionForPlugin("mongodb"),
                await getCoreVersionForPlugin("postgresql"),
            ])

            setDockerVersions({
                mysql: result[0].cores[0],
                mongo: result[1].cores[0],
                postgres: result[2].cores[0],
            })
        } catch (e) {}
    }, [])

    useEffect(() => {
        void fetchImageVersion();
    }, [])

    return <>{recursiveMap(props.children, (c: any) => {
        if (typeof c === "string") {
            const mysqlReplacement = dockerVersions.mysql === "" ? ":" : `:${dockerVersions.mysql}`;
            const mongoReplacement = dockerVersions.mongo === "" ? "" : `:${dockerVersions.mongo}`;
            const postgresReplacement = dockerVersions.postgres === "" ? "" : `:${dockerVersions.postgres}`;

            c = c.split(mysqlVersionString).join(mysqlReplacement);
            c = c.split(mongoVersionString).join(mongoReplacement);
            c = c.split(postGresVersionString).join(postgresReplacement);
        }

        return c;
    })}</>;
}

export default DockerVersionProvider;
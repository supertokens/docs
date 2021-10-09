import React from 'react';
import "./style.css";
import supertokens from "supertokens-website";
import { getUserInformation } from "../../../components/api/user/info";

export default function SignUpButton() {

    let [title, setTitle] = React.useState("Sign Up")

    React.useEffect(() => {
        async function setName() {
            if (await supertokens.doesSessionExist()) {
                let name = await fetchUserName();
                if (name !== undefined) {
                    setTitle(name);
                }
            }
        }
        setName();
    }, [])

    return (
        <div
            onClick={() => {
                window.open("/auth", '_blank').focus();
            }}
            className="button">
            {title}
        </div>
    );
}

async function fetchUserName(): Promise<string | undefined> {
    try {
        const { name } = await getUserInformation();
        return name;
    } catch (e) { }
    return undefined;
}
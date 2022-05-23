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
            className="signUpButton">
            {title}
        </div>
    );
}

async function fetchUserName(): Promise<string | undefined> {
    try {
        const { name } = await getUserInformation();
        const formattedName = formatNameToDisplayInNavbar(name);
        return formattedName;
    } catch (e) { }
    return undefined;
}

/**
 * Use this method to format the full name of the user to display in the navbar
 * @param fullName full name of the user fetched from the API
 * @returns formatted name to display in the navbar
 */
 export function formatNameToDisplayInNavbar(fullName: string): string {
    let userName = "";

    if (fullName !== undefined) {
        const [firstName, middleName, ..._] = fullName.split(" ");

        if (firstName.length > 8) {
            // if the first name is longer than 8 characters
            // display the first 8 characters and append '...'
            userName = `${firstName.substring(0, 8)}...`;
        } else if (firstName.length <= 8 && middleName !== undefined) {
            // if the first name is shorter than 9 characters
            // and there is a string defined in `middleName`
            // display the first name and initial from `middleName`
            const initial = middleName[0].toUpperCase();
            userName = `${firstName} ${initial}.`;
        } else {
            userName = firstName;
        }
    }

    return userName;
}

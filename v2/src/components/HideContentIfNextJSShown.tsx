import * as React from "react";

export default function HideContentIfNextJSShown(props: any) {
    const [show, setShow] = React.useState(false);
    const [currRender, setRerender] = React.useState({})
    React.useEffect(() => {
        setShow(!(localStorage.getItem("docusaurus.tab.backendsdk") === "nodejs" && localStorage.getItem("docusaurus.tab.nodejs-framework") === "nextjs"))
    }, [currRender])

    React.useEffect(() => {
        function onChange() {
            setRerender({})
        }
        window.addEventListener("docs-tab-change", onChange);
        return () => {
            window.removeEventListener("docs-tab-change", onChange);
        }
    }, [])
    return show ? props.children : null;
}
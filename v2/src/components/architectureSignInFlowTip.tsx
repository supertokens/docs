import * as React from "react";

export default function ArchitectureSignInFlowTip(props: any) {
    if (typeof window !== "undefined") {
        let path = window.location.pathname;
        if (!path.startsWith("/docs/emailpassword") && !path.startsWith("/docs/thirdpartyemailpassword")) {
            return (
                <div className="admonition admonition-important alert alert--info"><div className="admonition-heading"><h5><span className="admonition-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path></svg></span>important</h5></div><div className="admonition-content"><p>Whilst this section explains the flow for email / password login, other login methods are similar on a conceptual level - it's just with a different set of APIs</p></div></div>
            );
        }
    }
    return null;
}
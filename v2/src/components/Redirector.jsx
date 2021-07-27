import React from 'react';

export default function Redirector(props) {
    let { to } = props;
    React.useEffect(() => {
        window.location.href = to
    }, []);

    return "Redirecting...";
}
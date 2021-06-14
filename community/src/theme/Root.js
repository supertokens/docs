import React from 'react';
import { useLocation } from 'react-router-dom'; 
import {sendDocsPageViewEvents} from '../utils'

function Root({children}) {
  const location = useLocation();
  // TODO: initialize this with document.referrer. Failing now because of ssr
  const [referrer, setReferrer] = React.useState("")

  React.useEffect(() => {
    // TODO: send page view events here
    sendDocsPageViewEvents(referrer)
    setReferrer(window.location.href)
  }, [location]);

  return <>{children}</>;
}

export default Root;
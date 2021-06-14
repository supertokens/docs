import React from 'react';
import { useLocation } from 'react-router-dom'; 

function Root({children}) {
  const location = useLocation();

  React.useEffect(() => {
    // TODO: send page view events here
    console.log(location);
  }, [location]);

  return <>{children}</>;
}

export default Root;
import React from 'react';

// Default implementation, that you can customize
function Root({children}) {
  console.log('from root');
  return <>{children}</>;
}

export default Root;
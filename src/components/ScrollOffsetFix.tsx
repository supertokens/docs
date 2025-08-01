import { useEffect } from 'react';
import { initScrollOffset } from '../lib/scrollOffset';

export function ScrollOffsetFix() {
  useEffect(() => {
    initScrollOffset();
  }, []);

  return null; // This component doesn't render anything
}

export default ScrollOffsetFix;
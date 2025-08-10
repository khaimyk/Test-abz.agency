import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Preloader } from './components/hooks/Preloader';

const RootWrapper = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);

    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return loading ? <Preloader /> : <App />;
};

const root = createRoot(document.getElementById('root'));
root.render(<RootWrapper />);

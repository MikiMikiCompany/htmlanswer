import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import PasswordLock from './PasswordLock';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const docRef = doc(db, 'settings', 'master_password');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const targetPassword = docSnap.data().password as number[];
          const savedStr = localStorage.getItem('saved_master_password');
          if (savedStr) {
            const savedPassword = JSON.parse(savedStr) as number[];
            if (savedPassword.join(',') === targetPassword.join(',')) {
              setIsAuthenticated(true);
            }
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordLock onUnlock={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}

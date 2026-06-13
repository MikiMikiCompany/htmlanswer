import { useState } from 'react';
import PasswordLock from './PasswordLock';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if unlocked today in this session (using local time YYYY-MM-DD)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const unlockedDate = sessionStorage.getItem('unlocked_date');
    return unlockedDate === todayStr;
  });

  if (!isAuthenticated) {
    return <PasswordLock onUnlock={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}

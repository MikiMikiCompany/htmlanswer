import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import MasterPasswordLock from './MasterPasswordLock';

/**
 * スマホアプリ（WebView）からのアクセスかどうかを判定する。
 * - User-Agent による検出（複数パターン対応）
 * - URLクエリパラメータ `?app=1` によるバイパス
 */
function isAppAccess(): boolean {
  // 1. URLクエリパラメータによるバイパス（最も確実）
  const params = new URLSearchParams(window.location.search);
  if (params.get('app') === '1') {
    return true;
  }

  // 2. User-Agent による WebView 検出（広範囲にマッチ）
  const ua = navigator.userAgent || '';
  // Android WebView: "wv" フラグ、または "Version/X.X" を含む Android UA
  // その他のWebView: "WebView", "GSA" (Google Search App), "Line/", 各種アプリ内ブラウザ
  if (/wv|WebView|Android.*Version\/[\d.]+/i.test(ua)) {
    return true;
  }
  // Android で Chrome ではない場合（アプリ内ブラウザの可能性が高い）
  if (/Android/i.test(ua) && !/Chrome\/[\d.]+/i.test(ua)) {
    return true;
  }
  // standalone モード（ホーム画面から起動、またはTWA）
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}

export default function MasterAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // スマホアプリからのアクセスの場合はパスワードをスキップ
      if (isAppAccess()) {
        console.log('[MasterAuth] App access detected, skipping password');
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

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
    return <MasterPasswordLock onUnlock={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}

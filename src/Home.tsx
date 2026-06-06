import { Link } from 'react-router-dom';
import { Headphones, KeyRound, BookOpenCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

export default function Home() {
  const [hasPendingSyakai, setHasPendingSyakai] = useState(false);

  useEffect(() => {
    const checkSyakaiProgress = async () => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/MikiMikiCompany/syakai/main/data/progress.json?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          const pending = Object.values(data).some((item: any) => item.status === 'created');
          setHasPendingSyakai(pending);
        }
      } catch (error) {
        console.error("Failed to fetch syakai progress:", error);
      }
    };
    checkSyakaiProgress();
  }, []);
  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <header className="header">
        <div className="header-content">
          <div className="logo-area">
            <div className="logo-icon">✨</div>
            <h1>Study Menu</h1>
          </div>
          <p className="subtitle">学習メニューを選択してください</p>
        </div>
      </header>

      <main className="home-menu-container">
        {hasPendingSyakai && (
          <div style={{ width: '100%', marginBottom: '1rem', display: 'block' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #a7f3d0, #34d399)', 
              borderRadius: '16px', 
              padding: '1.2rem', 
              color: '#064e3b',
              boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #059669'
            }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🌱</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>チャンココ！社会が出題されているのだ！</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>社会アプリを開いて終わらせるのだ！</p>
              </div>
            </div>
          </div>
        )}

        <Link to="/questions" style={{ textDecoration: 'none', width: '100%' }}>
          <div className="home-card blue">
            <div className="home-icon-box">
              <Headphones size={48} />
            </div>
            <div className="home-card-content">
              <h2>問題メニュー</h2>
              <p>リスニング問題などを<br />パスワードなしで開きます</p>
            </div>
            <div className="home-card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </Link>

        <Link to="/answers" style={{ textDecoration: 'none', width: '100%' }}>
          <div className="home-card red">
            <div className="home-icon-box">
              <KeyRound size={48} />
            </div>
            <div className="home-card-content">
              <h2>解答メニュー</h2>
              <p>答え合わせをします<br />（パスワード必須）</p>
            </div>
            <div className="home-card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </Link>

        <Link to="/explanations" style={{ textDecoration: 'none', width: '100%' }}>
          <div className="home-card green">
            <div className="home-icon-box">
              <BookOpenCheck size={48} />
            </div>
            <div className="home-card-content">
              <h2>解説・評価メニュー</h2>
              <p>本日の文法解説や総評を見ます<br />（パスワードなし）</p>
            </div>
            <div className="home-card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </Link>



      </main>
    </div>
  );
}

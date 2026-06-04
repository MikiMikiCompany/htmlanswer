import { Link } from 'react-router-dom';
import { Headphones, KeyRound } from 'lucide-react';
import './index.css';

export default function Home() {
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
          <div className="home-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <div className="home-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="home-card-content">
              <h2>解説メニュー</h2>
              <p>本日の文法解説を見ます<br />（パスワードなし）</p>
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

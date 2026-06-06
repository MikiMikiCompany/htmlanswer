import { Link } from 'react-router-dom';
import { Headphones, KeyRound, BookOpenCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './index.css';

export default function Home() {
  const [hasPendingSyakai, setHasPendingSyakai] = useState(false);
  const [hasPendingEnglish, setHasPendingEnglish] = useState(false);

  const playSyakaiAudio = () => {
    try {
      const audio = new Audio('/syakai.wav');
      audio.play();
    } catch (e) {
      console.error('Audio play failed', e);
    }
  };

  useEffect(() => {
    const checkSyakaiProgress = async () => {
      try {
        const response = await fetch(`https://syakai.vercel.app/api/progress?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          const pending = Object.values(data).some((item: any) => item.status === 'created');
          setHasPendingSyakai(pending);
        }
      } catch (error) {
        console.error("Failed to fetch syakai progress:", error);
      }
    };

    const checkEnglishProgress = async () => {
      try {
        const q = query(
          collection(db, 'answers'),
          where('subject', '==', 'english_explain')
        );
        const querySnapshot = await getDocs(q);
        
        let pending = false;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isRead === false && data.target && data.target.includes('へー')) {
            pending = true;
          }
        });
        setHasPendingEnglish(pending);
      } catch (error) {
        console.error("Failed to fetch english progress:", error);
      }
    };

    checkSyakaiProgress();
    checkEnglishProgress();
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
          <div 
            onClick={playSyakaiAudio}
            style={{ width: '100%', marginBottom: '1rem', display: 'block', cursor: 'pointer' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #a7f3d0, #34d399)', 
              borderRadius: '16px', 
              padding: '1.2rem', 
              color: '#064e3b',
              boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #059669',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🌱</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>チャンココ！社会が出題されているのだ！</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>社会アプリを開いて終わらせるのだ！</p>
              </div>
            </div>
          </div>
        )}

        {hasPendingEnglish && (
          <Link 
            to="/explanations"
            style={{ width: '100%', marginBottom: '1rem', display: 'block', textDecoration: 'none' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #bfdbfe, #60a5fa)', 
              borderRadius: '16px', 
              padding: '1.2rem', 
              color: '#1e3a8a',
              boxShadow: '0 4px 15px rgba(96, 165, 250, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #3b82f6',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>📖</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>へー、英語が出題されているから読んでおけ。</h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>解説メニューからエンタメ授業を確認するのだ</p>
              </div>
            </div>
          </Link>
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

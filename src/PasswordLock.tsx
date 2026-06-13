import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import './LockScreen.css';

interface PasswordLockProps {
  onUnlock: () => void;
}

const CHARACTERS = [
  { id: 1, name: 'あや', src: '/1_Aya.png' },
  { id: 2, name: '緑', src: '/2_MochiGreen.png' },
  { id: 3, name: '茶', src: '/3_MochiBrown.png' },
  { id: 4, name: 'ピンク', src: '/4_MochiPink.png' },
  { id: 5, name: '白', src: '/5_MochiWhite.png' },
  { id: 6, name: '黄', src: '/6_MochiYellow.png' }
];

export default function PasswordLock({ onUnlock }: PasswordLockProps) {
  const [targetPassword, setTargetPassword] = useState<number[]>([]);
  const [currentInput, setCurrentInput] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const docRef = doc(db, 'settings', 'master_password');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTargetPassword(docSnap.data().password);
        } else {
          // No password generated yet for today, keep it locked
          setTargetPassword([]); 
        }
      } catch (e) {
        console.error("Failed to fetch password", e);
        setTargetPassword([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPassword();
  }, [onUnlock]);

  const handleCharClick = (id: number) => {
    if (error) return;
    
    // If no password set, just show error
    if (targetPassword.length === 0) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      return;
    }
    
    const newInput = [...currentInput, id];
    setCurrentInput(newInput);

    if (newInput.length === 6) {
      // Check password
      if (newInput.join(',') === targetPassword.join(',')) {
        // Unlock
        localStorage.setItem('saved_master_password', JSON.stringify(newInput));
        onUnlock();
      } else {
        // Error
        setError(true);
        setTimeout(() => {
          setCurrentInput([]);
          setError(false);
        }, 1000);
      }
    }
  };

  const handleReset = () => {
    setCurrentInput([]);
    setError(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="lock-container">
      <div className="lock-box">
        <div className="lock-title">マスターパスワード</div>
        <div className="lock-subtitle">
          {targetPassword.length === 0 ? (
            "パスワードが設定されていません"
          ) : (
            <>
              <div>6つのキャラクターを順番に選んでね！</div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>
                一度正解すると、次からは自動で入れるよ！
              </div>
            </>
          )}
        </div>

        {/* Input indicators */}
        <div className="input-indicators">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const charId = currentInput[idx];
            const char = charId ? CHARACTERS.find(c => c.id === charId) : null;
            
            let stateClass = 'empty';
            if (error) stateClass = 'error';
            else if (char) stateClass = 'filled';
            
            return (
              <div key={idx} className={`input-slot ${stateClass}`}>
                {char && (
                  <img src={char.src} alt={char.name} className="char-img-small" />
                )}
              </div>
            );
          })}
        </div>

        {/* Character grid */}
        <div className="char-grid">
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => handleCharClick(char.id)}
              disabled={currentInput.length >= 6 || error}
              className="char-btn"
            >
              <img src={char.src} alt={char.name} className="char-img" />
              <span className="char-name">{char.name}</span>
            </button>
          ))}
        </div>

        <button onClick={handleReset} className="reset-btn">
          やり直す
        </button>
      </div>
    </div>
  );
}

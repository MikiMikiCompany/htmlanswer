import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import './index.css';

interface QuestionFile {
  id: string;
  date: string;
  subject: string;
  target: string;
  isToday: boolean;
}

export default function QuestionList() {
  const [files, setFiles] = useState<QuestionFile[]>([]);
  const [showOnlyToday, setShowOnlyToday] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        
        const fetchedFiles: QuestionFile[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = data.date || '';
          const displayDate = rawDate.length === 8 ? `${rawDate.substring(0, 4)}/${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}` : rawDate;
          
          fetchedFiles.push({
            id: doc.id,
            date: displayDate,
            subject: data.subject || '',
            target: data.target || '',
            isToday: rawDate === todayStr,
          });
        });
        
        setFiles(fetchedFiles);
      } catch (e) {
        console.error("Error fetching questions:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const displayFiles = showOnlyToday ? files.filter(f => f.isToday) : files;

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <header className="header">
        <div className="header-content">
          <div className="logo-area">
            <Link to="/" className="text-white mr-4 hover:opacity-80">
              ← 戻る
            </Link>
            <div className="logo-icon">🎧</div>
            <h1>問題メニュー</h1>
          </div>
          <p className="subtitle">リスニング問題などに挑戦しましょう</p>
        </div>
      </header>

      <main className="main-content">
        <div className="controls">
          <div className="filter-toggle" onClick={() => setShowOnlyToday(!showOnlyToday)}>
            <div className={`toggle-btn ${showOnlyToday ? 'active' : ''}`}>
              本日の問題
            </div>
            <div className={`toggle-btn ${!showOnlyToday ? 'active' : ''}`}>
              すべての問題
            </div>
          </div>
          <div className="date-indicator">
            <Calendar size={18} />
            <span>{new Date().toLocaleDateString('ja-JP')}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="text-gray-500 font-medium">読み込み中...</div>
          </div>
        ) : displayFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>問題データが見つかりません。</p>
          </div>
        ) : (
          <div className="file-grid">
            {displayFiles.map((file) => (
              <Link 
                to={`/questions/view/${file.id}`}
                className={`file-card ${file.isToday ? 'is-today' : ''}`}
                key={file.id}
              >
                <div className="card-left">
                  <div className="icon-wrapper">
                    <BookOpen className="subject-icon text-blue-500" />
                  </div>
                  <div className="card-info">
                    <h3 className="subject-title">英語リスニング</h3>
                    <p className="target-text">対象: {file.target.replace(/_/g, ' ')}</p>
                    <p className="date-text">{file.date}</p>
                  </div>
                </div>
                <div className="card-right">
                  <ChevronRight className="arrow-icon" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { FileText, Calendar, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import './index.css';

interface AnswerFile {
  id: string;
  date: string;
  subject: string;
  target: string;
  isToday: boolean;
}

function getSubjectIcon(subject: string) {
  switch (subject.toLowerCase()) {
    case 'english':
    case 'vocab':
      return <BookOpen className="subject-icon text-blue-500" />;
    case 'math':
      return <GraduationCap className="subject-icon text-purple-500" />;
    case 'kanji':
      return <FileText className="subject-icon text-red-500" />;
    default:
      return <FileText className="subject-icon text-gray-500" />;
  }
}

function getSubjectName(subject: string) {
  switch (subject.toLowerCase()) {
    case 'english': return '英語';
    case 'vocab': return '英単語';
    case 'math': return '算数';
    case 'kanji': return '漢字';
    default: return subject;
  }
}

function getUserName(target: string) {
  let name = target.replace(/_/g, ' ');
  name = name.replace(/user1/g, 'チャンココ');
  name = name.replace(/user2/g, 'ゆず');
  name = name.replace(/user3/g, 'ルチア');
  return name;
}

function App() {
  const [files, setFiles] = useState<AnswerFile[]>([]);
  const [showOnlyToday, setShowOnlyToday] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const q = query(collection(db, 'answers'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        
        const fetchedFiles: AnswerFile[] = [];
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
        console.error("Error fetching answers:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnswers();
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
            <div className="logo-icon">✨</div>
            <h1>Study Answers</h1>
          </div>
          <p className="subtitle">学習の解答メニュー</p>
        </div>
      </header>

      <main className="main-content">
        <div className="controls">
          <div className="filter-toggle" onClick={() => setShowOnlyToday(!showOnlyToday)}>
            <div className={`toggle-btn ${showOnlyToday ? 'active' : ''}`}>
              本日の解答
            </div>
            <div className={`toggle-btn ${!showOnlyToday ? 'active' : ''}`}>
              すべての解答
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
            <p>解答データが見つかりません。</p>
            <p className="empty-sub">学習ツールでテストを出力するとここに表示されます。</p>
          </div>
        ) : (
          <div className="file-grid">
            {displayFiles.map((file) => (
              <Link 
                to={`/view/${file.id}`}
                className={`file-card ${file.isToday ? 'is-today' : ''}`}
                key={file.id}
              >
                <div className="card-left">
                  <div className="icon-wrapper">
                    {getSubjectIcon(file.subject)}
                  </div>
                  <div className="card-info">
                    <h3 className="subject-title">{getSubjectName(file.subject)}</h3>
                    <p className="target-text">対象: {getUserName(file.target)}</p>
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

export default App;

import { useState, useEffect } from 'react';
import { FileText, Calendar, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import './index.css';

// Get all html files from the answer directory
const htmlFiles = import.meta.glob('../answer/*.html', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

interface AnswerFile {
  path: string;
  url: string;
  filename: string;
  date: string;
  subject: string;
  target: string;
  isToday: boolean;
}

function parseFilename(path: string, url: string): AnswerFile {
  // Example path: ../answer/20260531_english_user1.html
  const filename = path.split('/').pop() || '';
  const match = filename.match(/^(\d{8})_([^_]+)_(.+)\.html$/);
  
  let date = '';
  let subject = '';
  let target = '';
  
  if (match) {
    const rawDate = match[1];
    date = `${rawDate.substring(0, 4)}/${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}`;
    subject = match[2];
    target = match[3];
  } else {
    date = 'Unknown Date';
    subject = 'Unknown';
    target = filename;
  }
  
  // Format dates for comparison
  const today = new Date();
  const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const isToday = match ? match[1] === todayStr : false;

  return { path, url, filename, date, subject, target, isToday };
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

function App() {
  const [files, setFiles] = useState<AnswerFile[]>([]);
  const [showOnlyToday, setShowOnlyToday] = useState(true);

  useEffect(() => {
    const parsedFiles = Object.entries(htmlFiles).map(([path, url]) => parseFilename(path, url));
    // Sort by date descending (newest first)
    parsedFiles.sort((a, b) => b.filename.localeCompare(a.filename));
    setFiles(parsedFiles);
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

        {displayFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>解答ファイルが見つかりません。</p>
            <p className="empty-sub">学習ツールでテストを出力するとここに表示されます。</p>
          </div>
        ) : (
          <div className="file-grid">
            {displayFiles.map((file, idx) => (
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`file-card ${file.isToday ? 'is-today' : ''}`}
                key={idx}
              >
                <div className="card-left">
                  <div className="icon-wrapper">
                    {getSubjectIcon(file.subject)}
                  </div>
                  <div className="card-info">
                    <h3 className="subject-title">{getSubjectName(file.subject)}</h3>
                    <p className="target-text">対象: {file.target.replace(/_/g, ' ')}</p>
                    <p className="date-text">{file.date}</p>
                  </div>
                </div>
                <div className="card-right">
                  <ChevronRight className="arrow-icon" />
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

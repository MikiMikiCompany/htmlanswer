import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import './index.css';

interface QuestionFile {
  id: string;
  date: string;
  rawDate?: string;
  subject: string;
  target: string;
  isToday: boolean;
}

export default function QuestionList() {
  const [files, setFiles] = useState<QuestionFile[]>([]);
  const [filterDate, setFilterDate] = useState<string>('TODAY');
  const [customDate, setCustomDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Generate past 7 days options
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return {
      value: `${yyyy}${mm}${dd}`,
      label: i === 0 ? '本日' : i === 1 ? '昨日' : `${i}日前`,
      dateStr: `${yyyy}/${mm}/${dd}`
    };
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = query(collection(db, 'questions'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const todayStr = past7Days[0].value;
        
        const fetchedFiles: QuestionFile[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = data.date || '';
          const displayDate = rawDate.length === 8 ? `${rawDate.substring(0, 4)}/${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}` : rawDate;
          
          fetchedFiles.push({
            id: doc.id,
            date: displayDate,
            rawDate: rawDate,
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

  // Use useEffect to set TODAY value initially
  useEffect(() => {
    setFilterDate(past7Days[0].value);
  }, []);

  const displayFiles = files.filter(f => {
    if (filterDate === 'ALL') return true;
    if (filterDate === 'CUSTOM') {
      if (!customDate) return true;
      const customYYYYMMDD = customDate.replace(/-/g, '');
      return f.rawDate === customYYYYMMDD;
    }
    return f.rawDate === filterDate;
  });

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
        <div className="controls flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Calendar size={20} className="text-blue-500" />
            <span>日付選択:</span>
          </div>
          
          <select 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-50 hover:bg-white"
          >
            <optgroup label="最近">
              {past7Days.map(d => (
                <option key={d.value} value={d.value}>{d.label} ({d.dateStr})</option>
              ))}
            </optgroup>
            <option value="ALL">すべて表示</option>
            <option value="CUSTOM">任意の日付...</option>
          </select>

          {filterDate === 'CUSTOM' && (
            <input 
              type="date" 
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          )}
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

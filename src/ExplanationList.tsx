import { useState, useEffect } from 'react';
import { FileText, Calendar, BookOpen, GraduationCap, ChevronRight, Star } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import './index.css';

interface AnswerFile {
  id: string;
  date: string;
  rawDate?: string;
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
    case 'math_jhs_explain':
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
    case 'math_jhs_explain': return '中学数学';
    case 'kanji': return '漢字';
    case 'science': return '理科';
    default: return subject;
  }
}

function getDisplayTarget(subject: string, rawTarget: string) {
  const targetStr = rawTarget.toLowerCase();
  const s = subject.toLowerCase();
  
  if (s === 'english' || s === 'vocab' || s === 'english_study') {
    if (targetStr.includes('5') && (targetStr.includes('級') || targetStr.includes('eiken') || targetStr.includes('kyu'))) {
      return 'チャンココ';
    }
    if (targetStr.includes('3') && (targetStr.includes('級') || targetStr.includes('eiken') || targetStr.includes('kyu'))) {
      return 'へー';
    }
    if (targetStr.includes('all') || targetStr.includes('全員')) {
      return 'ALL';
    }
  }

  let name = rawTarget.replace(/_/g, ' ');
  name = name.replace(/user1/g, 'チャンココ');
  name = name.replace(/user2/g, 'へー');
  name = name.replace(/user3/g, 'みき');
  return name;
}

function getTargetColor(subject: string, displayTarget: string) {
  const s = subject.toLowerCase();
  if (s === 'kanji' || s === 'math' || s === 'science') {
    return '#3b82f6'; // blue
  }
  
  if (displayTarget.includes('チャンココ')) return '#3b82f6'; // blue
  if (displayTarget.includes('へー')) return '#10b981'; // green
  if (displayTarget.includes('みき')) return '#f43f5e'; // pink
  if (displayTarget.includes('ALL')) return '#8b5cf6'; // purple
  return '#94a3b8'; // gray
}

function ExplanationList() {
  const [files, setFiles] = useState<AnswerFile[]>([]);
  const [filterDate, setFilterDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  });
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
    const fetchAnswers = async () => {
      try {
        const q = query(collection(db, 'answers'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const todayStr = past7Days[0].value;
        
        const fetchedFiles: AnswerFile[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = data.date || '';
          const displayDate = rawDate.length === 8 ? `${rawDate.substring(0, 4)}/${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}` : rawDate;
          
          if (data.target === '文法解説' || data.subject === 'evaluation' || data.subject === 'math_explain' || data.subject === 'science_explain' || data.subject === 'english_explain' || data.subject === 'math_jhs_explain') {
            fetchedFiles.push({
              id: doc.id,
              date: displayDate,
              rawDate: rawDate,
              subject: data.subject || '',
              target: data.target || '',
              isToday: rawDate === todayStr,
            });
          }
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
            <div className="logo-icon">✨</div>
            <h1>解説・評価メニュー</h1>
          </div>
          <p className="subtitle">本日の文法解説や総評、エンタメ授業を確認します</p>
        </div>
      </header>

      <main className="main-content">
        <div className="controls" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '1.5rem', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontWeight: 500 }}>
            <Calendar size={20} color="#3b82f6" />
            <span>日付選択:</span>
          </div>
          
          <select 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ flex: 1, minWidth: '150px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: '#f9fafb', color: '#1f2937' }}
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
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', color: '#1f2937' }}
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
            <p>データが見つかりません。</p>
            <p className="empty-sub">解説や総評が作成されるとここに表示されます。</p>
          </div>
        ) : (
          <div className="file-grid">
            {displayFiles.map((file) => {
              const targetName = getDisplayTarget(file.subject, file.target);
              const targetColor = getTargetColor(file.subject, targetName);
              
              return (
                <Link 
                  to={`/explanations/view/${file.id}`}
                  className={`file-card ${file.isToday ? 'is-today' : ''}`}
                  key={file.id}
                  style={{ borderLeft: `6px solid ${targetColor}` }}
                >
                  <div className="card-left">
                    <div className="icon-wrapper">
                      {file.subject === 'evaluation' ? (
                        <Star className="subject-icon text-yellow-500" />
                      ) : (
                        getSubjectIcon(file.subject)
                      )}
                    </div>
                    <div className="card-info">
                      <h3 className="subject-title">
                        {file.subject === 'evaluation' ? '総評レポート' : 
                         file.subject === 'math_explain' ? '算数エンタメ授業' :
                         file.subject === 'science_explain' ? '理科エンタメ授業' :
                         file.subject === 'english_explain' ? '英語エンタメ授業' :
                         getSubjectName(file.subject)}
                      </h3>
                      <p className="target-text">対象: {targetName}</p>
                      <p className="date-text">{file.date}</p>
                    </div>
                  </div>
                  <div className="card-right">
                    <ChevronRight className="arrow-icon" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ExplanationList;

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ChevronRight, FileText, Headphones } from 'lucide-react';
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
  hasAudio: boolean;
  hasPdf: boolean;
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
            hasAudio: !!data.audioData,
            hasPdf: !!data.pdfData || !!data.pdfUrl,
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

  const listeningFiles = displayFiles.filter(f => f.hasAudio);
  const otherFiles = displayFiles.filter(f => !f.hasAudio);

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
          <p className="subtitle">リスニングやプリント問題に挑戦しましょう</p>
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
            <p>問題データが見つかりません。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Listening Section */}
            {listeningFiles.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={24} color="#3b82f6" /> リスニング
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {listeningFiles.map((file) => (
                    <Link 
                      to={`/questions/view/${file.id}`}
                      className="home-card blue"
                      key={file.id}
                      style={{ padding: '1.5rem', borderRadius: '1.5rem', border: file.isToday ? '2px solid #60a5fa' : '4px solid transparent' }}
                    >
                      <div className="home-icon-box" style={{ width: '80px', height: '80px' }}>
                        <Headphones size={40} />
                      </div>
                      <div className="home-card-content">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>英語リスニング</h2>
                        <p style={{ fontSize: '1rem' }}>対象: {file.target.replace(/_/g, ' ')}</p>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>{file.date}</p>
                      </div>
                      <div className="home-card-arrow">
                        <ChevronRight size={32} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other Subjects Section */}
            {otherFiles.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} /> その他の問題（漢字・英語・算数など）
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                  {otherFiles.map((file) => {
                    let subjectName = file.subject;
                    if (subjectName === 'kanji') subjectName = '漢字';
                    if (subjectName === 'vocab') subjectName = '英単語';
                    if (subjectName === 'english_study') subjectName = '英語構文';
                    if (subjectName === 'english') subjectName = '英語';
                    if (subjectName === 'math') subjectName = '算数';
                    
                    return (
                      <Link 
                        to={`/questions/view/${file.id}`}
                        className="small-file-card"
                        key={file.id}
                      >
                        <div className="small-card-left">
                          <div className="small-icon-wrapper">
                            <FileText size={18} color="#6b7280" />
                          </div>
                          <div>
                            <h3 className="small-subject-title">{subjectName}</h3>
                            <p className="small-target-text">{file.target.replace(/_/g, ' ')}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} color="#9ca3af" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

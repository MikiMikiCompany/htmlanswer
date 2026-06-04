import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ArrowLeft } from 'lucide-react';
import './index.css';

export default function QuestionViewer() {
  const { id } = useParams();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [audioData, setAudioData] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [isPdfUrl, setIsPdfUrl] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'questions', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.htmlUrl) {
            try {
              const response = await fetch(data.htmlUrl);
              const text = await response.text();
              setHtmlContent(text);
            } catch (err) {
              console.error(err);
              setHtmlContent('<h2>読み込みに失敗しました。</h2>');
            }
          } else {
            setHtmlContent(data.htmlContent || '');
          }
          
          setAudioData(data.audioUrl || data.audioData || null);
          
          const url = data.pdfUrl;
          if (url) {
            setPdfData(url);
            setIsPdfUrl(true);
          } else {
            setPdfData(data.pdfData || null);
            setIsPdfUrl(false);
          }
        } else {
          setHtmlContent('<h2>問題が見つかりません。</h2>');
        }
      } catch (e) {
        console.error(e);
        setHtmlContent('<h2>エラーが発生しました。</h2>');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="viewer-container">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <header className="viewer-header">
        <Link to="/questions" className="back-button">
          <ArrowLeft size={20} />
          <span>戻る</span>
        </Link>
        <div className="viewer-title">問題確認</div>
      </header>

      <main className="viewer-content" style={{ display: 'flex', flexDirection: 'column', height: pdfData ? '85vh' : 'auto' }}>
        {audioData && (
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ color: '#374151', fontWeight: 'bold', marginBottom: '0.75rem' }}>リスニング音声</h3>
            <audio src={audioData} controls style={{ width: '100%', maxWidth: '400px' }} />
          </div>
        )}
        
        {pdfData ? (
          <iframe 
            src={isPdfUrl ? pdfData : `data:application/pdf;base64,${pdfData}`} 
            style={{ width: '100%', flex: 1, border: 'none', borderRadius: '12px', background: 'white', minHeight: '600px' }}
            title="PDF Document"
          />
        ) : (
          <div style={{ flex: 1, width: '100%', backgroundColor: '#fff', position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: '600px' }}>
            <iframe
              title="Question Content"
              srcDoc={htmlContent}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        )}
      </main>
    </div>
  );
}

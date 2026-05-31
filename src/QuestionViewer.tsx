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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'questions', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHtmlContent(docSnap.data().htmlContent || '');
          setAudioData(docSnap.data().audioData || null);
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

      <main className="viewer-content">
        {audioData && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100 flex flex-col items-center">
            <h3 className="text-gray-700 font-bold mb-3">リスニング音声</h3>
            <audio src={audioData} controls className="w-full max-w-md" />
          </div>
        )}
        
        <div 
          className="html-content-wrapper"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </main>
    </div>
  );
}

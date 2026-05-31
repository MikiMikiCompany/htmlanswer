import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ArrowLeft } from 'lucide-react';
import PasswordLock from './PasswordLock';

export default function AnswerViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'answers', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHtmlContent(docSnap.data().htmlContent || '');
        } else {
          setHtmlContent('<h2>解答が見つかりません。</h2>');
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
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 10 }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ padding: '0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>解答の確認</h1>
      </div>
      <div style={{ flex: 1, width: '100%', backgroundColor: '#fff', position: 'relative' }}>
        <iframe
          title="Answer Content"
          srcDoc={htmlContent}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}

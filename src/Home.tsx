import { Link } from 'react-router-dom';
import { Headphones, KeyRound } from 'lucide-react';
import './index.css';

export default function Home() {
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
            <h1>Study Menu</h1>
          </div>
          <p className="subtitle">学習メニューを選択してください</p>
        </div>
      </header>

      <main className="main-content flex flex-col md:flex-row items-stretch justify-center p-6 gap-6 w-full max-w-4xl mx-auto" style={{ minHeight: '60vh' }}>
        <Link to="/questions" className="w-full md:w-1/2 flex">
          <button className="w-full p-8 md:p-12 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center border-4 border-transparent hover:border-blue-400 group text-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Headphones size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">問題メニュー</h2>
              <p className="text-gray-500 text-lg">リスニング問題などを<br/>パスワードなしで開きます</p>
            </div>
          </button>
        </Link>

        <Link to="/answers" className="w-full md:w-1/2 flex">
          <button className="w-full p-8 md:p-12 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center border-4 border-transparent hover:border-red-400 group text-center gap-6">
            <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <KeyRound size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">解答メニュー</h2>
              <p className="text-gray-500 text-lg">答え合わせをします<br/>（パスワード必須）</p>
            </div>
          </button>
        </Link>
      </main>
    </div>
  );
}

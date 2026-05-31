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

      <main className="main-content flex flex-col items-center justify-center p-6 gap-6" style={{ minHeight: '60vh' }}>
        <Link to="/questions" className="w-full max-w-md">
          <button className="w-full py-8 px-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-between border-2 border-transparent hover:border-blue-400 group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones size={32} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">問題メニュー</h2>
                <p className="text-gray-500 mt-1">リスニング問題などをパスワードなしで開きます</p>
              </div>
            </div>
          </button>
        </Link>

        <Link to="/answers" className="w-full max-w-md">
          <button className="w-full py-8 px-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-between border-2 border-transparent hover:border-red-400 group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <KeyRound size={32} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">解答メニュー</h2>
                <p className="text-gray-500 mt-1">答え合わせをします（パスワード必須）</p>
              </div>
            </div>
          </button>
        </Link>
      </main>
    </div>
  );
}

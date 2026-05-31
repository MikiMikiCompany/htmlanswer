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

      <main className="main-content flex flex-col items-center justify-center p-4 sm:p-6 gap-8 w-full max-w-3xl mx-auto" style={{ minHeight: '70vh' }}>
        <Link to="/questions" className="w-full block">
          <button className="w-full p-6 sm:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left border-4 border-transparent hover:border-blue-400 group gap-6 sm:gap-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner border border-blue-100">
              <Headphones size={48} className="sm:w-16 sm:h-16" />
            </div>
            <div className="flex-1 pt-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">問題メニュー</h2>
              <p className="text-gray-500 text-lg sm:text-xl font-medium leading-relaxed">リスニング問題などを<br className="hidden sm:block" />パスワードなしで開きます</p>
            </div>
            <div className="hidden sm:flex self-center text-gray-300 group-hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        </Link>

        <Link to="/answers" className="w-full block">
          <button className="w-full p-6 sm:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left border-4 border-transparent hover:border-red-400 group gap-6 sm:gap-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner border border-red-100">
              <KeyRound size={48} className="sm:w-16 sm:h-16" />
            </div>
            <div className="flex-1 pt-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">解答メニュー</h2>
              <p className="text-gray-500 text-lg sm:text-xl font-medium leading-relaxed">答え合わせをします<br className="hidden sm:block" />（パスワード必須）</p>
            </div>
            <div className="hidden sm:flex self-center text-gray-300 group-hover:text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </button>
        </Link>
      </main>
    </div>
  );
}

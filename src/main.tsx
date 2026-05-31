import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AnswerViewer from './AnswerViewer.tsx'
import Home from './Home.tsx'
import QuestionList from './QuestionList.tsx'
import QuestionViewer from './QuestionViewer.tsx'
import AuthWrapper from './AuthWrapper.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/view/:id" element={<QuestionViewer />} />
        <Route path="/answers" element={<AuthWrapper><App /></AuthWrapper>} />
        <Route path="/view/:id" element={<AuthWrapper><AnswerViewer /></AuthWrapper>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AnswerViewer from './AnswerViewer'
import Home from './Home'
import QuestionList from './QuestionList'
import QuestionViewer from './QuestionViewer'
import MasterAuthWrapper from './MasterAuthWrapper'
import AuthWrapper from './AuthWrapper'
import ExplanationList from './ExplanationList'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MasterAuthWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/view/:id" element={<QuestionViewer />} />
          <Route path="/explanations" element={<ExplanationList />} />
          <Route path="/explanations/view/:id" element={<AnswerViewer />} />
          <Route path="/answers" element={<AuthWrapper><App /></AuthWrapper>} />
          <Route path="/view/:id" element={<AuthWrapper><AnswerViewer /></AuthWrapper>} />
        </Routes>
      </MasterAuthWrapper>
    </BrowserRouter>
  </StrictMode>,
)

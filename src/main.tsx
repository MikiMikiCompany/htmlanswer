import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AnswerViewer from './AnswerViewer.tsx'
import AuthWrapper from './AuthWrapper.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/view/:id" element={<AnswerViewer />} />
        </Routes>
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>,
)

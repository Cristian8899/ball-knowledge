import './App.css'
import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import CreatedQuizzes from '../CreatedQuizzes'
import Dashboard from '../Dashboard'
import Login from '../Login'
import JoinSession from '../JoinSession'
import ProtectedRoute from '../ProtectedRoute'
import QuizList from '../QuizList'
import QuizCreate from '../QuizCreate'
import QuizDashboard from '../QuizDashboard'
import QuizEditor from '../QuizEditor/QuizEditor'
import QuizLeaderboard from '../QuizLeaderboard'
import QuizQuestion from '../QuizQuestion'
import QuizStart from '../QuizStart'
import Register from '../Register'
import GuestRegister from '../GuestRegister'

function App () {
  return (
    <Router>
      <div className='app-container'>
        <Routes>
          <Route exact path='/' element={<Dashboard />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route path='/guest-register' element={<GuestRegister />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/quizzes' element={<QuizList />} />
          {/* <Route path='/quizzes/:quizId' element={<QuizPlayer />} /> */}
          <Route path='/quiz-creation' element={<ProtectedRoute element={<QuizCreate />} />} />
          <Route path='/quizzes/:quizId' element={<QuizStart />} />
          <Route path='/quizzes/:quizId/leaderboard' element={<QuizLeaderboard />} />
          <Route path='/quizzes/:quizId/questions/:questionId' element={<QuizQuestion />} />
          <Route path='/created-quizzes' element={<ProtectedRoute element={<CreatedQuizzes />} />} />
          <Route path='/created-quizzes/:quizId' element={<ProtectedRoute element={<QuizEditor />} />} />
          <Route path='/join-session' element={<JoinSession />} />
          <Route path='/play' element={<QuizDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

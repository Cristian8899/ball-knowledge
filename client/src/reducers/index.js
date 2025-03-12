import { combineReducers } from 'redux'
import createdQuiz from './created-quiz-reducer'
import createdQuizzes from './created-quizzes-reducer'
import loginUser from './login-user-reducer'
import publicQuizzes from './public-quizzes-reducer'
import randomQuiz from './random-quiz-reducer'
import quiz from './quiz-reducer'
import question from './question-reducer'
import register from './register-user-reducer'

export default combineReducers({
  createdQuiz,
  createdQuizzes,
  loginUser,
  publicQuizzes,
  question,
  quiz,
  randomQuiz,
  register
})

import { useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { quizActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './QuizDashboard.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const QuizDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.loginUser)
  const randomQuizId = useSelector(state => state.randomQuiz?.randomQuizId)

  useEffect(() => {
    dispatch(quizActions.getRandomQuiz())
  }, [dispatch])

  const handlePlayRandom = () => {
    if (!user) {
      navigate('/guest-register', { state: { redirectTo: `/quizzes/${randomQuizId}` } })
      return
    }
    if (randomQuizId) {
      navigate(`/quizzes/${randomQuizId}`)
    }
  }

  return (
    <div className='quiz-dashboard-container'>
      <Button
        label='Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/')}
      />
      <h1 className='quiz-dashboard-title'>{assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.TITLE}</h1>
      <p className='quiz-dashboard-subtitle'>{assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.SUBTITLE}</p>

      <div className='quiz-dashboard-container__cards'>
        <Card
          className='quiz-dashboard-card random-card'
          title={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.RANDOM.TITLE}
          subTitle={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.RANDOM.SUBTITLE}
          footer={(
            <Button
              label={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.RANDOM.BUTTON}
              icon='pi pi-random'
              className='p-button-primary p-button-lg p-button-rounded'
              onClick={handlePlayRandom}
            />
          )}
        />

        <Card
          className='quiz-dashboard-card join-session-card'
          title={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.JOIN_SESSION.TITLE}
          subTitle={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.JOIN_SESSION.SUBTITLE}
          footer={(
            <Button
              label={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.JOIN_SESSION.BUTTON}
              icon='pi pi-sign-in'
              className='p-button-warning p-button-lg p-button-rounded'
              onClick={() => navigate('/join-session')}
            />
          )}
        />

        <Card
          className='quiz-dashboard-card choose-card'
          title={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.CHOOSE_QUIZ.TITLE}
          subTitle={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.CHOOSE_QUIZ.SUBTITLE}
          footer={(
            <Button
              label={assets.BALL_KNOWLEDGE.QUIZ_DASHBOARD.OPTIONS.CHOOSE_QUIZ.BUTTON}
              icon='pi pi-list'
              className='p-button-success p-button-lg p-button-rounded'
              onClick={() => navigate('/quizzes')}
            />
          )}
        />
      </div>
    </div>
  )
}

export default QuizDashboard

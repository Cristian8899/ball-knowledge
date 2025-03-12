import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { quizActions } from '../../actions'
import socket from '../../socket'
import assets from '../../assets/texts_EN'
import './QuizStart.css'

const QuizStart = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.loginUser)
  const { quiz, fetching, error } = useSelector(state => state.quiz)

  const [sessionKey, setSessionKey] = useState('')
  const [players, setPlayers] = useState([])

  useEffect(() => {
    window.localStorage.removeItem('sessionKey')
  }, [])

  useEffect(() => {
    dispatch(quizActions.getPublicQuiz(quizId))
  }, [dispatch, quizId])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
  }, [])

  useEffect(() => {
    socket.on('sessionCreated', ({ key }) => {
      setSessionKey(key)
      window.localStorage.setItem('sessionKey', key)
    })

    socket.on('playerListUpdate', updatedPlayers => {
      setPlayers(updatedPlayers)
    })

    socket.on('gameStarted', ({ questionId }) => {
      navigate(`/quizzes/${quizId}/questions/${questionId}`)
    })
    const storedSessionKey = window.localStorage.getItem('sessionKey')
    if (!storedSessionKey && quiz && user?._id) {
      socket.emit('createSession', { quizId, userId: user._id })
    }

    return () => {
      socket.off('sessionCreated')
      socket.off('playerListUpdate')
      socket.off('gameStarted')
    }
  }, [quiz, user, navigate, quizId])

  const startQuiz = () => {
    socket.emit('startGame', { sessionKey })
  }

  if (fetching) {
    return (
      <div className='quiz-start-container'>
        <h2>{assets.BALL_KNOWLEDGE.QUIZ_START.LOADING}</h2>
      </div>
    )
  }

  if (error || !quiz || !quiz.title || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className='quiz-start-container'>
        <h2>{assets.BALL_KNOWLEDGE.QUIZ_START.NOT_FOUND}</h2>
        <Button
          label='Back to Quizzes'
          className='p-button-secondary'
          onClick={() => navigate('/quizzes')}
        />
      </div>
    )
  }

  return (
    <div className='quiz-start-container'>
      <Button
        label='Quiz Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/play')}
      />
      <Card className='quiz-start-card'>
        <h1 className='quiz-title'>{quiz.title}</h1>
        <p className='quiz-category'>
          <strong>{assets.BALL_KNOWLEDGE.QUIZ_START.CATEGORY}</strong> {quiz.category}
        </p>
        <p className='quiz-difficulty'>
          <strong>{assets.BALL_KNOWLEDGE.QUIZ_START.DIFFICULTY}</strong> {quiz.difficulty}
        </p>

        {sessionKey
          ? (
            <>
              <p className='session-key'>
                <strong>{assets.BALL_KNOWLEDGE.QUIZ_START.SESSION_KEY}</strong> {sessionKey}
              </p>
              <h3>{assets.BALL_KNOWLEDGE.QUIZ_START.PLAYERS}</h3>
              <ul className='player-list'>
                {players.map((player, index) => (
                  <li key={index}>{player?.user?.username}</li>
                ))}
              </ul>
              {user?._id === players[0]?.user?._id && (
                <Button
                  label={assets.BALL_KNOWLEDGE.QUIZ_START.BUTTON_START}
                  icon='pi pi-play'
                  className='p-button-success p-button-lg start-btn'
                  onClick={startQuiz}
                />
              )}
            </>
            )
          : (
            <p>{assets.BALL_KNOWLEDGE.QUIZ_START.WAITING}</p>
            )}
      </Card>
    </div>
  )
}

export default QuizStart

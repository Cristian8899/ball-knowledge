import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { quizActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './QuizQuestion.css'
import socket from '../../socket'

const QuizQuestion = () => {
  const { quizId, questionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.loginUser)
  const { question, fetching, error } = useSelector(state => state.question)

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timer, setTimer] = useState(10)
  const [feedback, setFeedback] = useState(null)

  const storedSessionKey = window.localStorage.getItem('sessionKey')

  useEffect(() => {
    dispatch(quizActions.getQuizQuestion(quizId, questionId))

    socket.on('timerUpdate', ({ timeLeft }) => {
      setTimer(timeLeft)
    })

    socket.on('questionFeedback', ({ correctAnswer }) => {
      setFeedback(correctAnswer)
    })

    socket.on('nextQuestion', ({ questionId }) => {
      setFeedback(null)
      setIsSubmitted(false)
      setSelectedAnswer(null)
      setTimer(10)
      navigate(`/quizzes/${quizId}/questions/${questionId}`)
    })

    socket.on('gameFinished', () => {
      navigate(`/quizzes/${quizId}/leaderboard`)
    })

    return () => {
      socket.off('timerUpdate')
      socket.off('questionFeedback')
      socket.off('nextQuestion')
      socket.off('gameFinished')
    }
  }, [dispatch, quizId, questionId, navigate])

  if (fetching) {
    return <div className='quiz-question-container'><h2>{assets.BALL_KNOWLEDGE.QUIZ_QUESTION.LOADING}</h2></div>
  }

  if (error || !question || !question.options) {
    return (
      <div className='quiz-question-container'>
        <h2>{assets.BALL_KNOWLEDGE.QUIZ_QUESTION.NOT_FOUND}</h2>
        <Button label='Back to Quiz' className='p-button-secondary' onClick={() => navigate(`/quizzes/${quizId}`)} />
      </div>
    )
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return
    socket.emit('submitAnswer', { sessionKey: storedSessionKey, userId: user._id, answer: selectedAnswer })

    setIsSubmitted(true)
  }

  return (
    <div className='quiz-question-container'>
      <Card className='quiz-question-card'>
        <h1 className='quiz-question-text'>{question.questionText}</h1>
        <p className='quiz-timer'>
          <strong>{assets.BALL_KNOWLEDGE.QUIZ_QUESTION.TIMER}</strong>{timer} {assets.BALL_KNOWLEDGE.QUIZ_QUESTION.SECONDS}
        </p>
        <div className='quiz-options-grid'>
          {question.options.map((option, index) => {
            let optionClass = 'quiz-option-box'
            if (feedback !== null) {
              if (index === feedback) {
                optionClass += ' correct'
              } else if (selectedAnswer === index) {
                optionClass += ' wrong'
              }
            } else if (selectedAnswer === index) {
              optionClass += ' selected'
            }
            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => !isSubmitted && setSelectedAnswer(index)}
              >
                <span>{option}</span>
              </div>
            )
          })}
        </div>

        {feedback !== null && (
          <div className='quiz-feedback-message'>
            {selectedAnswer === feedback
              ? (
                <p className='correct-feedback'>
                  <i className='pi pi-check' /> {assets.BALL_KNOWLEDGE.QUIZ_QUESTION.CORRECT_ANSWER}
                </p>
                )
              : (
                <p className='incorrect-feedback'>
                  <i className='pi pi-times' /> {assets.BALL_KNOWLEDGE.QUIZ_QUESTION.INCORRECT_ANSWER}
                </p>
                )}
          </div>
        )}

        {isSubmitted
          ? (
            <p>{assets.BALL_KNOWLEDGE.QUIZ_QUESTION.WAITING_NEXT}</p>
            )
          : (
            <Button
              label={assets.BALL_KNOWLEDGE.QUIZ_QUESTION.BUTTON_SUBMIT}
              icon='pi pi-check'
              className='p-button-success p-button-lg quiz-submit-btn'
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
            />
            )}
      </Card>
    </div>
  )
}

export default QuizQuestion

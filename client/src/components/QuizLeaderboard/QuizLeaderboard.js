import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import socket from '../../socket'
import { loginActions, stateActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './QuizLeaderboard.css'

const QuizLeaderboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { quizId } = useParams()
  const [players, setPlayers] = useState([])
  const { user } = useSelector(state => state.loginUser)

  const storedSessionKey = window.localStorage.getItem('sessionKey')

  useEffect(() => {
    socket.emit('getLeaderboard', { sessionKey: storedSessionKey })

    socket.on('leaderboardUpdate', updatedPlayers => {
      setPlayers(updatedPlayers)
    })

    return () => {
      socket.off('leaderboardUpdate')
    }
  }, [storedSessionKey])

  const sortedPlayers = players.slice().sort((a, b) => b.score - a.score)

  const handleLogout = () => {
    if (user && user.isTemporaryUser) {
      dispatch(loginActions.logout())
      dispatch(stateActions.resetState())
    }
    navigate('/dashboard')
  }

  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalId)
          handleLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalId)
  }, [dispatch, navigate, quizId, user])

  return (
    <div className='quiz-leaderboard-container'>
      <Card className='quiz-leaderboard-card'>
        <h1 className='leaderboard-title'>{assets.BALL_KNOWLEDGE.QUIZ_LEADERBOARD.TITLE}</h1>
        <ul className='leaderboard-list'>
          {sortedPlayers.map((player, index) => (
            player.user?.username && (
              <li key={player.user._id} className='leaderboard-item'>
                <span>{index + 1}. {player.user.username}</span>
                <strong>{player.score} {assets.BALL_KNOWLEDGE.QUIZ_LEADERBOARD.POINTS}</strong>
              </li>
            )
          ))}
        </ul>
        <p className='auto-logout-timer'>
          {assets.BALL_KNOWLEDGE.QUIZ_LEADERBOARD.RETURN_MESSAGE.replace('{countdown}', countdown)}
        </p>
        <Button
          label={assets.BALL_KNOWLEDGE.QUIZ_LEADERBOARD.BUTTON_HOME}
          className='p-button-primary p-button-lg'
          onClick={handleLogout}
        />
      </Card>
    </div>
  )
}

export default QuizLeaderboard

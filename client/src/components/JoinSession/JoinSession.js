import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import socket from '../../socket'
import assets from '../../assets/texts_EN'
import './JoinSession.css'
import { useSelector } from 'react-redux'

const JoinSession = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sessionKeyInput, setSessionKeyInput] = useState('')
  const [players, setPlayers] = useState([])

  const { user } = useSelector(state => state.loginUser)

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
  }, [])

  const joinSession = () => {
    if (!sessionKeyInput.trim()) return
    if (!user) {
      navigate('/guest-register', { state: { redirectTo: '/join-session', sessionKey: sessionKeyInput } })
    } else {
      if (socket.connected) {
        socket.emit('joinSession', { sessionKey: sessionKeyInput, userId: user._id })
      } else {
        console.warn(assets.BALL_KNOWLEDGE.JOIN_SESSION.TOAST.SOCKET_WARNING)
      }
    }
  }

  useEffect(() => {
    if (location.state?.sessionKey) {
      setSessionKeyInput(location.state.sessionKey)
      if (user) {
        socket.emit('joinSession', { sessionKey: location.state.sessionKey, userId: user._id })
      }
    }
  }, [location.state, user])

  useEffect(() => {
    socket.on('joinSuccess', ({ quizId, sessionKey, players }) => {
      window.localStorage.setItem('sessionKey', sessionKey)
      window.localStorage.setItem('quizId', quizId)
      navigate(`/quizzes/${quizId}`)
    })

    socket.on('playerListUpdate', updatedPlayers => {
      setPlayers(updatedPlayers)
    })

    return () => {
      socket.off('playerListUpdate')
      socket.off('gameStarted')
      socket.off('joinSuccess')
    }
  }, [navigate])

  return (
    <div className='join-session-container'>
      <Button
        label='Quiz Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/play')}
      />
      <Card className='join-session-card'>
        <h1>{assets.BALL_KNOWLEDGE.JOIN_SESSION.TITLE}</h1>
        <InputText
          placeholder={assets.BALL_KNOWLEDGE.JOIN_SESSION.INPUT_PLACEHOLDER}
          value={sessionKeyInput}
          onChange={e => setSessionKeyInput(e.target.value)}
        />
        <Button
          label={assets.BALL_KNOWLEDGE.JOIN_SESSION.BUTTON_JOIN}
          onClick={joinSession}
          className='p-button-primary'
        />
        <div className='players-list'>
          <h3>{assets.BALL_KNOWLEDGE.JOIN_SESSION.PLAYERS_JOINED}</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.username}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default JoinSession

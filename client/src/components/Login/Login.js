import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { loginActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './Login.css'

const userSelector = state => state.loginUser.user
const errorSelector = state => state.loginUser.error

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useRef(null)

  const user = useSelector(userSelector)
  const error = useSelector(errorSelector)

  useEffect(() => {
    if (error) {
      const errorDetail = error.response?.data?.message || assets.BALL_KNOWLEDGE.LOGIN.TOAST.ERROR_MESSAGE
      toast.current.show({
        severity: 'error',
        summary: assets.BALL_KNOWLEDGE.LOGIN.TOAST.ERROR_TITLE,
        detail: errorDetail,
        life: 3000
      })
      dispatch({ type: 'RESET_LOGIN' })
    }
  }, [error, dispatch])

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleLogin = () => {
    if (username && password) {
      dispatch(loginActions.login(username, password))
    } else {
      toast.current.show({
        severity: 'warn',
        summary: assets.BALL_KNOWLEDGE.LOGIN.TOAST.MISSING_CREDENTIALS_TITLE,
        detail: assets.BALL_KNOWLEDGE.LOGIN.TOAST.MISSING_CREDENTIALS_MESSAGE,
        life: 3000
      })
    }
  }

  return (
    <div className='login-container'>
      <Button
        label='Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/')}
      />
      <Card className='login-card'>
        <Toast ref={toast} />
        <h2>{assets.BALL_KNOWLEDGE.LOGIN.TITLE}</h2>
        <div className='login-input-group'>
          <InputText
            placeholder={assets.BALL_KNOWLEDGE.LOGIN.INPUTS.PLACEHOLDER_USERNAME}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='login-input'
          />
          <Password
            placeholder={assets.BALL_KNOWLEDGE.LOGIN.INPUTS.PLACEHOLDER_PASSWORD}
            feedback={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='login-input'
          />
        </div>
        <Button label={assets.BALL_KNOWLEDGE.LOGIN.BUTTON_LOGIN} icon='pi pi-sign-in' className='p-button-success login-btn' onClick={handleLogin} />
        <p> {assets.BALL_KNOWLEDGE.LOGIN.LINK_SIGNUP_TEXT}{' '} <span className='login-link' onClick={() => navigate('/register')}>{assets.BALL_KNOWLEDGE.LOGIN.LINK_SIGNUP}</span></p>
      </Card>
    </div>
  )
}

export default Login

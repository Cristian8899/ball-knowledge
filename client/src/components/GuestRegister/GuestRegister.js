import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { loginActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './GuestRegister.css'

const GuestRegister = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const toast = useRef(null)

  const { fetching, fetched, error } = useSelector(state => state.loginUser)

  const [formData, setFormData] = useState({
    username: '',
    fullName: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
    dispatch(loginActions.createGuestUser(formData.username, formData.fullName))
  }

  useEffect(() => {
    if (submitted && fetched && !fetching) {
      toast.current.show({
        severity: 'success',
        summary: assets.BALL_KNOWLEDGE.GUEST_REGISTER.TOAST.SUCCESS_TITLE,
        detail: assets.BALL_KNOWLEDGE.GUEST_REGISTER.TOAST.SUCCESS_MESSAGE,
        life: 3000
      })
      const redirectTo = location.state?.redirectTo || '/quizzes'
      navigate(redirectTo, { state: location.state })
    }
  }, [submitted, fetched, fetching, navigate, location.state])

  useEffect(() => {
    if (error) {
      toast.current.show({
        severity: 'error',
        summary: assets.BALL_KNOWLEDGE.GUEST_REGISTER.TOAST.ERROR_TITLE,
        detail: error?.message || assets.BALL_KNOWLEDGE.GUEST_REGISTER.TOAST.ERROR_MESSAGE,
        life: 3000
      })
    }
  }, [error])

  return (
    <div className='guest-register-container'>
      <Toast ref={toast} />
      <Button
        label='Quiz Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/play')}
      />
      <Card className='guest-register-card'>
        <h2>{assets.BALL_KNOWLEDGE.GUEST_REGISTER.TITLE}</h2>
        <form onSubmit={handleSubmit}>
          <InputText
            placeholder={assets.BALL_KNOWLEDGE.GUEST_REGISTER.FORM.PLACEHOLDER_USERNAME}
            name='username'
            value={formData.username}
            onChange={handleChange}
            className='guest-register-input'
            required
          />
          <InputText
            placeholder={assets.BALL_KNOWLEDGE.GUEST_REGISTER.FORM.PLACEHOLDER_FULLNAME}
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            className='guest-register-input'
            required
          />
          <Button
            label={fetching ? assets.BALL_KNOWLEDGE.GUEST_REGISTER.FORM.BUTTON_JOINING : assets.BALL_KNOWLEDGE.GUEST_REGISTER.FORM.BUTTON_JOIN}
            icon='pi pi-sign-in'
            className='p-button-primary guest-register-btn'
            disabled={fetching}
          />
        </form>
      </Card>
    </div>
  )
}

export default GuestRegister

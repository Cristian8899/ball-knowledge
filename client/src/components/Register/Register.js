import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { loginActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useRef(null)

  const { fetching, fetched, error } = useSelector(state => state.register)

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (fetched && !fetching) {
      toast.current.show({
        severity: 'success',
        summary: assets.BALL_KNOWLEDGE.REGISTER.TOAST.SUCCESS_TITLE,
        detail: assets.BALL_KNOWLEDGE.REGISTER.TOAST.SUCCESS_MESSAGE,
        life: 3000
      })
      navigate('/login')
    }
  }, [fetched, fetching, navigate])

  useEffect(() => {
    if (error) {
      toast.current.show({
        severity: 'error',
        summary: assets.BALL_KNOWLEDGE.REGISTER.TOAST.ERROR_TITLE,
        detail: error?.message || assets.BALL_KNOWLEDGE.REGISTER.TOAST.ERROR_MESSAGE,
        life: 3000
      })
    }
  }, [error])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.current.show({
        severity: 'warn',
        summary: assets.BALL_KNOWLEDGE.REGISTER.TOAST.PASSWORD_MISMATCH_TITLE,
        detail: assets.BALL_KNOWLEDGE.REGISTER.TOAST.PASSWORD_MISMATCH_MESSAGE,
        life: 3000
      })
      return
    }
    dispatch(loginActions.register(formData.username, formData.password, formData.fullName, formData.email))
  }

  return (
    <div className='register-container'>
      <Toast ref={toast} />
      <Button
        label='Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/')}
      />
      <Card className='register-card'>
        <h2>{assets.BALL_KNOWLEDGE.REGISTER.TITLE}</h2>
        <form onSubmit={handleSubmit}>
          <InputText placeholder={assets.BALL_KNOWLEDGE.REGISTER.FORM.PLACEHOLDER_USERNAME} name='username' value={formData.username} onChange={handleChange} className='register-input' required />
          <InputText placeholder={assets.BALL_KNOWLEDGE.REGISTER.FORM.PLACEHOLDER_FULLNAME} name='fullName' value={formData.fullName} onChange={handleChange} className='register-input' required />
          <InputText type='email' placeholder={assets.BALL_KNOWLEDGE.REGISTER.FORM.PLACEHOLDER_EMAIL} name='email' value={formData.email} onChange={handleChange} className='register-input' required />
          <InputText type='password' placeholder={assets.BALL_KNOWLEDGE.REGISTER.FORM.PLACEHOLDER_PASSWORD} name='password' value={formData.password} onChange={handleChange} className='register-input' required />
          <InputText type='password' placeholder={assets.BALL_KNOWLEDGE.REGISTER.FORM.PLACEHOLDER_CONFIRM_PASSWORD} name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} className='register-input' required />
          <Button label={fetching ? assets.BALL_KNOWLEDGE.REGISTER.FORM.BUTTON_REGISTERING : assets.BALL_KNOWLEDGE.REGISTER.FORM.BUTTON_REGISTER} icon='pi pi-user-plus' className='p-button-primary register-btn' disabled={fetching} />
        </form>
        <p>{assets.BALL_KNOWLEDGE.REGISTER.ALREADY_ACCOUNT}<span className='register-link' onClick={() => navigate('/login')}>{assets.BALL_KNOWLEDGE.REGISTER.BUTTON_LOGIN}</span></p>
      </Card>
    </div>
  )
}

export default Register

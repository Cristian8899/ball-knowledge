import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { loginActions, stateActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './Dashboard.css'

const isAuthenticatedSelector = state => state.loginUser?.user?.token
const userSelector = state => state.loginUser?.user

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(isAuthenticatedSelector)
  const user = useSelector(userSelector)

  const handleLogout = () => {
    dispatch(loginActions.logout())
    dispatch(stateActions.resetState())
    navigate('/')
  }

  return (
    <div className='dashboard-container'>
      <h1 className='dashboard-title'>{assets.BALL_KNOWLEDGE.DASHBOARD.TITLE}</h1>
      <p className='dashboard-subtitle'>{assets.BALL_KNOWLEDGE.DASHBOARD.SUBTITLE}</p>

      <div className='quiz-container'>
        <Card
          className='quiz-card play-card'
          title={assets.BALL_KNOWLEDGE.DASHBOARD.PLAY_QUIZ.TITLE}
          subTitle={assets.BALL_KNOWLEDGE.DASHBOARD.PLAY_QUIZ.SUBTITLE}
          footer={(
            <Button
              label={assets.BALL_KNOWLEDGE.DASHBOARD.PLAY_QUIZ.BUTTON}
              icon='pi pi-play'
              className='p-button-success p-button-lg p-button-rounded'
              onClick={() => navigate('/play')}
            />
          )}
        />

        {isAuthenticated && !user?.isTemporaryUser && (
          <Card
            className='quiz-card created-quizzes-card'
            title={assets.BALL_KNOWLEDGE.DASHBOARD.CREATED_QUIZZES.TITLE}
            subTitle={assets.BALL_KNOWLEDGE.DASHBOARD.CREATED_QUIZZES.SUBTITLE}
            footer={(
              <Button
                label={assets.BALL_KNOWLEDGE.DASHBOARD.CREATED_QUIZZES.BUTTON}
                icon='pi pi-folder'
                className='p-button-warning p-button-lg p-button-rounded'
                onClick={() => navigate('/created-quizzes')}
              />
            )}
          />
        )}

        <Card
          className='quiz-card login-card'
          title={
            isAuthenticated
              ? (user?.isTemporaryUser
                  ? assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.GUEST_EXIT_TITLE
                  : assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.LOGOUT_TITLE)
              : assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.LOGIN_TITLE
          }
          subTitle={
            isAuthenticated
              ? (user?.isTemporaryUser
                  ? assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.GUEST_EXIT_SUBTITLE
                  : assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.LOGOUT_SUBTITLE)
              : assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.LOGIN_SUBTITLE
          }
          footer={(
            <Button
              label={
                isAuthenticated
                  ? (user?.isTemporaryUser
                      ? assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.BUTTON_EXIT_GUEST
                      : assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.BUTTON_LOGOUT)
                  : assets.BALL_KNOWLEDGE.DASHBOARD.AUTHENTICATION.BUTTON_LOGIN
              }
              icon={isAuthenticated ? 'pi pi-sign-out' : 'pi pi-sign-in'}
              className={`p-button-lg p-button-rounded ${isAuthenticated ? 'p-button-danger' : 'p-button-info'}`}
              onClick={() => (isAuthenticated ? handleLogout() : navigate('/login'))}
            />
          )}
        />
      </div>
    </div>
  )
}

export default Dashboard

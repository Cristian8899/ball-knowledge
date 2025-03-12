import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { Checkbox } from 'primereact/checkbox'
import { quizActions } from '../../actions'
import assets from '../../assets/texts_EN'
import './QuizCreate.css'

const QuizCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useRef(null)

  const { user } = useSelector(state => state.loginUser)

  const [quiz, setQuiz] = useState({
    title: '',
    category: '',
    difficulty: 'Medium',
    questions: [],
    isPublic: false
  })

  const difficultyOptions = [
    { label: assets.BALL_KNOWLEDGE.QUIZ_CREATE.DIFFICULTY_OPTIONS.EASY, value: 'Easy' },
    { label: assets.BALL_KNOWLEDGE.QUIZ_CREATE.DIFFICULTY_OPTIONS.MEDIUM, value: 'Medium' },
    { label: assets.BALL_KNOWLEDGE.QUIZ_CREATE.DIFFICULTY_OPTIONS.HARD, value: 'Hard' }
  ]

  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: null
  })

  const handleQuizChange = (e, field) => {
    setQuiz({ ...quiz, [field]: e.target.value })
  }

  const handleQuestionChange = (e, index) => {
    const updatedOptions = [...newQuestion.options]
    updatedOptions[index] = e.target.value
    setNewQuestion({ ...newQuestion, options: updatedOptions })

    if (!updatedOptions[newQuestion.correctAnswer]) {
      setNewQuestion(prev => ({ ...prev, correctAnswer: null }))
    }
  }

  const toggleIsPublic = () => {
    setQuiz(prevQuiz => ({ ...prevQuiz, isPublic: !prevQuiz.isPublic }))
  }

  const addQuestion = () => {
    if (
      !newQuestion.questionText.trim() ||
      newQuestion.options.some(opt => !opt.trim()) ||
      newQuestion.correctAnswer === null
    ) {
      toast.current.show({
        severity: 'warn',
        summary: assets.BALL_KNOWLEDGE.QUIZ_CREATE.TOAST.INCOMPLETE_QUESTION_TITLE,
        detail: assets.BALL_KNOWLEDGE.QUIZ_CREATE.TOAST.INCOMPLETE_QUESTION_MESSAGE,
        life: 3000
      })
      return
    }

    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion]
    })

    setNewQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: null })
  }

  const removeQuestion = index => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = () => {
    if (!quiz.title.trim() || !quiz.category.trim() || quiz.questions.length === 0) {
      toast.current.show({
        severity: 'error',
        summary: assets.BALL_KNOWLEDGE.QUIZ_CREATE.TOAST.QUIZ_INCOMPLETE_TITLE,
        detail: assets.BALL_KNOWLEDGE.QUIZ_CREATE.TOAST.QUIZ_INCOMPLETE_MESSAGE,
        life: 3000
      })
      return
    }

    const quizData = { ...quiz, owner: user._id }

    dispatch(quizActions.addQuiz(quizData, user._id))

    navigate('/created-quizzes')
  }

  return (
    <div className='quiz-create-container'>
      <Toast ref={toast} />
      <Button
        label='Dashboard'
        icon='pi pi-arrow-left'
        className='p-button-secondary dashboard-btn'
        onClick={() => navigate('/')}
      />
      <h1 className='quiz-create-title'>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.TITLE}</h1>

      <Card className='quiz-form-card'>
        <label>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.FORM.LABEL_TITLE}</label>
        <InputText
          value={quiz.title}
          onChange={e => handleQuizChange(e, 'title')}
          className='quiz-input'
        />

        <label>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.FORM.LABEL_CATEGORY}</label>
        <InputText
          value={quiz.category}
          onChange={e => handleQuizChange(e, 'category')}
          className='quiz-input'
        />

        <label>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.FORM.LABEL_DIFFICULTY}</label>
        <Dropdown
          value={quiz.difficulty}
          options={difficultyOptions}
          onChange={e => handleQuizChange(e, 'difficulty')}
          className='quiz-dropdown'
        />

        <div className='public-checkbox'>
          <Checkbox
            inputId='isPublic'
            checked={quiz.isPublic}
            onChange={toggleIsPublic}
          />
          <label htmlFor='isPublic' style={{ marginLeft: '10px' }}>
            {quiz.isPublic ? 'Public' : 'Private'}
          </label>
        </div>

        <div className='question-section'>
          <h3>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.SECTION_TITLE}</h3>
          <InputText
            placeholder={assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.PLACEHOLDER_QUESTION}
            value={newQuestion.questionText}
            onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            className='quiz-input'
          />

          {newQuestion.options.map((option, index) => (
            <InputText
              key={index}
              placeholder={`${assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.PLACEHOLDER_OPTION} ${index + 1}`}
              value={option}
              onChange={e => handleQuestionChange(e, index)}
              className='quiz-input'
            />
          ))}

          <label>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.LABEL_CORRECT_ANSWER}</label>
          <Dropdown
            value={newQuestion.correctAnswer}
            options={newQuestion.options
              .map((opt, idx) => opt.trim() ? { label: opt, value: idx } : null)
              .filter(Boolean)} // Removes empty options
            onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.value })}
            className='quiz-dropdown'
            placeholder={assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.PLACEHOLDER_CORRECT_ANSWER}
          />

          <Button
            label={assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.BUTTON_ADD_QUESTION}
            icon='pi pi-plus'
            className='p-button-primary add-question-btn'
            onClick={addQuestion}
          />
        </div>

        <div className='question-list'>
          <h3>{assets.BALL_KNOWLEDGE.QUIZ_CREATE.QUESTIONS.SECTION_LIST_TITLE}</h3>
          {quiz.questions.map((q, index) => (
            <div key={index} className='question-item'>
              <p>{q.questionText}</p>
              <Button
                icon='pi pi-trash'
                className='p-button-danger'
                onClick={() => removeQuestion(index)}
              />
            </div>
          ))}
        </div>

        <Button
          label={assets.BALL_KNOWLEDGE.QUIZ_CREATE.BUTTON_SUBMIT}
          icon='pi pi-check'
          className='p-button-success'
          onClick={handleSubmit}
        />
      </Card>
    </div>
  )
}

export default QuizCreate
